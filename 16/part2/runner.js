const INPUT = require("../data");

const parseData = (INPUT) => {
  const map = INPUT.split("\n").map((row) => row.split(""));
  let start, end;
  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "S") {
        start = { x, y };
      }
      if (cell === "E") {
        end = { x, y };
      }
    });
  });

  return { map, start, end, currentDirection: "E" };
};

const rotateNinetyDegreesClockwise = (currentDirection) => {
  switch (currentDirection) {
    case "E":
      return "S";
    case "S":
      return "W";
    case "W":
      return "N";
    case "N":
      return "E";
  }
};

const rotateNinetyDegreesCounterClockwise = (currentDirection) => {
  switch (currentDirection) {
    case "E":
      return "N";
    case "N":
      return "W";
    case "W":
      return "S";
    case "S":
      return "E";
  }
};

const getNextPosition = (currentPosition, currentDirection) => {
  const { x, y } = currentPosition;

  switch (currentDirection) {
    case "E":
      return { x: x + 1, y };
    case "S":
      return { x, y: y + 1 };
    case "W":
      return { x: x - 1, y };
    case "N":
      return { x, y: y - 1 };
  }
};

const canMoveForward = (map, currentDirection, currentPosition, visited) => {
  const nextPosition = getNextPosition(currentPosition, currentDirection);

  return (
    !visited.has(`${nextPosition.y},${nextPosition.x}`) &&
    map[nextPosition.y][nextPosition.x] !== "#"
  );
};

const tryMove = (map, currentDirection, currentPosition, currentPath) => {
  const results = [];
  if (
    canMoveForward(map, currentDirection, currentPosition, currentPath.visited)
  ) {
    const nextPosition = getNextPosition(currentPosition, currentDirection);
    const newVisited = new Set(currentPath.visited);
    newVisited.add(`${nextPosition.y},${nextPosition.x}`);
    let success = undefined;
    if (map[nextPosition.y][nextPosition.x] === "E") {
      success = true;
    } else if (
      !currentPath.visited.has(`${nextPosition.y},${nextPosition.x}`)
    ) {
      success = undefined;
    } else {
      success = false;
    }
    results.push({
      success,
      visited: newVisited,
      currentPosition: nextPosition,
      currentDirection,
      turns: currentPath.turns,
    });
  }

  const clockwiseDirection = rotateNinetyDegreesClockwise(currentDirection);
  if (
    canMoveForward(
      map,
      clockwiseDirection,
      currentPosition,
      currentPath.visited
    )
  ) {
    const nextPosition = getNextPosition(currentPosition, clockwiseDirection);
    const newVisited = new Set(currentPath.visited);
    newVisited.add(`${nextPosition.y},${nextPosition.x}`);
    let success = undefined;
    if (map[nextPosition.y][nextPosition.x] === "E") {
      success = true;
    } else if (
      !currentPath.visited.has(`${nextPosition.y},${nextPosition.x}`)
    ) {
      success = undefined;
    } else {
      success = false;
    }
    results.push({
      success,
      visited: newVisited,
      currentPosition: nextPosition,
      currentDirection: clockwiseDirection,
      turns: currentPath.turns + 1,
    });
  }

  const counterClockwiseDirection =
    rotateNinetyDegreesCounterClockwise(currentDirection);
  if (
    canMoveForward(
      map,
      counterClockwiseDirection,
      currentPosition,
      currentPath.visited
    )
  ) {
    const nextPosition = getNextPosition(
      currentPosition,
      counterClockwiseDirection
    );
    const newVisited = new Set(currentPath.visited);
    newVisited.add(`${nextPosition.y},${nextPosition.x}`);
    let success = undefined;
    if (map[nextPosition.y][nextPosition.x] === "E") {
      success = true;
    } else if (
      !currentPath.visited.has(`${nextPosition.y},${nextPosition.x}`)
    ) {
      success = undefined;
    } else {
      success = false;
    }
    results.push({
      success,
      visited: newVisited,
      currentPosition: nextPosition,
      currentDirection: counterClockwiseDirection,
      turns: currentPath.turns + 1,
    });
  }

  return results;
};

const scorePath = (path) => {
  return path.visited.size + 1000 * path.turns;
};

const walk = (map, currentDirection, currentPosition) => {
  const memo = {};
  const visited = new Set();
  const paths = tryMove(map, currentDirection, currentPosition, {
    success: false,
    visited,
    turns: 0,
  });

  let currentShortestPathScore = Number.MAX_VALUE;

  const successfulPaths = [];

  while (paths.length > 0) {
    const path = paths.pop();

    if (path.success === true) {
      currentShortestPathScore = Math.min(
        scorePath(path),
        currentShortestPathScore
      );
      console.log(currentShortestPathScore);
      successfulPaths.push(path);
    } else if (path.success === undefined) {
      const pathScore = scorePath(path);
      const key = `${path.currentPosition.y},${path.currentPosition.x},${path.currentDirection}`;
      if (memo[key] && memo[key] < pathScore) {
        continue;
      }
      memo[key] = pathScore;
      if (currentShortestPathScore && currentShortestPathScore < pathScore) {
        continue;
      }
      paths.push(
        ...tryMove(map, path.currentDirection, path.currentPosition, path)
      );
    }
  }

  const shortest = successfulPaths.reduce(
    (acc, path) => {
      if (!acc.visited) {
        return path;
      }
      const currentScore = scorePath(acc);
      const newScore = scorePath(path);
      if (newScore < currentScore) {
        return path;
      }
      return acc;
    },
    { visited: undefined }
  );

  const getTileCountFromShortestPaths = successfulPaths.reduce((acc, path) => {
    if (scorePath(path) === scorePath(shortest)){
        path.visited.forEach((key) => {
            if(!acc.has(key)){
                acc.add(key);
            }
        }); 
    }
    return acc;
  }, new Set());

  return {
    shortestScore: scorePath(shortest),
    tiles: getTileCountFromShortestPaths.size + 1,
  };
};

const start = performance.now();
const data = parseData(INPUT);
const result = walk(data.map, data.currentDirection, data.start);
console.log(result);

console.log(`Runtime ${performance.now() - start}ms`);

/**
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
 */
