const INPUT = require("../data");

const parseData = (INPUT) => {
  const [map, moves] = INPUT.split("\n\n");
  const mapData = map.split("\n").map((line) => line.split(""));
  const initialRow = mapData.findIndex((line) => line.includes("@"));
  const initialCol = mapData[initialRow].indexOf("@");
  const movesData = moves
    .split("\n")
    .map((line) => line.split(""))
    .join(",")
    .split(",");
  const walls = mapData.reduce((acc, line, index) => {
    line.forEach((cell, i) => {
      if (cell === "#") {
        acc[`${index},${i}`] = true;
      }
    });
    return acc;
  }, {});

  const boxes = mapData.reduce((acc, line, index) => {
    line.forEach((cell, i) => {
      if (cell === "O") {
        acc[`${index},${i}`] = true;
      }
    });
    return acc;
  }, {});

  return {
    mapData,
    movesData,
    initialPosition: { row: initialRow, col: initialCol },
    walls,
    boxes,
  };
};

const getRowColModifier = (direction) => {
  switch (direction) {
    case "v":
      return [1, 0];
    case "^":
      return [-1, 0];
    case "<":
      return [0, -1];
    case ">":
      return [0, 1];
  }
};

const getFirstFreeSpace = (walls, boxes, currentPosition, direction) => {
  const [rowModifier, colModifier] = getRowColModifier(direction);
  let newRow = currentPosition.row + rowModifier;
  let newCol = currentPosition.col + colModifier;
  if (walls[`${newRow},${newCol}`]) {
    return null;
  }
  while (boxes[`${newRow},${newCol}`]) {
    newRow += rowModifier;
    newCol += colModifier;
    if (walls[`${newRow},${newCol}`]) {
      return null;
    }
  }

  return { row: newRow, col: newCol };
};

const makeMove = (walls, boxes, moves, currentPosition) => {

  const move = moves.shift();

  const [rowModifier, colModifier] = getRowColModifier(move);
  const newRow = currentPosition.row + rowModifier;
  const newCol = currentPosition.col + colModifier;
  const nextPosition = { row: newRow, col: newCol };
  if (walls[`${newRow},${newCol}`]) {
    return currentPosition;
  } else if (boxes[`${newRow},${newCol}`]) {
    const openSpace = getFirstFreeSpace(walls, boxes, nextPosition, move);
    if (openSpace) {
      delete boxes[`${newRow},${newCol}`];
      boxes[`${openSpace.row},${openSpace.col}`] = true;
      if (openSpace.row === nextPosition.row) {
        if (openSpace.col > nextPosition.col) {
          for (let i = nextPosition.col + 1; i < openSpace.col; i++) {
            boxes[`${newRow},${i}`] = true;
          }
        } else {
          for (let i = nextPosition.col - 1; i > openSpace.col; i--) {
            boxes[`${newRow},${i}`] = true;
          }
        }
      } else if (openSpace.col === nextPosition.col) {
        if (openSpace.row > nextPosition.row) {
          for (let i = nextPosition.row + 1; i < openSpace.row; i++) {
            boxes[`${i},${newCol}`] = true;
          }
        } else {
          for (let i = nextPosition.row - 1; i > openSpace.row; i--) {
            boxes[`${i},${newCol}`] = true;
          }
        }
      }
      return nextPosition;

    } else {
        return currentPosition;
    }
  } else {
    return nextPosition;
  }
};

const doMoves = (walls, boxes, moves, currentPosition) => {
    let position = currentPosition;
    while(moves.length > 0){
        position = makeMove(walls, boxes, moves, position);
    }
    return position;
};

const calculateDistance = (boxes) => {
  return Object.keys(boxes).reduce((acc, boxKey) => {
    const [row, col] = boxKey.split(",").map(Number);
    return acc + 100 * row + col;
  }, 0);
};

const transformData = (data, walls, boxes, lastPosition) => {
  const result = data.map((line, row) => {
    return line
      .map((cell, col) => {
        if (boxes[`${row},${col}`]) {
          return "O";
        } else if (walls[`${row},${col}`]) {
          return "#";
        } else if (row === lastPosition.row && col === lastPosition.col) {
          return "@";
        }
        return ".";
      })
      .join("");
  });

  return result.join("\n");
};

const start = performance.now();
const data = parseData(INPUT);
const lastPosition = doMoves(data.walls, data.boxes, data.movesData, data.initialPosition);
console.log(transformData(data.mapData, data.walls, data.boxes, lastPosition));
console.log(calculateDistance(data.boxes));
console.log(`Runtime ${performance.now() - start}ms`);
