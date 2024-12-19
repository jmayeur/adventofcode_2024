const INPUT = require("../data");

/**
 * 
 Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400
 */

const getVal = (raw) => {
  if (raw.includes("+")) {
    const [, val] = raw.split("+");
    return Number(val);
  } else {
    const [, val] = raw.split("-");
    return -Number(val);
  }
};
const parseData = (INPUT) => {
  const blocks = INPUT.split("\n\n");

  return blocks.map((block) => {
    const lines = block.split("\n");
    const buttons = lines.slice(0, 2).map((line) => {
      const [button, coords] = line.split(": ");
      const [xRaw, yRaw] = coords.split(", ");
      const [, buttonName] = button.split(" ");
      return { button: buttonName, x: getVal(xRaw), y: getVal(yRaw) };
    });
    const prizeRaw = lines[2].split(": ")[1].split(", ");
    const prize = prizeRaw.reduce((acc, raw) => {
      const [key, val] = raw.split("=");
      acc[key] = Number(val);
      return acc;
    }, {});
    return { buttons, prize };
  });
};

const calculateCost = (blocks) => {
  let result = 0;
  blocks.forEach((block) => {
    const { buttons, prize } = block;
    const x = prize.X + 10000000000000;
    const y = prize.Y + 10000000000000;
    const x1 = buttons[0].x;
    const y1 = buttons[0].y;
    const x2 = buttons[1].x;
    const y2 = buttons[1].y;

    // needed some help here https://github.com/messcheg/advent-of-code/blob/main/AdventOfCode2024/Day13/Program.cs
    let B = (y * x1 - x * y1) / (y2 * x1 - x2 * y1);
    let A = (x - B * x2) / x1;

    if (
      Number.isInteger(A) &&
      Number.isInteger(B) &&
      A >= 0 &&
      B >= 0 &&
      B * x2 + A * x1 === x &&
      B * y2 + A * y1 === y
    ) {
      result += A * 3 + B;
    }
  });
  return result;
};

const start = performance.now();
const data = parseData(INPUT);
console.log(calculateCost(data));
console.log(`Runtime ${performance.now() - start}ms`);
