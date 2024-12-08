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
  const opt1 = { y: b.y - diffY, x: b.x - diffX };
  const opt2 = { y: a.y + diffY, x: a.x + diffX };
  if (inBounds(opt1.x, opt1.y, data)) {
    result.push(opt1);
  }
  if (inBounds(opt2.x, opt2.y, data)) {
    result.push(opt2);
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
          antiNodes.add(`${node.y}:${node.x}`);
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

const start = performance.now();
const data = parseData(INPUT);
const antennas = getAntennas(data);

const groups = groupAntennas(antennas);
const antiNodes = getAllAntiNodes(groups, data);
console.log(antiNodes.size);
console.log(`Runtime ${performance.now() - start}ms`);
