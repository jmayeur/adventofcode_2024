const INPUT = require("../data");

const parseData = (INPUT) => {
  return INPUT.split("\n").map((r) => r.split(""));
};

const get = (data, ridx, cidx, rMod, cMod) => {
    let r = ridx;
    let c = cidx;
    let i = 0;
    let word = '';

    while (r >= 0 && c >= 0 && r < data.length && c < data[r].length && i < 4) {
        
        word += data[r][c];
        r+=rMod;
        c+=cMod;
        i++;
    }
    return word;
}

const getWords = (data) => {
  return data.reduce((racc, row, ridx) => {
    
    const words = row.reduce((acc, cell, cidx) => {
        if (cell !== "X") {
          return acc;
        }
        acc.push(get(data, ridx, cidx, -1, 0));
        acc.push(get(data, ridx, cidx, 1, 0));
        acc.push(get(data, ridx, cidx, 0, -1));
        acc.push(get(data, ridx, cidx, 0, 1));
        acc.push(get(data, ridx, cidx, -1, -1));
        acc.push(get(data, ridx, cidx, -1, 1));
        acc.push(get(data, ridx, cidx, 1, -1));
        acc.push(get(data, ridx, cidx,  1, 1));
        return acc;
      }, []);
    return racc.concat(words);      
  }, []);
};

const start = performance.now();
const data = parseData(INPUT);
console.log(getWords(data).filter(w => w === 'XMAS').length);
console.log(`Runtime ${performance.now() - start}ms`);
