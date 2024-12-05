const INPUT = require("../data");

const parseData = (INPUT) => {
  const [orderingRaw, updatesRaw] = INPUT.split("\n\n");
  const updates = updatesRaw
    .split("\n")
    .map((update) => update.split(",").map(Number));
  const ordering = orderingRaw
    .split("\n")
    .map((line) => {
      const [x, y] = line.split("|").map(Number);
      return { x, y };
    })
    .reduce((acc, { x, y }) => {
      if (!acc[x]) {
        acc[x] = [];
      }
      acc[x].push(y);
      return acc;
    }, {});
  return {
    updates,
    ordering,
  };
};

const orderUpdates = (updates, ordering) => {
  return updates.map((update) => {
    const ordered = [];
    const left = [...update];
    while (left.length > 0) {
      const next = left.shift();
      const y = ordering[next];
      if (!y) {
        ordered.push(next);
        continue;
      }

      let index = ordered.length;
      
      y.forEach((value, i) => {
        if (ordered.includes(value)) {
            let oidx = ordered.indexOf(value);
          if (oidx < index) {
            
            index = oidx;
          }
        }
      });


      ordered.splice(index, 0, next);
    }
    return ordered;
  });
};

const getUnorderedUpdates = (updates, ordering) => {
  return updates.filter((update) => {
    return !update.reduce((valid, value, index) => {
      if (!valid) {
        return false;
      }
      if (!ordering[value]) {
        return true;
      }
      const y = ordering[value];
      const violations = y.some((yValue) => {
        return update.includes(yValue) && update.indexOf(yValue) < index;
      });
      if (violations) {
        return false;
      }
      return true;
    }, true);
  });
};

const getMiddleSums = (ordered) => {
    return ordered.reduce((acc, update) => {
        return acc + update[Math.floor(update.length / 2)];
    },0);
};

const start = performance.now();
const data = parseData(INPUT);
const unordered = getUnorderedUpdates(data.updates, data.ordering);
const ordered = orderUpdates(unordered, data.ordering);
console.log(getMiddleSums(ordered));
console.log(`Runtime ${performance.now() - start}ms`);
