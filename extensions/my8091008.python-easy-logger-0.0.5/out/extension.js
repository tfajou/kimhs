'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
let _print_or_log = true;
function getInsertCode(mode, variableName, prefix, suffix, attr, color) {
    let codeToInsert = '';
    if (mode === 0) {
        let newText = `f"${prefix}${variableName}${attr}${suffix} {${variableName}${attr}}"`;
        if (color) {
            // codeToInsert = `log.info(colored(f"${prefix}${variableName}${attr}${suffix}", "${color}"), ${variableName}${attr})`;
            codeToInsert = _print_or_log ? `print(colored(${newText}, "${color}"))` : `log.info(colored(${newText}, "${color}"))`;
        }
        else {
            codeToInsert = _print_or_log ? `print(${newText})` : `log.info(${newText})`;
        }
    }
    else if (mode === 1) {
        let newText = `f"${prefix}${attr}(${variableName})${suffix} {${attr}(${variableName})}"`;
        if (color) {
            // codeToInsert = `log.info(colored(f"${prefix}${attr}(${variableName})${suffix}", "${color}"), ${attr}(${variableName}))`;
            codeToInsert = _print_or_log ? `print(colored(${newText}, "${color}"))` : `log.info(colored(${newText}, "${color}"))`;
        }
        else {
            // codeToInsert = `log.info(f"${prefix}${attr}(${variableName})${suffix}", ${attr}(${variableName}))`;
            codeToInsert = _print_or_log ? `print(${newText})` : `log.info(${newText})`;
        }
    }
    else if (mode === 2) {
        let newText = `f"{${variableName}}".center(${attr}, "${prefix}")`;
        if (color) {
            codeToInsert = _print_or_log ? `print(colored(${newText}, "${color}"))` : `log.info(colored(${newText}, "${color}"))`;
        }
        else {
            codeToInsert = _print_or_log ? `print(${newText})` : `log.info(${newText})`;
        }
    }
    return codeToInsert;
}
let insertText = (text, moveCursor) => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Can\'t insert log.info because no python file is opened or cursor is not focused');
        return;
    }
    let selection = editor.selection;
    editor.edit((editBuilder) => editBuilder.insert(selection.start, text)).then(() => {
        if (moveCursor) {
            // After editBuilder.insert(), the cursor have moved to the end of line
            // You have 2 methods to move the cursor to the destination position
            // Method 1: use built-in command 'cursorMove'
            vscode.commands.executeCommand('cursorMove', { to: 'left' });
            // Method 2 have 2 sub-methods, first one need get newselection, second one need calculate text length
            // Method 2-1:
            // let newselection = editor.selection;
            // var destPosition = new vscode.Position(newselection.start.line, newselection.start.character - 1);
            // Method 2-2:
            // var destPosition = new vscode.Position(selection.start.line, selection.start.character + text.length - 1);  // selection.start.character is indent
            // var newSelection = new vscode.Selection(destPosition, destPosition);
            // editor.selection = newSelection;
        }
    });
};
async function handleInsertion(prefix, suffix, attr, mode, color) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Can\'t insert log.info() because no python file is opened or cursor is not focused');
        return;
    }
    let selection = editor.selection;
    if (selection.isEmpty) {
        // Without selection
        let currentline = selection.start.line;
        let currentlineText = editor.document.lineAt(currentline).text;
        // find the variable name in current line. To avoid any possible characters inside log.info(), so ignore this situation
        // use regex to match characters until the first occurrence of =, +=, -=, *=, /=, %=, **=, //=, and so on
        let regexList = currentlineText.includes("log.info") ? false : currentlineText.match(/.+?(?=\=|\+=|\-=|\/=|\/\/=|\*=|\%=)/);
        if (regexList) {
            console.log("regexList[0]:" + regexList[0]);
            console.log("regexList[1]:" + regexList[1]);
            if (regexList[0].includes(',') && /^[A-Za-z0-9_,\.\s]+$/.test(regexList[0])) { // the regex is to avoid regard sth like 'm[1,2]' as unpacked variable
                // there are multiple unpakced variables1,2
                let v_list = regexList[0].split(',');
                for (var variableName of v_list) {
                    await vscode.commands.executeCommand('editor.action.insertLineAfter')
                        .then(() => {
                        const codeToInsert = getInsertCode(mode, variableName.trim(), prefix, suffix, attr, color);
                        insertText(codeToInsert);
                    });
                }
            }
            else {
                // only single variable
                let variableName = regexList[0].trim();
                vscode.commands.executeCommand('editor.action.insertLineAfter')
                    .then(() => {
                    const codeToInsert = getInsertCode(mode, variableName, prefix, suffix, attr, color);
                    insertText(codeToInsert);
                });
            }
        }
        else {
            // Not find variable, then just insert log.info()
            // if current line is not empty, insert at next line, or just insert in current line
            if (currentlineText.trim()) {
                vscode.commands.executeCommand('editor.action.insertLineAfter')
                    .then(() => {
                    insertText('log.info()', true);
                });
            }
            else {
                insertText('log.info()', true);
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
                    const codeToInsert = getInsertCode(mode, variableName.trim(), prefix, suffix, attr, color);
                    insertText(codeToInsert);
                });
            }
        }
        else {
            const linecontent = editor.document.lineAt(selection.start.line).text.trim();
            // If selected variable is new defined for the first time, insert code at current line, or insert at next line
            if (selected_text === linecontent) {
                const codeToInsert = getInsertCode(mode, selected_text, prefix, suffix, attr, color);
                // to achieve insert in current line, just replace the selected text with codeToInsert
                editor.edit((editBuilder) => editBuilder.replace(selection, codeToInsert));
            }
            else {
                vscode.commands.executeCommand('editor.action.insertLineAfter')
                    .then(() => {
                    const codeToInsert = getInsertCode(mode, selected_text, prefix, suffix, attr, color);
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
        vscode.window.showErrorMessage('Can\'t comment out log.info() because no python file is opened or cursor is not focused');
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
        for (let i = start; i < end + 1; i++) {
            let line = editor.document.lineAt(i);
            // comment the line
            if (line.text.trim().startsWith("log.info(") || line.text.trim().startsWith("log.info(")) {
                // why use await, see:https://github.com/Microsoft/vscode/issues/9874#issuecomment-235769379
                await editor.edit(editBuilder => {
                    // get the indent position
                    const indent = line.firstNonWhitespaceCharacterIndex;
                    const p = new vscode.Position(i, indent);
                    editBuilder.insert(p, '# ');
                });
            }
        }
    }
    else {
        start = editor.selection.start.line;
        end = editor.selection.end.line;
        // toggle
        for (let i = start; i < end + 1; i++) {
            let line = editor.document.lineAt(i);
            // comment the line
            if (line.text.trim().startsWith("log.info(") || line.text.trim().startsWith("log.info(")) {
                // why use await, see:https://github.com/Microsoft/vscode/issues/9874#issuecomment-235769379
                await editor.edit(editBuilder => {
                    // get the indent position
                    const indent = line.firstNonWhitespaceCharacterIndex;
                    const p = new vscode.Position(i, indent);
                    editBuilder.insert(p, '# ');
                });
            }
            else if (line.text.trim().startsWith("# log.info(") || line.text.trim().startsWith("# log.info(")) {
                // uncomment out the line
                await editor.edit(editBuilder => {
                    const indent = line.firstNonWhitespaceCharacterIndex;
                    let toDeleteRange = new vscode.Range(line.range.start.translate(0, indent), line.range.start.translate(0, indent + 2));
                    editBuilder.delete(toDeleteRange);
                });
            }
        }
    }
}
function activate(context) {
    console.log('Quick Python log.info is now active!');
    console.log(vscode.env.machineId);
    let custom_prompt = vscode.workspace.getConfiguration().get('custom_prompt');
    let prefix = vscode.workspace.getConfiguration().get('1.1.prefix');
    let latex_replace = vscode.workspace.getConfiguration().get('latex_replace');
    let suffix = vscode.workspace.getConfiguration().get('1.2.suffix');
    let attr1 = vscode.workspace.getConfiguration().get('2.attribute1');
    let attr2 = vscode.workspace.getConfiguration().get('3.attribute2');
    let attr3 = vscode.workspace.getConfiguration().get('4.attribute3');
    let builtinfunc = vscode.workspace.getConfiguration().get('4.function');
    let colortext = vscode.workspace.getConfiguration().get('5.1.enable colored output text');
    let color1 = vscode.workspace.getConfiguration().get('5.2.color for ctrl shift l');
    let color2 = vscode.workspace.getConfiguration().get('5.3.color for ctrl shift o');
    let color3 = vscode.workspace.getConfiguration().get('5.4.color for ctrl shift t');
    let color4 = vscode.workspace.getConfiguration().get('5.5.color for ctrl shift ;');
    let color5 = vscode.workspace.getConfiguration().get('5.6.color for ctrl shift 9');
    let delimierSymbol = vscode.workspace.getConfiguration().get('6.1.delimiter symbol for ctrl shift ;');
    let delimierLength = vscode.workspace.getConfiguration().get('6.2.delimiter length for ctrl shift ;');
    let delimierColor = vscode.workspace.getConfiguration().get('6.3.delimiter color for ctrl shift ;');
    // monitor the configuration changes and update them
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
        custom_prompt = vscode.workspace.getConfiguration().get('custom_prompt');
        prefix = vscode.workspace.getConfiguration().get('1.1.prefix');
        latex_replace = vscode.workspace.getConfiguration().get('latex_replace');
        suffix = vscode.workspace.getConfiguration().get('1.2.suffix');
        attr1 = vscode.workspace.getConfiguration().get('2.attribute1');
        attr2 = vscode.workspace.getConfiguration().get('3.attribute2');
        attr3 = vscode.workspace.getConfiguration().get('4.attribute3');
        builtinfunc = vscode.workspace.getConfiguration().get('4.function');
        colortext = vscode.workspace.getConfiguration().get('5.1.enable colored output text');
        color1 = vscode.workspace.getConfiguration().get('5.2.color for ctrl shift l');
        color2 = vscode.workspace.getConfiguration().get('5.3.color for ctrl shift o');
        color3 = vscode.workspace.getConfiguration().get('5.4.color for ctrl shift t');
        color4 = vscode.workspace.getConfiguration().get('5.5.color for ctrl shift ;');
        color5 = vscode.workspace.getConfiguration().get('5.6.color for ctrl shift 9');
        delimierSymbol = vscode.workspace.getConfiguration().get('6.1.delimiter symbol for ctrl shift ;');
        delimierLength = vscode.workspace.getConfiguration().get('6.2.delimiter length for ctrl shift ;');
        delimierColor = vscode.workspace.getConfiguration().get('6.3.delimiter color for ctrl shift ;');
    }));
    let disposable;
    disposable = vscode.commands.registerCommand('extension.python-log-tensor-shape', () => {
        if (Boolean(colortext)) {
            handleInsertion(String(prefix), String(suffix), String(attr2), 0, String(color2));
        }
        else {
            handleInsertion(String(prefix), String(suffix), String(attr2), 0);
        }
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-log-tensor-type', () => {
        if (Boolean(colortext)) {
            handleInsertion(String(prefix), String(suffix), String(builtinfunc), 1, String(color3));
        }
        else {
            handleInsertion(String(prefix), String(suffix), String(builtinfunc), 1);
        }
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-log-delimiter', () => {
        if (Boolean(colortext)) {
            handleInsertion(String(delimierSymbol), String(delimierSymbol), String(delimierLength), 2, String(color4));
        }
        else {
            handleInsertion(String(delimierSymbol), String(delimierSymbol), String(delimierLength), 2);
        }
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-log-tensor', () => {
        if (Boolean(colortext)) {
            handleInsertion(String(prefix), String(suffix), String(attr1), 0, String(color1));
        }
        else {
            handleInsertion(String(prefix), String(suffix), String(attr1), 0);
        }
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-log-commentall', () => {
        handleCommentOut("all");
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-log-commentup', () => {
        handleCommentOut("up");
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-log-commentdown', () => {
        handleCommentOut("down");
    });
    context.subscriptions.push(disposable);
    const stored_print_or_log = context.globalState.get('_print_or_log');
    if (typeof stored_print_or_log === 'boolean') {
        _print_or_log = stored_print_or_log;
    }
    else {
        context.globalState.update('_print_or_log', _print_or_log);
    }
    disposable = vscode.commands.registerCommand('extension.toggle_print_or_log', () => {
        _print_or_log = !_print_or_log;
        context.globalState.update('_print_or_log', _print_or_log);
        let message = _print_or_log ? 'print' : 'log.info';
        vscode.window.showInformationMessage(`Toggle to ${message}`);
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.replaceSelectedText', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            const newText = _print_or_log ? `print(${text})` : `log.info(${text})`;
            editor.edit(editBuilder => {
                editBuilder.replace(selection, newText);
            });
        }
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.replaceSelectedAcademic', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            let newText = `I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it and answer in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations. My first sentence is: ${text}`;
            editor.edit(editBuilder => {
                editBuilder.replace(selection, newText);
            });
        }
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.replaceSelectedAcademic2', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            let newText = `I want you to act as an academic journal editor. Please rephrase the paragraph from an academic angle based on the writting style of the Science journal: ${text}`;
            editor.edit(editBuilder => {
                editBuilder.replace(selection, newText);
            });
        }
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.latex_replace', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            const newText = `${latex_replace}{${text}}`;
            editor.edit(editBuilder => {
                editBuilder.replace(selection, newText);
            });
        }
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.replaceSelectedCustomPrompt', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            let newText = `${custom_prompt} ${text}`;
            editor.edit(editBuilder => {
                editBuilder.replace(selection, newText);
            });
        }
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-log-deleteall', async () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Can\'t delete log.info() because no python file is opened or cursor is not focused');
            return;
        }
        let start, end;
        let selection = editor.selection;
        if (selection.isEmpty) {
            start = 0;
            end = editor.document.lineCount - 1; // the lineCount start from 1, so minus 1
        }
        else {
            start = editor.selection.start.line;
            end = editor.selection.end.line;
        }
        // array to store the lines to be deleted
        let linesToDelete = [];
        for (let i = start; i < end + 1; i++) { // the for loop will not reach end, so plus 1
            const line = editor.document.lineAt(i);
            const lineText = line.text.trim();
            console.log("lineText: " + lineText);
            if (lineText.startsWith("log.info(") || lineText.startsWith("# log.info(") || lineText.startsWith("log.info(") || lineText.startsWith("# log.info(")) {
                linesToDelete.push(line.lineNumber);
            }
        }
        console.log("linesToDelete", linesToDelete);
        for (let i = 0; i < linesToDelete.length; i++) {
            const line = editor.document.lineAt(linesToDelete[i] - i); // Every time a row is deleted, the index is decremented by one
            await editor.edit(editBuilder => {
                editBuilder.delete(line.rangeIncludingLineBreak);
            });
        }
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.python-log-delimiter', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Can\'t insert separator because no python file is opened or cursor is not focused');
            return;
        }
        let selection = editor.selection;
        let codeToInsert = "";
        const v = "";
        if (Boolean(colortext)) {
            codeToInsert = getInsertCode(3, v, String(delimierLength), v, String(delimierSymbol), String(delimierColor));
        }
        else {
            codeToInsert = getInsertCode(3, v, String(delimierLength), v, String(delimierSymbol));
        }
        editor.edit((editBuilder) => editBuilder.insert(selection.start, codeToInsert));
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map