const INPUT = require("../data");

const parseData = (INPUT) => {
  return INPUT.split("\n").map((line) => {
    const [row, col] = line.split(",").map(Number);
    return {
      row,
      col,
    };
  });
};

const buildGrid = (data, size, cap) => {
  const grid = new Array(size).fill(null).map(() => new Array(size).fill("."));
  data.forEach(({ row, col }, index) => {
    if (index < cap) {
      grid[row][col] = "#";
    }
  });
  return grid;
};

const logGrid = (grid) => {
  console.log(grid.map((row) => row.join("")).join("\n"));
};

const getNextPosition = (currentPosition, direction) => {
  const { row, col } = currentPosition;

  switch (direction) {
    case "right":
      return { col: col + 1, row };
    case "down":
      return { col, row: row + 1 };
    case "left":
      return { col: col - 1, row };
    case "up":
      return { col, row: row - 1 };
  }
};

const canMove = (map, direction, currentPosition, visited) => {
  const nextPosition = getNextPosition(currentPosition, direction);
  if (nextPosition.row < 0 || nextPosition.row >= map.length) {
    return false;
  }

  if (nextPosition.col < 0 || nextPosition.col >= map[0].length) {
    return false;
  }

  return (
    !visited.has(`${nextPosition.row},${nextPosition.col}`) &&
    map[nextPosition.row][nextPosition.col] !== "#"
  );
};

const tryMove = (map, currentPosition, currentPath, end) => {
  const results = [];
  ["up", "down", "left", "right"].forEach((direction) => {
    if (canMove(map, direction, currentPosition, currentPath.visited)) {
      const nextPosition = getNextPosition(currentPosition, direction);
      const newVisited = new Set(currentPath.visited);
      newVisited.add(`${nextPosition.row},${nextPosition.col}`);
      let success = undefined;
      if (nextPosition.row === end.row && nextPosition.col === end.col) {
        success = true;
      } else if (
        !currentPath.visited.has(`${nextPosition.row},${nextPosition.col}`)
      ) {
        success = undefined;
      } else {
        success = false;
      }
      results.push({
        success,
        visited: newVisited,
        currentPosition: nextPosition,
        direction,
      });
    }
  });

  return results;
};

const walk = (map, start, end) => {
  const memo = {};
  const visited = new Set();
  const initialPath = {
    success: false,
    visited,
  };
  const paths = tryMove(map, start, initialPath, end);

  let currentShortestPathScore = Number.MAX_VALUE;

  const successfulPaths = [];

  while (paths.length > 0) {
    const path = paths.pop();

    if (path.success === true) {
      currentShortestPathScore = Math.min(
        path.visited.size,
        currentShortestPathScore
      );
      //console.log(currentShortestPathScore);
      successfulPaths.push(path);
    } else if (path.success === undefined) {
      const pathScore = path.visited.size;
      const key = `${path.currentPosition.row},${path.currentPosition.col}`;
      if (memo[key] && memo[key] <= pathScore) {
        continue;
      }
      memo[key] = pathScore;
      if (currentShortestPathScore && currentShortestPathScore < pathScore) {
        continue;
      }
      paths.push(...tryMove(map, path.currentPosition, path, end));
    }
  }

  if (successfulPaths.length === 0) {
    return -1;
  }

  const shortest = successfulPaths.reduce(
    (acc, path) => {
      if (!acc.visited) {
        return path;
      }
      const currentScore = acc.visited.size;
      const newScore = path.visited.size;
      if (newScore < currentScore) {
        return path;
      }
      return acc;
    },
    { visited: undefined }
  );

  return shortest.visited.size;
};

const walkBackwardsFromEnd = (data, size, start, end) => {
  let cap = data.length;
  let grid = buildGrid(data, size, cap);
  let coord = data[cap - 1];
  let result = walk(grid, start, end);
  while (result === -1 && cap >= 0) {
    cap--;
    grid = buildGrid(data, size, cap);
    coord = data[cap];
    result = walk(grid, start, end);
    console.log({cap, result});
  }
  return {coord, lastCap: cap + 1};
};

const start = performance.now();
const data = parseData(INPUT);

const st = { row: 0, col: 0 };
//test data
//const grid = buildGrid(data, 7, data.length);
//const end = { row: 6, col: 6 };
//real data
// const grid = buildGrid(data, 71, 1024);
 const end = { row: 70, col: 70 };
//logGrid(grid);
console.log(walkBackwardsFromEnd(data, 71, st, end));
console.log(`Runtime ${performance.now() - start}ms`);
