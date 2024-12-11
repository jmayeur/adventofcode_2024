const INPUT = require("../data");

const parseData = (INPUT) => {
  return INPUT.split("\n").map((line) =>
    line.split("").map((v) => parseInt(v))
  );
};

const inBounds = (position, bounds) => {
  const { x, y } = position;
  return x >= 0 && x < bounds.maxX && y >= 0 && y < bounds.maxY;
};

const moves = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

const countTrails = (data, currentPosition, currentValue, bounds, path, visited) => {
  const { x, y } = currentPosition;
  const fullPaths = [];

  moves.forEach((direction) => {
    const nextPosition = { x: x + direction.x, y: y + direction.y };

    if (inBounds(nextPosition, bounds)) {;
      const nextValue = data[nextPosition.y][nextPosition.x];
      if (nextValue === currentValue + 1) {
        const nPath = path.slice();
        nPath.push(nextValue);

        if (nextValue === 9) {
            if(!visited.has(`${nextPosition.y}|${nextPosition.x};`)) {
                visited.add(`${nextPosition.y}|${nextPosition.x};`);
                fullPaths.push(nPath);
            }
        } else {
          fullPaths.push(
            ...countTrails(data, nextPosition, nextValue, bounds, nPath, visited)
          );
        }
      }
    }
  });

  return fullPaths;
};

const startAtTrailHeads = (data) => {
  const bounds = { maxY: data.length, maxX: data[0].length };
  let total = 0;

  for (let y = 0; y < bounds.maxY; y++) {
    for (let x = 0; x < bounds.maxX; x++) {
      if (data[y][x] === 0) {
        const paths = countTrails(data, { x, y }, 0, bounds, [0], new Set());
        if (paths.length) {
          total += paths.length;
        }
      }
    }
  }
  return total;
};

const start = performance.now();
const data = parseData(INPUT);
console.log(startAtTrailHeads(data));
console.log(`Runtime ${performance.now() - start}ms`);
