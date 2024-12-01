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
    const bMap = data.b.reduce((acc, b) => {
        if (acc[b]) {
            acc[b] += 1;
        } else {
            acc[b] = 1;
        }
        return acc;
    }, {});
    return data.a.reduce((acc, a) => {
        if (bMap[a]) {
            return acc + a * bMap[a];
        }
        return acc;
    }, 0);
};

const startts = Date.now();
const data = parseData(INPUT);
console.log(solve(data));
console.log(`Runtime ${Date.now() - startts}ms`);
