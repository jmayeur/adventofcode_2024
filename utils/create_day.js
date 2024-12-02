const fs = require('fs');
const path = require('path');
const defaultDataText = 'module.exports = ``;';
const defaultRunnerText = `const INPUT = require('../testdata');

const parseData = (INPUT) => {
    const lines = INPUT.split('\\n');
    return lines[0].split(',').map(v => parseInt(v));
};

const start = performance.now();
const data = parseData(INPUT);
console.log(data);
console.log(\`Runtime \${performance.now() - start}ms\`);
`;

const wrappedDirCreate = (dir) => {
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    } catch (err) {
        console.error(err)
        throw new Error('Failed to Create Dir ', dir);
    }
}

const wrappedFileCreate = (file, text) => {
    try {
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, text);
        }
    } catch (err) {
        console.error(err)
        throw new Error('Failed to Create File ', file);
    }
};

const createRootDir = (day, workingDir) => {
    const dir = path.join(workingDir, day);
    console.log(`Creating Dir ${dir}`);
    wrappedDirCreate(dir);
};

const createPartFolder = (partNo, workingDir) => {
    const dir = path.join(workingDir, `part${partNo}`);
    console.log(`Creating Dir ${dir}`);
    wrappedDirCreate(dir);
    const file = path.join(dir, 'runner.js');
    console.log(`Creating runner file ${file}`);
    wrappedFileCreate(file, defaultRunnerText);
};

const createDataFiles = (workingDir) => {
    const testData = path.join(workingDir, 'testdata.js');
    const data = path.join(workingDir, 'data.js');

    console.log(`Creating data file ${testData}`);
    wrappedFileCreate(testData, defaultDataText);

    console.log(`Creating data file ${data}`);
    wrappedFileCreate(data, defaultDataText);

};

const getArgs = (argv) => {
    const args = argv.slice(2);

    if (args.length !== 2) {
        console.error('Usage, create_day.js <workingDir> <day>');
        return null;
    }

    return {
        workingDir: args[0],
        day: args[1]
    }
};

const args = getArgs(process.argv);
if (args !== null) {
    createRootDir(args.day, args.workingDir);
    const dayFolder = path.join(args.workingDir, args.day);
    createDataFiles(dayFolder);
    createPartFolder('1', dayFolder);
    createPartFolder('2', dayFolder);
}