'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const getVariableNames = (selection, currentLineText) => {
    return (selection.isEmpty ? currentLineText : vscode.window.activeTextEditor.document.getText(selection).trim()).includes("print") ? [] :
        (currentLineText.match(/.+?(?=\=|\+=|\-=|\/=|\/\/=|\*=|\%=)/) || [])
            .filter(str => /^[A-Za-z0-9_,\.\s]+$/.test(str))
            .flatMap(str => str.includes(',') ? str.split(/\s*,\s*/) : [str.trim()]);
};
async function handleInsertion(customFString) {
    const editor = vscode.window.activeTextEditor;
    const currentLineText = editor.document.lineAt(editor.selection.start.line).text;
    for (const variableName of !customFString.match("variable") ? [''] : editor.selection.isEmpty ? getVariableNames(editor.selection, currentLineText) : [editor.document.getText(editor.selection)]) {
        const insertText = `print(${customFString.replace('variable', variableName)})`;
        if (currentLineText.trim()) {
            await vscode.commands.executeCommand('editor.action.insertLineAfter');
        }
        await editor.edit(editBuilder => { const insertPosition = currentLineText.trim() ? editor.selection.start : editor.selection.end; editBuilder.insert(insertPosition, insertText); });
    }
}
async function handleCommentOut(mode) {
    const editor = vscode.window.activeTextEditor;
    const start = mode === 'down' ? editor.selection.end.line : 0;
    const end = mode === 'up' ? editor.selection.start.line : editor.document.lineCount;
    await editor.edit(editBuilder => {
        const iterateStart = editor.selection.isEmpty ? start : editor.selection.start.line;
        const iterateEnd = editor.selection.isEmpty ? end : editor.selection.end.line;
        for (let i = iterateStart; i <= iterateEnd; i++) {
            const line = editor.document.lineAt(i);
            const indent = line.firstNonWhitespaceCharacterIndex;
            if (line.text.trim().startsWith("print(") || line.text.trim().startsWith("prints(")) {
                editBuilder.insert(new vscode.Position(i, indent), '# ');
            }
            else if (!editor.selection.isEmpty && (line.text.trim().startsWith("# print(") || line.text.trim().startsWith("# prints("))) {
                const toDeleteRange = new vscode.Range(line.range.start.translate(0, indent), line.range.start.translate(0, indent + 2));
                editBuilder.delete(toDeleteRange);
            }
        }
    });
}
async function deletePrintLines() {
    const editor = vscode.window.activeTextEditor;
    const { start, end } = editor.selection.isEmpty ? { start: 0, end: editor.document.lineCount - 1 } : { start: editor.selection.start.line, end: editor.selection.end.line };
    await editor.edit(editBuilder => {
        for (let i = end; i >= start; i--) {
            if (/^(# )?(print|prints)\(/.test(editor.document.lineAt(i).text.trim())) {
                editBuilder.delete(editor.document.lineAt(i).rangeIncludingLineBreak);
            }
        }
    });
}
function registerCommand(context, commandName, fcn, arg = null) {
    context.subscriptions.push(vscode.commands.registerCommand(commandName, () => { fcn(arg); }));
}
;
function activate(context) {
    console.log('Quick Python Print is now active!');
    for (let i = 1; i <= 5; i++) {
        registerCommand(context, `extension.python-printf${i}`, handleInsertion, vscode.workspace.getConfiguration().get(`customFString${i}`));
    }
    registerCommand(context, 'extension.python-print-commentall', handleCommentOut, 'all');
    registerCommand(context, 'extension.python-print-commentup', handleCommentOut, 'up');
    registerCommand(context, 'extension.python-print-commentdown', handleCommentOut, 'down');
    registerCommand(context, 'extension.python-print-deleteall', deletePrintLines);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map