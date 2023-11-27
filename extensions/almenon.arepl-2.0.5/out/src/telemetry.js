"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
const os_1 = require("os");
const path_1 = require("path");
const areplUtilities_1 = require("./areplUtilities");
const fs_1 = require("fs");
class Reporter {
    constructor(enabled) {
        this.enabled = enabled;
        const extensionId = "almenon.arepl";
        const extension = vscode_1.extensions.getExtension(extensionId);
        const extensionVersion = extension.packageJSON.version;
        let instrumentation_key = '';
        try {
            instrumentation_key = fs_1.readFileSync(path_1.join(extension.extensionPath, "media", 'instrumentation_key.txt')).toString();
        }
        catch (error) {
            console.warn('no instrumentation key for AREPL found - disabling telemetry');
            this.enabled = false;
            // TelemetryReporter raises error if falsy key so we need to escape before we hit it
            return;
        }
        this.reporter = new vscode_extension_telemetry_1.default(extensionId, extensionVersion, instrumentation_key);
        this.resetMeasurements();
    }
    sendError(error, code = 0, category = 'typescript') {
        console.error(`${category} error: ${error.name} code ${code}\n${error.stack}`);
        if (this.enabled) {
            error.stack = this.anonymizePaths(error.stack);
            // no point in sending same error twice (and we want to stay under free API limit)
            if (error.stack == this.lastStackTrace)
                return;
            this.reporter.sendTelemetryException(error, {
                code: code.toString(),
                category,
            });
            this.lastStackTrace = error.stack;
        }
    }
    /**
     * sends various stats to azure app insights
     */
    sendFinishedEvent(settings) {
        if (this.enabled) {
            const measurements = {};
            measurements['timeSpent'] = (Date.now() - this.timeOpened) / 1000;
            measurements['numRuns'] = this.numRuns;
            measurements['numInterruptedRuns'] = this.numInterruptedRuns;
            if (this.numRuns != 0) {
                measurements['execTime'] = this.execTime / this.numRuns;
                measurements['totalPyTime'] = this.totalPyTime / this.numRuns;
                measurements['totalTime'] = this.totalTime / this.numRuns;
            }
            else { // lets avoid 0/0 NaN error
                measurements['execTime'] = 0;
                measurements['totalPyTime'] = 0;
                measurements['totalTime'] = 0;
            }
            const properties = {};
            // no idea why I did this but i think there was a reason?
            // this is why you leave comments people
            const settingsDict = JSON.parse(JSON.stringify(settings));
            for (let key in settingsDict) {
                properties[key] = settingsDict[key];
            }
            return areplUtilities_1.default.getPythonPath().then((path) => {
                properties['pythonPath'] = this.anonymizePaths(path);
                properties['pythonVersion'] = this.pythonVersion;
                this.reporter.sendTelemetryEvent("closed", properties, measurements);
                this.resetMeasurements();
            });
        }
        return Promise.resolve();
    }
    resetMeasurements() {
        this.timeOpened = Date.now();
        this.numRuns = 0;
        this.numInterruptedRuns = 0;
        this.execTime = 0;
        this.totalPyTime = 0;
        this.totalTime = 0;
    }
    /**
     * replace username with anon
     */
    anonymizePaths(input) {
        if (input == null)
            return input;
        return input.replace(new RegExp('\\' + path_1.sep + os_1.userInfo().username, 'g'), path_1.sep + 'anon');
    }
    dispose() {
        // reporter may be undefined if telemetry is disabled
        if (this.reporter !== undefined)
            this.reporter.dispose();
    }
}
exports.default = Reporter;
//# sourceMappingURL=telemetry.js.map