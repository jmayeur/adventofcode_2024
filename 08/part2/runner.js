const INPUT = require("../data");

const parseData = (INPUT) => {
  return INPUT.split("\n").map((row) => row.split(""));
};

const getAntennas = (data) => {
  const antennas = [];
  data.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell !== ".") {
        antennas.push({ x: cellIndex, y: rowIndex, type: cell });
      }
    });
  });
  return antennas;
};

const inBounds = (x, y, data) => {
  return x >= 0 && x < data[0].length && y >= 0 && y < data.length;
};

const getPairAntiNodes = (a, b, data) => {
  const diffX = a.x - b.x;
  const diffY = a.y - b.y;
  result = [];

  let opt1 = { y: b.y - diffY, x: b.x - diffX };
  while (inBounds(opt1.x, opt1.y, data)) {
    result.push(opt1);
    opt1 = { y: opt1.y - diffY, x: opt1.x - diffX };
  }

  let opt2 = { y: a.y + diffY, x: a.x + diffX };

  while (inBounds(opt2.x, opt2.y, data)) {
    result.push(opt2);
    opt2 = { y: opt2.y + diffY, x: opt2.x + diffX };
  }

  return result;
};

const getAllAntiNodes = (groups, data) => {
  const antiNodes = new Set();
  Object.keys(groups).forEach((key) => {
    let antennas = [...groups[key]];
    while (antennas.length > 1) {
      const a = antennas.pop();
      antennas.forEach((b) => {
        getPairAntiNodes(a, b, data).forEach((node) => {
          if (data[node.y][node.x] === "." || data[node.y][node.x] === "#") {
            antiNodes.add(`${node.y}:${node.x}`);
          }
        });
      });
    }
  });

  return antiNodes;
};

const groupAntennas = (antennas) => {
  return antennas.reduce((acc, a) => {
    if (!acc[a.type]) {
      acc[a.type] = [];
    }
    acc[a.type].push(a);
    return acc;
  }, {});
};

const drawGrid = (data, antiNodes) => {
  const newGrid = [...data].map((row) => [...row]);
  antiNodes.forEach((node) => {
    const [y, x] = node.split(":").map(Number);
    newGrid[y][x] = "#";
  });
  console.log(newGrid.map((row) => row.join("")).join("\n"));
};

const start = performance.now();
const data = parseData(INPUT);
const antennas = getAntennas(data);

const groups = groupAntennas(antennas);
const antiNodes = getAllAntiNodes(groups, data);
console.log(antiNodes.size + antennas.length);
//console.log(drawGrid(data, antiNodes));
console.log(`Runtime ${performance.now() - start}ms`);
