const INPUT = require("../data");

const parseData = (INPUT) => {
  return INPUT.split("\n").map((row) => row.split(""));
};

const getGuardStartPosition = (data) => {
  let x, y;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] === "^") {
        x = j;
        y = i;
        break;
      }
    }
  }
  return { x, y };
};

const inBounds = (data, pos) => {
  return (
    pos.y >= 0 && pos.y < data.length && pos.x >= 0 && pos.x < data[0].length
  );
};

const getNextDirection = (direction) => {
  switch (direction) {
    case "down":
      return "left";
    case "right":
      return "down";
    case "up":
      return "right";
    case "left":
      return "up";
  }
};

const getNextPosition = (currentPosition, direction) => {
  const nextPosition = { ...currentPosition };
  switch (direction) {
    case "down":
      nextPosition.y++;
      break;
    case "right":
      nextPosition.x++;
      break;
    case "up":
      nextPosition.y--;
      break;
    case "left":
      nextPosition.x--;
      break;
  }
  return nextPosition;
};

const moveUntilExit = (data, startPosition) => {
  let direction = "up";
  const visited = new Set();

  data[startPosition.y][startPosition.x] = ".";
  visited.add(`${startPosition.y},${startPosition.x}`);

  let currentPosition = { ...startPosition };
  while (true) {
    let nextPosition = getNextPosition(currentPosition, direction);
    if (!inBounds(data, nextPosition)) {
      break;
    }
    if (data[nextPosition.y][nextPosition.x] === "#") {
      direction = getNextDirection(direction);
    } else if (data[nextPosition.y][nextPosition.x] === ".") {
      currentPosition = { ...nextPosition };
      visited.add(`${nextPosition.y},${nextPosition.x}`);
    }
  }
  return visited;
};

const start = performance.now();
const data = parseData(INPUT);
const startPosition = getGuardStartPosition(data);
const visited = moveUntilExit(data, startPosition);
console.log(visited.size);
console.log(`Runtime ${performance.now() - start}ms`);
