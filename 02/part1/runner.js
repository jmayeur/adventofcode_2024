const INPUT = require("../data");

const parseData = (INPUT) => {
  return INPUT.split("\n").map((v) => {
    return v.split(" ").map((v) => parseInt(v));
  });
};

const solve = (data) => {
  return data.reduce((acc, report) => {
    let direction = false;
    return (
      acc +
      report.reduce((racc, v, i) => {
        if (i === 0) {
          return racc;
        } else {
          if (racc === 0) {
            return 0;
          } else if (
            (!direction || direction === "up") &&
            v > report[i - 1] &&
            v <= report[i - 1] + 3
          ) {
            direction = "up";
            return 1;
          } else if (
            (!direction || direction === "down") &&
            v < report[i - 1] &&
            v >= report[i - 1] - 3
          ) {
            direction = "down";
            return 1;
          } else {
            return 0;
          }
        }
      }, 1)
    );
  }, 0);
};

const start = performance.now();
const data = parseData(INPUT);

console.log(solve(data));
console.log(`Runtime ${performance.now() - start}ms`);
