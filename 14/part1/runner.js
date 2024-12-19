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

const printPositions = (data, bounds) => {
  const grid = new Array(bounds.p1)
    .fill(0)
    .map(() => new Array(bounds.p0).fill("."));
  data.forEach((point) => {
    if (grid[point.p[1]][point.p[0]] !== ".") {
      grid[point.p[1]][point.p[0]] += 1;
    } else {
      grid[point.p[1]][point.p[0]] = 1;
    }
  });
  console.log(grid.map((row) => row.join("")).join("\n"));
};

const iterateTicks = (data, bounds, ticks) => {
  for (let seconds = 0; seconds < ticks; seconds++) {
    executeTick(data, bounds);
  }
};

const getQuadrantCount = (data, bounds) => {
  const verticalEquator = Math.floor(bounds.p0 / 2);
  const horizontalEquator = Math.floor(bounds.p1 / 2);
  let quadrants = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };
  data.forEach((point) => {
    if (point.p[0] < verticalEquator && point.p[1] < horizontalEquator) {
      quadrants[1]++;
    } else if (point.p[0] > verticalEquator && point.p[1] < horizontalEquator) {
      quadrants[2]++;
    } else if (point.p[0] < verticalEquator && point.p[1] > horizontalEquator) {
      quadrants[3]++;
    } else if (
      point.p[0] !== verticalEquator &&
      point.p[1] !== horizontalEquator
    ) {
      quadrants[4]++;
    }
  });
  console.log(quadrants);
  return quadrants[1] * quadrants[2] * quadrants[3] * quadrants[4];
};

const start = performance.now();
const data = parseData(INPUT);
iterateTicks(data, bounds, 100);
//printPositions(data, bounds);
console.log(getQuadrantCount(data, bounds));
console.log(`Runtime ${performance.now() - start}ms`);
