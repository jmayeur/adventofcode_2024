const INPUT = require('../data');

const parseData = (INPUT) => {
    return INPUT.split('\n').reduce((acc, line) => {
        const [a, b] = line.split('   ');
        acc.a.push(parseInt(a));
        acc.b.push(parseInt(b));
        return acc
    }, { a: [], b: [] });
};

const solve = (data) => {
    const a = data.a.sort((a, b) => a - b);
    const b = data.b.sort((a, b) => a - b);
    return a.reduce((acc, a, i) => {
        return acc + Math.abs(a - b[i])
    }, 0);
};

const start = performance.now();
const data = parseData(INPUT);
console.log(solve(data));
console.log(`Runtime ${performance.now() - start}ms`);
