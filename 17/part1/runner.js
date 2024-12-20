const INPUT = require('../data');

const getComboOperandValue = (registers, operand) => {
    switch (operand) {
        case '4': return registers.A;
        case '5': return registers.B;
        case '6': return registers.C;
        default: return parseInt(operand);
    }
};

const getOpCodeDefinition = (opCode) => {
    switch (opCode) {
        case '0': return {instruction: 'adv', fn: (registers, operand) => {registers.A = Math.floor(registers.A / Math.pow(2, getComboOperandValue(registers, operand)))}};
        case '1': return {instruction: 'bxl', fn: (registers, operand) => {registers.B = registers.B ^ operand}};
        case '2': return {instruction: 'bst', fn: (registers, operand) => {registers.B = getComboOperandValue(registers, operand) % 8}};
        case '3': return {instruction: 'jnz', fn: (registers, operand) => {if (registers.A !== 0) {return operand}}};
        case '4': return {instruction: 'bxc', fn: (registers, operand) => {registers.B = registers.B ^ registers.C}};
        case '5': return {instruction: 'out', fn: (registers, operand) => {return getComboOperandValue(registers, operand) % 8}};
        case '6': return {instruction: 'bdv', fn: (registers, operand) => {registers.B = Math.floor(registers.A / Math.pow(2, getComboOperandValue(registers, operand)))}};
        case '7': return {instruction: 'cdv', fn: (registers, operand) => {registers.C = Math.floor(registers.A / Math.pow(2, getComboOperandValue(registers, operand)))}};
        default: return 'unknown';
    }
};

const parseData = (INPUT) => {
    const [ registersRaw, programRaw ] = INPUT.split('\n\n');
    const registers = registersRaw.split('\n').reduce((acc, registerLine) => {
        const [ keyRaw, value ] = registerLine.split(': ');
        const[, key] = keyRaw.split(' ');
        acc[key] = parseInt(value);
        return acc;
    }, {})

    const [, codes] = programRaw.split(': ');
    const program = codes.split(',').reduce((acc, code, index, arr) => {
        if (index % 2 === 0) {
            acc.push({opCode: code, operand: arr[index + 1], definition: getOpCodeDefinition(code)});
        }
        return acc;
    }, []);
    return { registers, program };
};

const executeProgram = (data) => {
    const { registers, program } = data;
    const outputs = []
    let instructionPointer = 0;
    while (instructionPointer < program.length) {
        const { opCode, operand, definition } = program[instructionPointer];

        const result = definition.fn(registers, operand);
        if (opCode === '3' && result !== undefined) {
            instructionPointer = result === 0 ? 0 : result/2;
        } else if (opCode === '5') {
            outputs.push(result);
            instructionPointer += 1;
        } else {
            instructionPointer += 1;
        }
    }
    return outputs.join(',');
};

const start = performance.now();
const data = parseData(INPUT);

console.log(executeProgram(data));
console.log(`Runtime ${performance.now() - start}ms`);

//4,2,5,6,7,7,7,7,3,1,0
//4,2,5,6,7,7,7,7,3,1,0
