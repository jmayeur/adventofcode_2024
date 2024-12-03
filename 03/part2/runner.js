const INPUT = require("../data");

let enabled = true;
const convert = (str) => {
  if (str === "do()") {
    enabled = true;
    return { a: 0, b: 0 };
  } else if (str === "don't()") {
    enabled = false;
    return { a: 0, b: 0 };
  }
  if (!enabled) {
    return { a: 0, b: 0 };
  }
  const matches = str.match(/mul\((\d{1,3}),(\d{1,3})\)/);
  if (!matches || matches.length < 3) {
    return { a: 0, b: 0 };
  }
  return {
    a: parseInt(matches[1], 10),
    b: parseInt(matches[2], 10),
  };
};

const parseData = (INPUT) => {
  const matches = INPUT.match(/mul\([^mul]+?\)|do\(\)|don\'t\(\)/g);
  return matches.map(convert);
};

const solve = (data) => {
  return data.reduce((acc, { a, b }) => acc + a * b, 0);
};

const start = performance.now();
const data = parseData(INPUT);
console.log(solve(data));
console.log(`Runtime ${performance.now() - start}ms`);
