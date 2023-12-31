"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_WINDOWS = exports.NON_WINDOWS_PATH_VARIABLE_NAME = exports.WINDOWS_PATH_VARIABLE_NAME = void 0;
// TO DO: Deprecate in favor of IPlatformService
exports.WINDOWS_PATH_VARIABLE_NAME = 'Path';
exports.NON_WINDOWS_PATH_VARIABLE_NAME = 'PATH';
exports.IS_WINDOWS = /^win/.test(process.platform);
//# sourceMappingURL=constants.js.map