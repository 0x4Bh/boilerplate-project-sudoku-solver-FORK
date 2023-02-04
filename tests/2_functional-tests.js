const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
import { puzzlesAndSolutions } from "../controllers/puzzle-strings.js";
let validPuzzleString = puzzlesAndSolutions[5][0]; // .3..927.....5.....6..37.9.....6...3......5...7...2.6.12..........51...2.....69.18
let validPuzzleStringSolution = puzzlesAndSolutions[5][1]; // 431892765972546183658371942529614837163785294784923651216458379895137426347269518


suite('Functional Tests', () => {
    test('1. Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        puzzlesAndSolutions.forEach(puzzle => {
            chai.request(server)
                .post('/api/solve')
                .send({ "puzzle": puzzle[0] })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.property(res.body, 'solution');
                    assert.deepStrictEqual(res.body.solution, puzzle[1]);
                });
        });
        done();
    });
    test('2. Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error');
                assert.deepStrictEqual(res.body.error, 'Required field missing');
                done();
            });
    });
    test('3. Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        let invalidPuzzleString = validPuzzleString.slice(3) + 'ABC';
        chai.request(server)
            .post('/api/solve')
            .send({ "puzzle": invalidPuzzleString })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error');
                assert.deepStrictEqual(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });
    test('4. Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
        chai.request(server)
            .post('/api/solve')
            .send({ "puzzle": validPuzzleString.slice(5) })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error');
                assert.deepStrictEqual(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });
    test('5. Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
        // solvable // .3..927.....5.....6..37.9.....6...3......5...7...2.6.12..........51...2.....69.18
        // unsolvable // .[2]..927.....5.....6..37.9.....6...3......5...7...2.6.12..........51...2.....69.18
        let invalidPuzzleString = validPuzzleString.slice(0, 1) + "2" + validPuzzleString.slice(2);
        chai.request(server)
            .post('/api/solve')
            .send({ "puzzle": invalidPuzzleString })
            .end((err, res) => {
                assert.deepStrictEqual(invalidPuzzleString, '.2..927.....5.....6..37.9.....6...3......5...7...2.6.12..........51...2.....69.18');
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error');
                assert.deepStrictEqual(res.body.error, 'Puzzle cannot be solved');
                done();
            });
    });
    test('6. Check a puzzle placement with all fields: POST request to /api/check', (done) => {
        // .3..927.*
        // ...5.....
        // 6..37.9..
        // ...6...3.
        // .....5...
        // 7...2.6.1
        // 2........
        // ..51...2.
        // ....69.18
        // * is A9
        chai.request(server)
            .post('/api/check')
            .send({ "puzzle": validPuzzleString, "coordinate": "A9", "value": 4 })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, "valid");
                assert.deepStrictEqual(res.body.valid, true);
                done();
            });
    });
    test('7. Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
        // .3..927.*
        // ...5.....
        // 6..37.9..
        // ...6...3.
        // .....5...
        // 7...2.6.1
        // 2........
        // ..51...2.
        // ....69.18
        // * is A9
        chai.request(server)
            .post('/api/check')
            .send({ "puzzle": validPuzzleString, "coordinate": "A9", "value": 1 })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'valid');
                assert.deepStrictEqual(res.body.valid, false);
                assert.property(res.body, 'conflict');
                assert.deepStrictEqual(res.body.conflict, ["column"]);
                done();
            });
    });
    test('8. Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
        // .3..927.*
        // ...5.....
        // 6..37.9..
        // ...6...3.
        // .....5...
        // 7...2.6.1
        // 2........
        // ..51...2.
        // ....69.18
        // * is A9
        chai.request(server)
            .post('/api/check')
            .send({ "puzzle": validPuzzleString, "coordinate": "A9", "value": 9 })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'valid');
                assert.deepStrictEqual(res.body.valid, false);
                assert.property(res.body, 'conflict');
                assert.deepStrictEqual(res.body.conflict, ["row", "region"]);
                done();
            });
    });
    test('9. Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
        // .3..927..
        // ...5.....
        // 6..37.9..
        // ...6...3.
        // .....5...
        // 7...2.6.1
        // 2........
        // ..51...2*
        // ....69.18
        // * is H9
        chai.request(server)
            .post('/api/check')
            .send({ "puzzle": validPuzzleString, "coordinate": "H9", "value": 1 })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'valid');
                assert.deepStrictEqual(res.body.valid, false);
                assert.property(res.body, 'conflict');
                assert.deepStrictEqual(res.body.conflict, ["row", "column", "region"]);
                done();
            });
    });
    test('10. Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error');
                assert.deepStrictEqual(res.body.error, 'Required field(s) missing');
                done();
            });
    });
    test('11. Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
        let invalidPuzzleString = validPuzzleString.slice(0, 1) + "X" + validPuzzleString.slice(2);
        chai.request(server)
            .post('/api/check')
            .send({ "puzzle": invalidPuzzleString, "coordinate": "A9", "value": 4 })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error');
                assert.deepStrictEqual(res.body.error, 'Invalid characters in puzzle');
                done();
            });
    });
    test('12. Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
        let invalidPuzzleString = validPuzzleString.slice(1);
        chai.request(server)
            .post('/api/check')
            .send({ "puzzle": invalidPuzzleString, "coordinate": "A9", "value": 4 })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error');
                assert.deepStrictEqual(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            });
    });
    test('13. Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ "puzzle": validPuzzleString, "coordinate": "A99", "value": 4 })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error');
                assert.deepStrictEqual(res.body.error, 'Invalid coordinate');
                done();
            });
    });
    test('14. Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
        chai.request(server)
            .post('/api/check')
            .send({ "puzzle": validPuzzleString, "coordinate": "A9", "value": 0 })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.type, 'application/json');
                assert.property(res.body, 'error');
                assert.deepStrictEqual(res.body.error, 'Invalid value');
                done();
            });
    });
});

