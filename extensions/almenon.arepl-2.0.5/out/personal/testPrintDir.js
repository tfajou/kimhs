"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * given string func: line -> func(line)
 * given string[] func: line -> func1(func2(line))
 */
function wrapLineWithFunc(line, func) {
    if (typeof func == "string" || func.length == 1)
        return func + '(' + line + ')';
    else
        return wrapLineWithFunc(func[func.length - 1] + '(' + line + ')', func.slice(0, func.length - 1));
}
/**
 * prints conditional by saving it to a var and adding a print(var)
 * if(1+1==2) -> temporaryVar = 1+1==2; print(temporaryVar); if(temporaryVar):
 * @param line if conditional
 */
function ifPrint(line) {
    let tabs = /^\s*/.exec(line)[0];
    let conditional = line.replace(/^\s*if\(?/, '').replace(/\)?:\s*$/, '');
    // avoid name collision with user variables
    let randomId = Math.floor(Math.random() * 1000000);
    let tempVar = "temporaryVar" + randomId;
    return `${tabs}${tempVar} = ${conditional}; print(${tempVar}); if(${tempVar}):`;
}
/**
 * Wraps current line in print() or print(dir()) if line ends in .
 */
function printDir(codeLines, currentLineNum) {
    let currentLine = codeLines[currentLineNum];
    let newLine = "";
    let variableEquals = /(^[^=]+)=[^=]/;
    let intellisense = false;
    if (currentLine.endsWith('.')) {
        intellisense = true;
        currentLine = currentLine.slice(0, -1); //get rid of . to avoid syntax err
    }
    if (!intellisense && /^\s*if[ (]/.exec(currentLine) && /\s*$/.exec(currentLine)) {
        codeLines[currentLineNum] = ifPrint(currentLine);
        return codeLines;
    }
    let equalMatches = variableEquals.exec(currentLine);
    if (equalMatches != null) {
        newLine = equalMatches[1]; // first capture group: "x" in "x=1"
    }
    else {
        newLine = currentLine;
    }
    if (intellisense) {
        newLine = wrapLineWithFunc(newLine, ["print", "dir"]);
    }
    else {
        newLine = wrapLineWithFunc(newLine, "print");
    }
    codeLines[currentLineNum] = currentLine + '; ' + newLine;
    return codeLines;
}
exports.default = printDir;
var currentLine = "  x";
var result = printDir(currentLine.split('\n'), 0);
console.log(result);
var currentLine = "x=5";
var result = printDir(currentLine.split('\n'), 0);
console.log(result);
var currentLine = "foo.";
var result = printDir(currentLine.split('\n'), 0);
console.log(result);
var currentLine = "x=foo.";
var result = printDir(currentLine.split('\n'), 0);
console.log(result);
var currentLine = "x=foo(boo().bla.)";
var result = printDir(currentLine.split('\n'), 0);
console.log(result);
// look for . right before current cursor
// if so look for [a-zA-Z0-9\.] scanning backwards
// extract that out
// special case: ) go untill you reach (
var currentLine = "if(1+1==2):";
var result = printDir(currentLine.split('\n'), 0);
console.log(result);
var currentLine = "if 1+1==2:";
var result = printDir(currentLine.split('\n'), 0);
console.log(result);
//# sourceMappingURL=testPrintDir.js.map