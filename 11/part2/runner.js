const INPUT = require("../data");

const parseData = (INPUT) => {
  return INPUT.split(" ").map(Number);
};

const memo = {};
const processStones = (stones, depth, maxDepth) => {
  if (depth === maxDepth) {
    return stones.length;
  }

  const result = stones.reduce((acc, stone) => {
    const key = `${stone}:${depth}`;
    if (!memo[key]) {
      if (stone === 0) {
        memo[key] = processStones([1], depth + 1, maxDepth) - 1;
      } else {
        const stoneStr = stone.toString();
        if (stoneStr.length % 2 === 0) {
          const half = stoneStr.length / 2;
          const right = parseInt(stoneStr.slice(half));
          const left = parseInt(stoneStr.slice(0, half));
          memo[key] = processStones([left, right], depth + 1, maxDepth) - 1;
        } else {
          memo[key] = processStones([stone * 2024], depth + 1, maxDepth) - 1;
        }
      }
    }
    return acc + memo[key];
  }, 0);

  return result + stones.length;
};

const start = performance.now();
const data = parseData(INPUT);
console.log(processStones(data, 0, 75));
console.log(`Runtime ${performance.now() - start}ms`);
