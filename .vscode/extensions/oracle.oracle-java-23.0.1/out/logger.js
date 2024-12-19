"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGGER = exports.ExtensionLogger = void 0;
/*
  Copyright (c) 2023-2024, Oracle and/or its affiliates.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

     https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
const vscode_1 = require("vscode");
const constants_1 = require("./constants");
var LogLevel;
(function (LogLevel) {
    LogLevel["INFO"] = "INFO";
    LogLevel["WARN"] = "WARN";
    LogLevel["ERROR"] = "ERROR";
})(LogLevel || (LogLevel = {}));
class ExtensionLogger {
    constructor(channelName) {
        this.outChannel = vscode_1.window.createOutputChannel(channelName);
    }
    log(message) {
        const formattedMessage = `[${LogLevel.INFO}]: ${message}`;
        this.printLog(formattedMessage);
    }
    warn(message) {
        const formattedMessage = `[${LogLevel.WARN}]: ${message}`;
        this.printLog(formattedMessage);
    }
    error(message) {
        const formattedMessage = `[${LogLevel.ERROR}]: ${message}`;
        this.printLog(formattedMessage);
    }
    logNoNL(message) {
        this.outChannel.append(message);
    }
    showOutputChannelUI(show) {
        this.outChannel.show(show);
    }
    getOutputChannel() {
        return this.outChannel;
    }
    dispose() {
        this.outChannel.dispose();
    }
    printLog(message) {
        const timestamp = new Date().toISOString();
        this.outChannel.appendLine(`[${timestamp}] ${message}`);
    }
}
exports.ExtensionLogger = ExtensionLogger;
exports.LOGGER = new ExtensionLogger(constants_1.extConstants.SERVER_NAME);
//# sourceMappingURL=logger.js.map