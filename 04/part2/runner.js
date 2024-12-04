const INPUT = require("../data");

const parseData = (INPUT) => {
  return INPUT.split("\n").map((r) => r.split(""));
};

const countCrosses = (data, aRow, aCol) => {
  const upLeft = data[aRow - 1][aCol - 1];
  const upRight = data[aRow - 1][aCol + 1];
  const downLeft = data[aRow + 1][aCol - 1];
  const downRight = data[aRow + 1][aCol + 1];

  let mas = 0;

  if (upLeft === "M" && downRight === "S") {
    mas++;
  }
  if (upLeft === "S" && downRight === "M") {
    mas++;
  }

  if (upRight === "M" && downLeft === "S") {
    mas++;
  }
  if (upRight === "S" && downLeft === "M") {
    mas++;
  }

  return mas == 2 ? 1 : 0;
};

const getCount = (data) => {
  let count = 0;
  for (let r = 1; r < data.length - 1; r++) {
    for (let c = 1; c < data[r].length - 1; c++) {
      if (data[r][c] === "A") {
        count += countCrosses(data, r, c);
      }
    }
  }
  return count;
};

const start = performance.now();
const data = parseData(INPUT);
console.log(getCount(data));
console.log(`Runtime ${performance.now() - start}ms`);
