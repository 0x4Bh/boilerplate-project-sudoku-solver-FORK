const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
import { puzzlesAndSolutions } from "../controllers/puzzle-strings.js";
let validPuzzleString = puzzlesAndSolutions[5][0]; // .3..927.....5.....6..37.9.....6...3......5...7...2.6.12..........51...2.....69.18

suite('Unit Tests', () => {
    test('1. Logic handles a valid puzzle string of 81 characters', (done) => {
        puzzlesAndSolutions.forEach(puzzle => {
            assert.isTrue(solver.validate(puzzle[0]));
        });
        done();
    });
    test('2. Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
        let invalidPuzzleString = validPuzzleString.slice(1) + 'A';
        assert.isFalse(solver.validate(invalidPuzzleString));
        done();
    });
    test('3. Logic handles a puzzle string that is not 81 characters in length', (done) => {
        let invalidPuzzleString = validPuzzleString.slice(1);
        assert.notEqual(invalidPuzzleString.length, 81);
        assert.isFalse(solver.validate(invalidPuzzleString));
        done();
    });
    test('4. Logic handles a valid row placement', (done) => {
        // *3..927..
        // ...5.....
        // 6..37.9..
        // ...6...3.
        // .....5...
        // 7...2.6.1
        // 2........
        // ..51...2.
        // ....69.18
        // * is A0
        assert.isTrue(solver.checkRowPlacement(validPuzzleString, 'A', 0, 4));
        done();
    });
    test('5. Logic handles an invalid row placement', (done) => {
        // *3..927..
        // ...5.....
        // 6..37.9..
        // ...6...3.
        // .....5...
        // 7...2.6.1
        // 2........
        // ..51...2.
        // ....69.18
        // * is A0
        assert.isFalse(solver.checkRowPlacement(validPuzzleString, 'A', 0, 3));
        done();
    });
    test('6. Logic handles a valid column placement', (done) => {
        // *3..927..
        // ...5.....
        // 6..37.9..
        // ...6...3.
        // .....5...
        // 7...2.6.1
        // 2........
        // ..51...2.
        // ....69.18
        // * is A0
        assert.isTrue(solver.checkColPlacement(validPuzzleString, 'A', 0, 3));
        done();
    });
    test('7. Logic handles an invalid column placement', (done) => {
        // *3..927..
        // ...5.....
        // 6..37.9..
        // ...6...3.
        // .....5...
        // 7...2.6.1
        // 2........
        // ..51...2.
        // ....69.18
        // * is A0
        assert.isFalse(solver.checkColPlacement(validPuzzleString, 'A', 0, 6));
        done();
    });
    test('8. Logic handles a valid region (3x3 grid) placement', (done) => {
        // .3..927.*
        // ...5.....
        // 6..37.9..
        // ...6...3.
        // .....5...
        // 7...2.6.1
        // 2........
        // ..51...2.
        // ....69.18
        // * is A8
        assert.isTrue(solver.checkRegionPlacement(validPuzzleString, 'A', 8, 6));
        done();
    });
    test('9. Logic handles an invalid region (3x3 grid) placement', (done) => {
        // .3..927.*
        // ...5.....
        // 6..37.9..
        // ...6...3.
        // .....5...
        // 7...2.6.1
        // 2........
        // ..51...2.
        // ....69.18
        // * is A8
        assert.isFalse(solver.checkRegionPlacement(validPuzzleString, 'A', 8, 7));
        done();
    });
    test('10. Valid puzzle strings pass the solver', (done) => {
        puzzlesAndSolutions.forEach(puzzle => {
            assert.isTrue(solver.solve(puzzle[0]));
        });
        done();
    });
    test('11. Invalid puzzle strings fail the solver', (done) => {
        // .3..9[3]7.....5.....6..37.9.....6...3......5...7...2.6.12..........51...2.....69.18
        let invalidPuzzleString = validPuzzleString.slice(0, 5) + "3" + validPuzzleString.slice(6);
        assert.deepStrictEqual(invalidPuzzleString, '.3..937.....5.....6..37.9.....6...3......5...7...2.6.12..........51...2.....69.18');
        assert.isFalse(solver.solve(invalidPuzzleString));
        done();
    });
    test('12. Solver returns the expected solution for an incomplete puzzle', (done) => {
        puzzlesAndSolutions.forEach(puzzle => {
            solver.solve(puzzle[0])
            assert.deepStrictEqual(solver.solution, puzzle[1]);
        });
        done();
    });

});
