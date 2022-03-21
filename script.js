// Love u Sadegh :)
const sudoku = [];
let emptyCells;
const base = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class Sudoku {
  constructor(val, row, col, can, rej, chk) {
    this.val = val;
    this.row = row;
    this.col = col;
    this.can = can;
    this.rej = rej;
    this.chk = chk;
  }
  get blk() {
    return this.calcBlock();
  }

  calcBlock() {
    return 3 * Math.floor(this.row / 3) + Math.floor(this.col / 3);
  }
}

const objFiller = function (sudokuInt) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      sudoku.push(new Sudoku(sudokuInt[r][c], r, c));
    }
  }

  sudoku.forEach((cell) => {
    cell.rej = [];
    const cellRow = sudoku.filter((s) => s.row === cell.row).map((s) => s.val);
    const cellCol = sudoku.filter((s) => s.col === cell.col).map((s) => s.val);
    const cellBlk = sudoku.filter((s) => s.blk === cell.blk).map((s) => s.val);
    const initCan = base
      .filter((el) => !cellRow.includes(el))
      .filter((el) => !cellCol.includes(el))
      .filter((el) => !cellBlk.includes(el))
      .filter((el) => !cell.rej.includes(el));
    if (!cell.val && initCan.length === 1) {
      cell.val = initCan[0];
      cell.can = [];
    }
    cell.can = cell.val ? [] : initCan;
    cell.chk = cell.val ? true : false;
  });

  emptyCells = sudoku.filter((sd) => !sd.chk);

  return sudoku;
};

function present() {
  let totalStat = sudoku.reduce((total, cur) => (total = total + cur.val), 0);

  let indicate = sudoku.filter((cell) => cell.val != 0).length;
  let displaySudo = base
    .map((_, i) => sudoku.filter((s) => s.row === i))
    .map((e) => e.map((c) => c.val));

  console.log("Solved", totalStat, indicate, displaySudo);
}

const canGen = function (sudoku) {
  sudoku.forEach((cell) => {
    const cellRow = sudoku.filter((s) => s.row === cell.row).map((s) => s.val);
    const cellCol = sudoku.filter((s) => s.col === cell.col).map((s) => s.val);
    const cellBlk = sudoku.filter((s) => s.blk === cell.blk).map((s) => s.val);
    const initCan = base
      .filter((el) => !cellRow.includes(el))
      .filter((el) => !cellCol.includes(el))
      .filter((el) => !cellBlk.includes(el))
      .filter((el) => !cell.rej.includes(el));
    cell.can = cell.val ? [] : initCan;
  });
};

const solver = function (emptyCells) {
  for (i = 0; i < emptyCells.length; i++) {
    canGen(sudoku);
    if (emptyCells[i].can[0]) {
      emptyCells[i].val = emptyCells[i].can[0];
      emptyCells[i].rej.push(emptyCells[i].can[0]);
    } else {
      emptyCells[i].rej = [];
      i--;

      emptyCells[i].val = 0;
      i--;
    }
  }
};

displaySudo = base
  .map((_, i) => sudoku.filter((s) => s.row === i))
  .map((e) => e.map((c) => c.val));
indicate = sudoku.filter((cell) => cell.val != 0).length;
totalStat = sudoku.reduce((total, cur) => (total = total + cur.val), 0);

const myHeaders = new Headers();
myHeaders.append("x-rapidapi-host", "sudoku-board.p.rapidapi.com");
myHeaders.append(
  "x-rapidapi-key",
  "c5426921d7mshc4fb8c860d3e423p1072afjsn40a0a2ca33d8"
);
let rawSudoku;
const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

fetch(
  "https://sudoku-board.p.rapidapi.com/new-board?diff=4&stype=list&solu=true",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => {
    rawSudoku = result.replace("unsolved-sudoku", "unsolved");
    const unsolved = JSON.parse(rawSudoku).response.unsolved;
    console.log("Unsolved: ", unsolved);
    objFiller(unsolved);
    solver(emptyCells);
    present();
  })
  .catch((error) => console.log("error", error));
