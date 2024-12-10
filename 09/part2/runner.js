const INPUT = require("../testdata");

const parseData = (INPUT) => {
  return INPUT.split("").reduce(
    (acc, char, index) => {
      const size = parseInt(char);
      if (index % 2 === 0) {
        const position = index === 0 ? 0 : Math.floor(index / 2);
        acc.fileMap.push({
          index: acc.transformed.length,
          file: position,
          size,
        });
        for (let i = 0; i < size; i++) {
          acc.transformed.push(position);
        }
      } else {
        acc.gapMap.push({ index: acc.transformed.length, size });
        for (let i = 0; i < size; i++) {
          acc.transformed.push(".");
        }
      }
      return acc;
    },
    { gapMap: [], fileMap: [], transformed: [] }
  );
};

const getMatchingFile = (reversedFiles, gapSize, gapIndex) => {
  return reversedFiles.find(
    ({ size, index }) => size <= gapSize && index > gapIndex
  );
};

const compactData = (data) => {
  const mutableData = [...data.transformed];
  const reversedFiles = data.fileMap.reverse();
  data.gapMap.forEach((gap) => {
    let file = null;
    let gapSize = gap.size;
    let fillIndex = gap.index;
    while (gapSize > 0) {
      file = getMatchingFile(reversedFiles, gapSize, gap.index);

      if (file) {
        reversedFiles.splice(reversedFiles.indexOf(file), 1);
        for (let i = 0; i < file.size; i++) {
          mutableData[file.index + i] = ".";
          mutableData[fillIndex + i] = file.file;
        }
        fillIndex += file.size;
        gapSize -= file.size;
      } else {
        gapSize--;
      }
    }
  });
  return mutableData;
};

const calculateChecksum = (compactedData) => {
  return compactedData.reduce((acc, n, index) => {
    if (n === ".") {
      return acc;
    }
    return acc + n * index;
  }, 0);
};

const start = performance.now();
const data = parseData(INPUT);
const compactedData = compactData(data);
console.log(calculateChecksum(compactedData));
console.log(`Runtime ${performance.now() - start}ms`);
