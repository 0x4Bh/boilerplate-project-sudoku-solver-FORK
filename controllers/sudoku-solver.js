const ROW = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8 };
String.prototype.replaceAt = function (index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + 1);
}
class SudokuSolver {
  constructor() {
    this.solution = 'unsolved';
  }
  setSolution(solution) {
    this.solution = solution;
  }
  
/*   puzzleStringToMatrix(puzzleString) {
    let matrix = [];
    for (let i = 0; i < 9; i++) {
      let tempArr = [];
      for (let j = 0; j < 9; j++) {
        tempArr[j] = puzzleString.charAt((i * 9) + j);
      }
      matrix.push(tempArr);
    }
    return matrix;
  }

  matrixToPuzzleString(matrix) {
    let puzzleString = '';
    matrix.forEach(row => {
      row.forEach(val => {
        puzzleString = puzzleString.concat(val);
      });
    });
  } */

  validate(puzzleString) {
    if (puzzleString.length !== 81) return false;
    let pattern = /^[1-9|\.]*$/;
    for (let i = 0; i < 81; i++) {
      if (!pattern.test(puzzleString)) return false;
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    if (isNaN(row)) {
      row = ROW[row];
    }
    const puzzleStringArr = puzzleString.split("");
    for (let j = row * 9; j < row * 9 + 9; j++) {
      if (puzzleStringArr[j] == value && j % 9 !== column) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    if (isNaN(row)) {
      row = ROW[row];
    }
    const puzzleStringArr = puzzleString.split("");
    for (let i = 0; i < 9; i++) {
      if (puzzleStringArr[i * 9 + column] == value && i !== row) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    if (isNaN(row)) {
      row = ROW[row];
    }

    let regionStartingRow = Number.parseInt(row / 3) * 3;
    let regionStartingColumn = Number.parseInt(column / 3) * 3;
    let pos = row * 9 + column;

    const puzzleStringArr = puzzleString.split("");
    for (let i = regionStartingRow; i < (regionStartingRow + 3); i++) {
      for (let j = regionStartingColumn; j < (regionStartingColumn + 3); j++) {
        if (puzzleStringArr[i * 9 + j] == value && (i * 9 + j) !== pos) {
          return false;
        }
      }
    }
    return true;
  }

  checkPlacement(puzzleString, row, column, value) {
    return (this.checkRowPlacement(puzzleString, row, column, value) && this.checkColPlacement(puzzleString, row, column, value) && this.checkRegionPlacement(puzzleString, row, column, value));
  }

  getPossibleMoves(puzzleString, i, j) {
    let moves = [];
    for (let move = 1; move < 10; move++) {
      if (this.checkPlacement(puzzleString, i, j, move)) {
        if (this.neighborsCanNotMakeThisMove(puzzleString, i, j, move)) {
          return [move];
        }
        else {
          moves.push(move);
        }
      }
    }
    return moves;
  }

  neighborsCanNotMakeThisMove(puzzleString, i, j, move) {
    let iRegion = Number.parseInt(i / 3) * 3;
    let jRegion = Number.parseInt(j / 3) * 3;

    for (let x = iRegion; x < iRegion + 3; x++) {
      if (x !== i) {
        for (let y = jRegion; y < jRegion + 3; y++) {
          if (y !== j) {
            if (this.checkRowPlacement(puzzleString, x, y, move) || this.checkColPlacement(puzzleString, x, y, move)) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    if(puzzleString.indexOf('.') === -1) {
      this.setSolution(puzzleString);
      return true;
    }
    if(puzzleString.indexOf('.') !== -1) {
      let index = puzzleString.indexOf('.');
      let moves = this.getPossibleMoves(puzzleString, Number.parseInt(index/9), index%9);
      for (let move of moves) {
        puzzleString = puzzleString.replaceAt(index, move);
        if (this.solve(puzzleString)) return true;
      }
      return false;
    }
  }

}

module.exports = SudokuSolver;

