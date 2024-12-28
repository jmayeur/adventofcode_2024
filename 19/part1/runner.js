const INPUT = require("../data");

const parseData = (INPUT) => {
  const [towelsRaw, patternsRaw] = INPUT.split("\n\n");
  const towels = towelsRaw
    .split(", ")
    .sort()
    .sort((a, b) => b.length - a.length);
  const patterns = patternsRaw.split("\n");
  return { towels, patterns };
};


const tryToMakePattern = (towels, pattern, memo) => {

  if (memo[pattern]) {
    console.log({ id: "memo hit", pattern });
    return true;
  } else if (memo[pattern] === false) {
    return false;
  }

  let result = towels.reduce((acc, towel) => {
    if (acc) {
      return true;
    }
    if (pattern.startsWith(towel)) {
      let rest = pattern.slice(towel.length);

      while (rest.length > 0 && rest.startsWith(towel)) {
        rest = rest.slice(towel.length);
      }

      if (rest.length === 0) {
        memo[pattern] = true;
        return true;
      }
      const result = tryToMakePattern(towels, rest, memo);
      memo[pattern] = result;
      return result;
    }
    return acc;
  }, false);
  return result;
};
const start = performance.now();
const data = parseData(INPUT);
const result = data.patterns.filter((pattern) => {
  const result = tryToMakePattern(data.towels, pattern, {});
  return result;
});

console.log(result.length);
console.log(`Runtime ${performance.now() - start}ms`);
