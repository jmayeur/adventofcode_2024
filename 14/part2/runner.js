const INPUT = require("../data");

const parseData = (INPUT) => {
  return INPUT.split("\n").map((line) => {
    //p=0,4 v=3,-3
    const [p, v] = line.split(" ").map((pair) => {
      return pair
        .split("=")[1]
        .split(",")
        .map((num) => parseInt(num));
    });
    return { p, v };
  });
};

const testBounds = {
  p0: 11,
  p1: 7,
};

const bounds = {
  p0: 101,
  p1: 103,
};

const executeTick = (data, bounds) => {
  data.forEach((point) => {
    let nextP0 = point.p[0] + point.v[0];
    if (nextP0 < 0) {
      nextP0 = bounds.p0 + nextP0;
    } else {
      nextP0 = nextP0 % bounds.p0;
    }
    let nextP1 = point.p[1] + point.v[1];
    if (nextP1 < 0) {
      nextP1 = bounds.p1 + nextP1;
    } else {
      nextP1 = nextP1 % bounds.p1;
    }
    point.p = [nextP0, nextP1];
  });
};

checkData = (data) => {
  const map = {};
  data.forEach((point) => {
    if (!map[point.p[0]]) {
      map[point.p[0]] = [];
    }
    if (!map[point.p[0]].includes(point.p[1])) {
      map[point.p[0]].push(point.p[1]);
    }
  });

  return Object.keys(map).reduce((acc, key) => {
    if (acc) {
      return acc;
    }

    map[key].sort((a, b) => a - b);

    const inner = map[key].reduce(
      (innerAcc, val, index) => {
        if (index === 0) {
          return {
            contiguous: 1,
            maxContiguous: 1,
            last: val,
          };
        } else {
          if (val === innerAcc.last + 1) {
            const newContiguous = innerAcc.contiguous + 1;
            return {
              contiguous: newContiguous,
              maxContiguous: Math.max(newContiguous, innerAcc.maxContiguous),
              last: val,
            };
          } else {
            return {
              contiguous: 1,
              maxContiguous: Math.max(1, innerAcc.maxContiguous),
              last: val,
            };
          }
        }
      },
      { contiguous: 0, maxContiguous: 0, last: null }
    );

    return inner.maxContiguous >= 8;
  }, false);
};

const printPositions = (data, bounds) => {
  const grid = new Array(bounds.p1)
    .fill(0)
    .map(() => new Array(bounds.p0).fill(" "));
  data.forEach((point) => {
    grid[point.p[1]][point.p[0]] = "0";
  });
  console.log('\x1b[32;41m ' + grid.map((row) => row.join("")).join("\n") + '\x1b[0m');
};

const iterateTicks = (data, bounds, maxAllowedTicks) => {
  for (let tick = 1; tick < maxAllowedTicks; tick++) {
    executeTick(data, bounds);
    if (checkData(data)) {
      console.log(`Tick: ${tick}`);
      break;
    }
  }

  printPositions(data, bounds);
};

const start = performance.now();
const data = parseData(INPUT);
iterateTicks(data, bounds, 1000000);
console.log(`Runtime ${performance.now() - start}ms`);
