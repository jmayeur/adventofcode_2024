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

// const orderUpdates = (updates, ordering) => {
//   return updates.map((update) => {
//     const ordered = [];
//     const left = [...update];
//     while (left.length > 0) {
//       const next = left.shift();
//       const y = ordering[next];
//       if (!y) {
//         ordered.push(next);
//         continue;
//       }

//       let index = ordered.length;
//       if (next === 97) {
//         console.log({ next, ordered, y });
//       }
//       y.forEach((value, i) => {
//         if (ordered.includes(value)) {
//           if (i < index) {
//             index = i;
//           }
//         }
//       });

//       if (index > 0) {
//         index--;
//       }

//       if (next === 97) {
//         console.log({ next, ordered, index });
//       }
//       ordered.splice(index, 0, next);
//       if (next === 97) {
//         console.log({ next, ordered });
//       }
//     }
//     return ordered;
//   });
// };

const getOrderedMiddleSum = (updates, ordering) => {
  return updates.reduce((acc, update) => {
    if (
      update.reduce((valid, value, index) => {
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
      }, true)
    ) {
      return acc + update[Math.floor(update.length / 2)];
    }
    return acc;
  }, 0);
};

const start = performance.now();
const data = parseData(INPUT);
console.log(getOrderedMiddleSum(data.updates, data.ordering));
console.log(`Runtime ${performance.now() - start}ms`);
