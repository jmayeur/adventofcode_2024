const INPUT = require("../data");

const parseData = (INPUT) => {
  return INPUT.split("\n").map((row) => {
    const [rawTotal, rawFactors] = row.split(": ");

    return {
      total: parseInt(rawTotal),
      factors: rawFactors.split(" ").map(Number),
    };
  });
};

const getOperatorPermutations = (operators, operations) => {
  if (getOperatorPermutations.cache[operations]) {
    return getOperatorPermutations.cache[operations];
  }
  const result = [];

  if (operations === 0) {
    return [[]];
  }

  const subSet = getOperatorPermutations(operators, operations - 1);

  for (let character of operators) {
    for (let sub of subSet) {
      result.push([character].concat(sub));
    }
  }

  getOperatorPermutations.cache[operations] = result;
  return result;
};
getOperatorPermutations.cache = {};

const isEquationPossible = (total, factors) => {
  const operatorPermutations = getOperatorPermutations(
    ["+", "*", "||"],
    factors.length - 1
  );

  return operatorPermutations.reduce((result, operatorPermutation) => {
    if (result > 0) {
      return result;
    }
    const possibleTotal = factors.reduce((acc, factor, index) => {
      if (acc > total) {
        return acc;
      }
      if (index > 0) {
        const operator = operatorPermutation[index - 1];
        if (operator === "||") {
          return parseInt(acc.toString() + factor.toString());
        } else if (operator === "+") {
          return acc + factor;
        } else if (operator === "*") {
          if (acc === 0) {
            return 1 * factor;
          }
          return acc * factor;
        }
      }
      return acc;
    });

    if (possibleTotal === total) {
      return possibleTotal;
    }
    return 0;
  }, 0);
};

const start = performance.now();
const data = parseData(INPUT);
console.log(
  data
    .map(({ total, factors }) => isEquationPossible(total, factors))
    .reduce((a, v) => a + v)
);
console.log(`Runtime ${performance.now() - start}ms`);
