const INPUT = require('../data');

const parseData = (INPUT) => {
    return INPUT.split('\n').map(v => {
        return v.split(' ').map(v => parseInt(v));
    });
};


const isSafe = (report) => {

    let direction = false;
    return report.reduce((racc, v, i) => {

        if (i === 0) {
            return racc;
        } else {
            if (!racc) {
                return false;
            } else if ((!direction || direction === 'up') && v > report[i - 1] && v <= report[i - 1] + 3) {
                direction = 'up';
                return true;
            } else if ((!direction || direction === 'down') && v < report[i - 1] && v >= report[i - 1] - 3) {
                direction = 'down';
                return true;
            } else {
                return false;
            }
        }
    }, true);

};

const solve = (data) => {
    
    return data.reduce((acc, report) => {

        if (isSafe(report)) {
            return acc + 1;
        } else {
            for (let i = 0; i < report.length; i++) {
                let modReport = [...report];
                modReport.splice(i, 1);
                if (isSafe(modReport)) {
                    return acc + 1;
                }
            }
            return acc;
        }
    }, 0);


};

const start = performance.now();
const data = parseData(INPUT);

console.log(solve(data));
console.log(`Runtime ${performance.now() - start}ms`);