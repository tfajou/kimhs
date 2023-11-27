"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const os_1 = require("os");
const settings_1 = require("./settings");
const python_shell_1 = require("python-shell");
const vscodeUtilities_1 = require("./vscodeUtilities");
/**
 * utilities specific to AREPL
 */
class areplUtils {
    static getEnvFilePath() {
        let envFilePath = vscodeUtilities_1.default.getSettingOrOtherExtSettingAsDefault("AREPL", "python", "envFile");
        if (!envFilePath)
            envFilePath = "${workspaceFolder}/.env";
        return vscodeUtilities_1.default.expandPathSetting(envFilePath);
    }
    static getPythonPath(resource = null) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // see bottom of file for license
            // adapted from vscode-restructuredtext/vscode-restructuredtext#224
            const extension = vscode.extensions.getExtension('ms-python.python');
            if (!extension) {
                const pythonPath = settings_1.settings().get('pythonPath');
                return pythonPath ? pythonPath : python_shell_1.PythonShell.defaultPythonPath;
            }
            const usingNewInterpreterStorage = (_b = (_a = extension.packageJSON) === null || _a === void 0 ? void 0 : _a.featureFlags) === null || _b === void 0 ? void 0 : _b.usingNewInterpreterStorage;
            if (usingNewInterpreterStorage) {
                if (!extension.isActive) {
                    yield extension.activate();
                }
                const pythonPath = extension.exports.settings.getExecutionDetails(resource).execCommand;
                if (!pythonPath) {
                    const pythonPath = settings_1.settings().get('pythonPath');
                    return pythonPath ? pythonPath : python_shell_1.PythonShell.defaultPythonPath;
                }
                return pythonPath[0]; // might be more elements if conda, but we are not bothering to support that yet
            }
            else {
                let pythonPath = vscodeUtilities_1.default.getSettingOrOtherExtSettingAsDefault("AREPL", "python", "pythonPath");
                if (!pythonPath)
                    pythonPath = python_shell_1.PythonShell.defaultPythonPath;
                return vscodeUtilities_1.default.expandPathSetting(pythonPath);
            }
        });
    }
    static insertDefaultImports(editor) {
        return editor.edit((editBuilder) => {
            let imports = settings_1.settings().get("defaultImports");
            imports = imports.filter(i => i.trim() != "");
            if (imports.length == 0)
                return;
            imports = imports.map(i => {
                const words = i.split(" ");
                // python import syntax: "import library" or "from library import method"
                // so if user didnt specify import we will do that for them :)
                if (words[0] != "import" && words[0] != "from" && words[0].length > 0) {
                    i = "import " + i;
                }
                return i;
            });
            editBuilder.insert(new vscode.Position(0, 0), imports.join(os_1.EOL) + os_1.EOL);
        });
    }
}
exports.default = areplUtils;
//# sourceMappingURL=areplUtilities.js.map