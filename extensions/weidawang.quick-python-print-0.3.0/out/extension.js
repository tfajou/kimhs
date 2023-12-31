'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
function getInsertCode(printfunction, usefstring, mode, variableName, prefix, suffix, attr, color) {
    let codeToInsert = '';
    if (usefstring) {
        if (mode === 0) { // design for ctrl shift o
            if (color) {
                codeToInsert = `${printfunction}(colored(f"${prefix}${variableName}${attr}${suffix}{${variableName}${attr}}", "${color}"))`;
            }
            else {
                codeToInsert = `${printfunction}(f"${prefix}${variableName}${attr}${suffix}{${variableName}${attr}}")`;
            }
        }
        else if (mode === 1) { // design for ctrl shift t
            if (color) {
                codeToInsert = `${printfunction}(colored(f"${prefix}${attr}(${variableName})${suffix}{${attr}(${variableName})}", "${color}"))`;
            }
            else {
                codeToInsert = `${printfunction}(f"${prefix}${attr}(${variableName})${suffix}{${attr}(${variableName})}")`;
            }
        }
        else if (mode === 2) {
            if (color) {
                codeToInsert = `${printfunction}(colored("${variableName}".center(${prefix}, "${attr}"), "${color}"))`;
            }
            else {
                codeToInsert = `${printfunction}("${variableName}".center(${prefix}, "${attr}"))`;
            }
        }
    }
    else {
        codeToInsert = `${printfunction}(${variableName})`;
    }
    return codeToInsert;
}
let insertText = (text, moveCursor) => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Can\'t insert print() because no python file is opened or cursor is not focused');
        return;
    }
    let selection = editor.selection;
    editor.edit((editBuilder) => editBuilder.insert(selection.start, text)).then(() => {
        if (moveCursor) {
            // After editBuilder.insert(), the cursor have moved to the end of line, then move the cursor to the destination position
            vscode.commands.executeCommand('cursorMove', { to: 'left' });
        }
    });
};
async function handleInsertion(printfunction, usefstring, prefix, suffix, attr, mode, color) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Can\'t insert print() because no python file is opened or cursor is not focused');
        return;
    }
    let selection = editor.selection;
    if (selection.isEmpty) {
        // Without selection
        let currentline = selection.start.line;
        let currentlineText = editor.document.lineAt(currentline).text;
        // find the variable name in current line. To avoid any possible characters inside print(), so ignore this situation
        // use regex to match characters until the first occurrence of =, +=, -=, *=, /=, %=, **=, //=, and so on
        let regexList = currentlineText.includes("print") ? false : currentlineText.match(/.+?(?=\=|\+=|\-=|\/=|\/\/=|\*=|\%=)/);
        if (regexList) {
            console.log("regexList[0]:" + regexList[0]);
            console.log("regexList[1]:" + regexList[1]);
            if (regexList[0].includes(',') && /^[A-Za-z0-9_,\.\s]+$/.test(regexList[0])) { // the regex is to avoid regard sth like 'm[1,2]' as unpacked variable
                // there are multiple unpakced variables
                let v_list = regexList[0].split(',');
                for (var variableName of v_list) {
                    await vscode.commands.executeCommand('editor.action.insertLineAfter')
                        .then(() => {
                        const codeToInsert = getInsertCode(printfunction, usefstring, mode, variableName.trim(), prefix, suffix, attr, color);
                        insertText(codeToInsert);
                    });
                }
            }
            else {
                // only single variable
                let variableName = regexList[0].trim();
                vscode.commands.executeCommand('editor.action.insertLineAfter')
                    .then(() => {
                    const codeToInsert = getInsertCode(printfunction, usefstring, mode, variableName, prefix, suffix, attr, color);
                    insertText(codeToInsert);
                });
            }
        }
        else {
            // Not find variable, then just insert print() 
            // if current line is not empty, insert at next line, or just insert in current line
            if (currentlineText.trim()) {
                vscode.commands.executeCommand('editor.action.insertLineAfter')
                    .then(() => {
                    insertText('print()', true);
                });
            }
            else {
                insertText('print()', true);
            }
        }
    }
    else {
        // With selection
        const selected_text = editor.document.getText(selection).trim();
        if (selected_text.includes(',') && /^[A-Za-z0-9_,\.\s]+$/.test(selected_text)) {
            // there are multiple unpakced variables
            let v_list = selected_text.split(',');
            for (var variableName of v_list) {
                await vscode.commands.executeCommand('editor.action.insertLineAfter')
                    .then(() => {
                    const codeToInsert = getInsertCode(printfunction, usefstring, mode, variableName.trim(), prefix, suffix, attr, color);
                    insertText(codeToInsert);
                });
            }
        }
        else {
            const linecontent = editor.document.lineAt(selection.start.line).text.trim();
            // If selected variable is new defined for the first time, insert code at current line, or insert at next line
            if (selected_text === linecontent) {
                const codeToInsert = getInsertCode(printfunction, usefstring, mode, selected_text, prefix, suffix, attr, color);
                // to achieve insert in current line, just replace the selected text with codeToInsert
                editor.edit((editBuilder) => editBuilder.replace(selection, codeToInsert));
            }
            else {
                vscode.commands.executeCommand('editor.action.insertLineAfter')
                    .then(() => {
                    const codeToInsert = getInsertCode(printfunction, usefstring, mode, selected_text, prefix, suffix, attr, color);
                    insertText(codeToInsert);
                });
            }
        }
    }
}
;
async function handleCommentOut(mode) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Can\'t comment out print() because no python file is opened or cursor is not focused');
        return;
    }
    let start, end;
    let selection = editor.selection;
    if (selection.isEmpty) {
        let totalCount = editor.document.lineCount;
        switch (mode) {
            case 'all':
                start = 0;
                end = totalCount;
                break;
            case 'up':
                start = 0;
                end = editor.selection.start.line;
                break;
            case 'down':
                start = editor.selection.end.line;
                end = totalCount;
                break;
            default:
                start = 0;
                end = totalCount;
                break;
        }
    }
    else {
        start = editor.selection.start.line;
        end = editor.selection.end.line;
    }
    // toggle
    for (let i = start; i < end + 1; i++) {
        let line = editor.document.lineAt(i);
        const lineText = line.text.trim();
        // comment the line
        if (lineText.startsWith("print(") || lineText.startsWith("prints(")) {
            await editor.edit(editBuilder => {
                // get the indent position
                const indent = line.firstNonWhitespaceCharacterIndex;
                const p = new vscode.Position(i, indent);
                editBuilder.insert(p, '# ');
            });
        }
        else if (lineText.startsWith("# print(") || lineText.startsWith("# prints(")) {
            // uncomment the line
            await editor.edit(editBuilder => {
                const indent = line.firstNonWhitespaceCharacterIndex;
                let toDeleteRange = new vscode.Range(line.range.start.translate(0, indent), line.range.start.translate(0, indent + 2));
                editBuilder.delete(toDeleteRange);
            });
        }
    }
}
function activate(context) {
    console.log('Quick Python Print is now active!');
    let printfunction = vscode.workspace.getConfiguration().get('0.print function');
    let usefstring = vscode.workspace.getConfiguration().get('1.enable formatted string');
    let prefix = vscode.workspace.getConfiguration().get('2.prefix');
    let suffix = vscode.workspace.getConfiguration().get('3.suffix');
    let attr1 = vscode.workspace.getConfiguration().get('4.1.attribute1');
    let attr2 = vscode.workspace.getConfiguration().get('4.2.attribute2');
    let builtinfunc = vscode.workspace.getConfiguration().get('5.function');
    let colortext = vscode.workspace.getConfiguration().get('6.1.enable colored output text');
    let color1 = vscode.workspace.getConfiguration().get('6.2.color for ctrl shift l');
    let color2 = vscode.workspace.getConfiguration().get('6.3.color for ctrl shift o');
    let color3 = vscode.workspace.getConfiguration().get('6.4.color for ctrl shift t');
    let delimierSymbol = vscode.workspace.getConfiguration().get('7.1.delimiter symbol for ctrl shift ;');
    let delimierLength = vscode.workspace.getConfiguration().get('7.2.delimiter length for ctrl shift ;');
    let delimierColor = vscode.workspace.getConfiguration().get('7.3.delimiter color for ctrl shift ;');
    // monitor the configuration changes and update them
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
        printfunction = vscode.workspace.getConfiguration().get('0.print function');
        usefstring = vscode.workspace.getConfiguration().get('1.enable formatted string');
        prefix = vscode.workspace.getConfiguration().get('2.prefix');
        suffix = vscode.workspace.getConfiguration().get('3.suffix');
        attr1 = vscode.workspace.getConfiguration().get('4.1.attribute1');
        attr2 = vscode.workspace.getConfiguration().get('4.2.attribute2');
        builtinfunc = vscode.workspace.getConfiguration().get('5.function');
        colortext = vscode.workspace.getConfiguration().get('6.1.enable colored output text');
        color1 = vscode.workspace.getConfiguration().get('6.2.color for ctrl shift l');
        color2 = vscode.workspace.getConfiguration().get('6.3.color for ctrl shift o');
        color3 = vscode.workspace.getConfiguration().get('6.4.color for ctrl shift t');
        delimierSymbol = vscode.workspace.getConfiguration().get('7.1.delimiter symbol for ctrl shift ;');
        delimierLength = vscode.workspace.getConfiguration().get('7.2.delimiter length for ctrl shift ;');
        delimierColor = vscode.workspace.getConfiguration().get('7.3.delimiter color for ctrl shift ;');
    }));
    let disposable;
    disposable = vscode.commands.registerCommand('extension.python-print', () => {
        if (colortext) {
            handleInsertion(printfunction, usefstring, prefix, suffix, attr1, 0, color1);
        }
        else {
            handleInsertion(printfunction, usefstring, prefix, suffix, attr1, 0);
        }
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-print-tensor-shape', () => {
        if (colortext) {
            handleInsertion(printfunction, usefstring, prefix, suffix, attr2, 0, color2);
        }
        else {
            handleInsertion(printfunction, usefstring, prefix, suffix, attr2, 0);
        }
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-print-function', () => {
        if (colortext) {
            handleInsertion(printfunction, usefstring, prefix, suffix, builtinfunc, 1, color3);
        }
        else {
            handleInsertion(printfunction, usefstring, prefix, suffix, builtinfunc, 1);
        }
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-print-commentall', () => {
        handleCommentOut("all");
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-print-commentup', () => {
        handleCommentOut("up");
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-print-commentdown', () => {
        handleCommentOut("down");
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-print-deleteall', async () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Can\'t delete print() because no python file is opened or cursor is not focused');
            return;
        }
        let start, end;
        let selection = editor.selection;
        if (selection.isEmpty) {
            start = 0;
            end = editor.document.lineCount - 1;
        }
        else {
            start = editor.selection.start.line;
            end = editor.selection.end.line;
        }
        // adapted from https://github.com/wakamex/Quick-Python-Print/blob/3f1bf41358cb9e4e0805b70f9feb2f143f2a4e88/src/extension.ts#L44 
        await editor.edit(editBuilder => {
            for (let i = end; i >= start; i--) {
                if (/^(# )?(print|prints|pprint|logger\.debug|logger\.info)\(/.test(editor.document.lineAt(i).text.trim())) {
                    editBuilder.delete(editor.document.lineAt(i).rangeIncludingLineBreak);
                }
            }
        });
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-print-delimiter', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Can\'t insert separator because no python file is opened or cursor is not focused');
            return;
        }
        let selection = editor.selection;
        let codeToInsert = "";
        const v = "";
        if (colortext) {
            codeToInsert = getInsertCode(printfunction, usefstring, 2, v, delimierLength, v, delimierSymbol, delimierColor);
        }
        else {
            codeToInsert = getInsertCode(printfunction, usefstring, 2, v, delimierLength, v, delimierSymbol);
        }
        editor.edit((editBuilder) => editBuilder.insert(selection.start, codeToInsert));
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map