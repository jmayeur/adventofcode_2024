const INPUT = require("../data");

const parseData = (INPUT) => {
  return INPUT.split("\n").map((line) => line.split(""));
};

const inBounds = (row, col, bounds) => {
  return row >= 0 && row < bounds.maxRow && col >= 0 && col < bounds.maxCol;
};

const getNeighbors = (row, col) => {
  return [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ].map(([r, c]) => [row + r, col + c]);
};

const getCropPerimeters = (data, bounds, location, visited) => {
  let plotArea = 0;
  let edges = new Set();
  let edgeCount = 0;
  const currentValue = data[location[0]][location[1]];

  const queue = [location];
  while (queue.length) {
    const [row, col] = queue.shift();
    const key = `${row},${col}`;
    if (visited.has(key)) {
      continue;
    } else {
      visited.add(key);
    }

    plotArea += 1;

    const neighbors = getNeighbors(row, col, bounds);
    let index = 0;
    for (const neighbor of neighbors) {
      const [r, c] = neighbor;
      if (!inBounds(r, c, bounds) || data[r][c] !== currentValue) {
        edgeCount += 1;
        edges.add(`${index},${r},${c}`);
        for (const [nextR, nextC] of getNeighbors([r, c])) {
          if (edges.has(`${index},${nextR},${nextC}`)) {
            edgeCount -= 1;
          }
        }
      } else {
        queue.push([r, c]);
      }
      index += 1;
    }
  }
  return plotArea * edgeCount;
};

const iterate = (data) => {
  const visited = new Set();
  let total = 0;
  const bounds = {
    maxRow: data.length,
    maxCol: data[0].length,
  };

  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[0].length; c++) {
      if (!visited.has(`${r},${c}`)) {
        total += getCropPerimeters(data, bounds, [r, c], visited);
      }
    }
  }
  return total;
};

const start = performance.now();
const data = parseData(INPUT);
console.log(iterate(data));
console.log(`Runtime ${performance.now() - start}ms`);
