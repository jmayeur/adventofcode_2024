const INPUT = require('../data');

const convert = (str) => {
    const matches = str.match(/mul\((\d{1,3}),(\d{1,3})\)/);
    if (!matches || matches.length < 3) {
        return {a: 0, b: 0};
    }
    return {
        a: parseInt(matches[1], 10),
        b: parseInt(matches[2], 10)
    };
};

const parseData = (INPUT) => {
    const matches =  INPUT.match(/mul\([^mul]+?\)/g);
    return matches.map(convert);
};

const solve = (data) => {
    return data.reduce((acc, {a, b}) => acc + a * b, 0);
};

const start = performance.now();
const data = parseData(INPUT);
console.log(solve(data));
console.log(`Runtime ${performance.now() - start}ms`);
