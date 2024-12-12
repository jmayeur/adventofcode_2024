const INPUT = require("../testdata");

const parseData = (INPUT) => {
  return INPUT.split(" ").map(Number);
};

const processStones = (stones) => {
  /**
     * If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
     */
  const newStones = [];
  stones.forEach((stone) => {
    switch (stone) {
      case 0:
        newStones.push(1);
        break;
      default:
        const stoneStr = stone.toString();
        if (stoneStr.length % 2 === 0) {
          const half = stoneStr.length / 2;
          newStones.push(Number(stoneStr.slice(0, half)));
          newStones.push(Number(stoneStr.slice(half)));
        } else {
          newStones.push(stone * 2024);
        }
        break;
    }
  });
  return newStones;
};

const iterateStones = (stones, count) => {
  let newStones = [...stones];
  for (let i = 0; i < count; i++) {
    newStones = processStones(newStones);
  }
  return newStones.length;
};

const start = performance.now();
const data = parseData(INPUT);
console.log(iterateStones(data, 25));
console.log(`Runtime ${performance.now() - start}ms`);
