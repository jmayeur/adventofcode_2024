const INPUT = require("../data");

const parseData = (INPUT) => {
  return INPUT.split("").reduce((acc, char, index) => {
    const size = parseInt(char);
    if (index % 2 === 0) {
      for (let i = 0; i < size; i++) {
        const position = index === 0 ? 0 : Math.floor(index / 2);
        acc.push(position);
      }
    } else {
      for (let i = 0; i < size; i++) {
        acc.push(".");
      }
    }
    return acc;
  }, []);
};

const getNextDateBlockIndex = (mutableData, currentIndex) => {
  let nextIndex = currentIndex;
  while (mutableData[nextIndex] === ".") {
    nextIndex--;
  }
  return nextIndex;
};

const compactData = (data) => {
  const mutableData = [...data];
  let nextIndex = getNextDateBlockIndex(mutableData, data.length - 1);
  let compacted = [];
  mutableData.forEach((char, index) => {
    if (char !== ".") {
      compacted.push(char);
    } else if (index >= nextIndex) {
      compacted.push(char);
    } else {
      const nextChar = mutableData[nextIndex];
      mutableData[nextIndex] = ".";
      nextIndex = getNextDateBlockIndex(mutableData, nextIndex - 1);
      compacted.push(nextChar);
    }
  });
  return compacted;
};

const calculateChecksum = (compactedData) => {
    return compactedData.reduce((acc, n, index) => {
        if (n === ".") {
            return acc;
        }
        return acc + (n * index);
    }, 0);
};

const start = performance.now();
const data = parseData(INPUT);
const compactedData = compactData(data);
console.log(calculateChecksum(compactedData));
console.log(`Runtime ${performance.now() - start}ms`);
