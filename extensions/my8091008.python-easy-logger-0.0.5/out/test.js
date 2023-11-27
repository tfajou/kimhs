'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
let _print_or_log = true;
function activate(context) {
    console.log('Quick Python log.info is now active!');
    console.log(vscode.env.machineId);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=test.js.map