'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || (value === null || value === undefined)) {
        res.json({ error: 'Required field(s) missing' });
      }
      else if (puzzle.length !== 81) {
        res.json({ error: 'Expected puzzle to be 81 characters long' });
      }
      else if (!solver.validate(puzzle)) {
        res.json({ error: 'Invalid characters in puzzle' });
      }
      else if (!coordinate.match(/^[A-I][1-9]$/)) {
        res.json({ error: 'Invalid coordinate' });
      }
      else if (!(Number.parseInt(value) >= 1 && Number.parseInt(value) <= 9)) {
        res.json({ error: 'Invalid value' });
      }
      else {
        const coordinateRow = coordinate[0];
        const coordiateCol = Number.parseInt(coordinate[1]) - 1;
        let returnObject = { valid: true }
        let returnObjectFailureReasons = [];
        if (!solver.checkRowPlacement(puzzle, coordinateRow, coordiateCol, value)) returnObjectFailureReasons.push("row");
        if (!solver.checkColPlacement(puzzle, coordinateRow, coordiateCol, value)) returnObjectFailureReasons.push("column");
        if (!solver.checkRegionPlacement(puzzle, coordinateRow, coordiateCol, value)) returnObjectFailureReasons.push("region");
        if (returnObjectFailureReasons.length !== 0) {
          returnObject.conflict = returnObjectFailureReasons;
          returnObject.valid = false;
          res.json({ ...returnObject });
        }
        else {
          res.json({ ...returnObject });
        }
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) res.json({ error: 'Required field missing' });
      else if (puzzle.length !== 81) res.json({ error: 'Expected puzzle to be 81 characters long' });
      else if (!solver.validate(puzzle)) res.json({ error: 'Invalid characters in puzzle' });
      else {
        if(!solver.solve(puzzle)) res.json({ error: 'Puzzle cannot be solved' });
        else res.json({ "solution": solver.solution });
      }
    });
};
