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

const guardHasReturnVisit = (data, startPosition, newObstacle) => {
  const dataCopy = data.map((row) => row.map((cell) => cell));
  dataCopy[newObstacle.y][newObstacle.x] = "#";

  let currentPosition = { ...startPosition };
  let direction = "up";
  const visits = new Set();
  while (true) {
    const positionAndDirection = `${currentPosition.y},${currentPosition.x},${direction}`;
    if (visits.has(positionAndDirection)) {
      return true;
    }
    const nextPosition = getNextPosition(currentPosition, direction);
    visits.add(positionAndDirection);
    if (!inBounds(data, nextPosition)) {
      return false;
    }
    if (dataCopy[nextPosition.y][nextPosition.x] === "#") {
      direction = getNextDirection(direction);
    } else {
      currentPosition = { ...nextPosition };
    }
  }
};

const getValidObstacleCount = (data, startPos, visited) => {
  let result = 0;
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[0].length; x++) {
      if (
        !visited.has(`${y},${x}`) ||
        data[y][x] === "#" ||
        (y === startPos.y && x === startPos.x)
      ) {
        continue;
      }

      if (guardHasReturnVisit(data, startPos, { y, x })) {
        result++;
      }
    }
  }

  return result;
};
const start = performance.now();
const data = parseData(INPUT);
const startPosition = getGuardStartPosition(data);
const visited = moveUntilExit(data, startPosition);
const obstacleCount = getValidObstacleCount(data, startPosition, visited);
console.log(obstacleCount);
console.log(`Runtime ${performance.now() - start}ms`);
