"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NbProcessManager = void 0;
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
const child_process_1 = require("child_process");
const vscode_1 = require("vscode");
const localiser_1 = require("../localiser");
const constants_1 = require("../constants");
const logger_1 = require("../logger");
class NbProcessManager {
    constructor(userdir, nbcodePath, ideLaunchOptions) {
        this.stdOutText = "";
        this.stdErrText = "";
        this.startProcess = () => {
            const spawnProcess = (0, child_process_1.spawn)(this.nbcodePath, this.ideLaunchOptions, {
                cwd: this.userdir,
                stdio: ["ignore", "pipe", "pipe"]
            });
            this.process = spawnProcess;
        };
        this.killProcess = (notifyKill) => {
            logger_1.LOGGER.log("Request to kill LSP server.");
            if (!this.process) {
                logger_1.LOGGER.error("Cannot kill: No current process");
                return Promise.resolve();
            }
            const processToKill = this.process;
            this.process = null;
            if (notifyKill) {
                vscode_1.window.setStatusBarMessage(localiser_1.l10n.value("jdk.extension.command.statusBar.message.restartingServer", { SERVER_NAME: constants_1.extConstants.SERVER_NAME }), 2000);
            }
            return new Promise((resolve, reject) => {
                processToKill.on('close', (code) => {
                    logger_1.LOGGER.log(`LSP server closed: ${processToKill.pid}`);
                    resolve();
                });
                logger_1.LOGGER.log(`Killing LSP server ${processToKill.pid}`);
                if (!processToKill.kill()) {
                    reject(new Error("Cannot kill process"));
                }
            });
        };
        this.disconnect = () => {
            var _a;
            return (_a = this.process) === null || _a === void 0 ? void 0 : _a.disconnect();
        };
        this.getProcess = () => {
            return this.process;
        };
        this.getProcessId = () => {
            var _a;
            return (_a = this.process) === null || _a === void 0 ? void 0 : _a.pid;
        };
        this.appendStdOut = (text) => {
            if (this.stdOutText != null) {
                this.stdOutText += text;
            }
        };
        this.appendStdErr = (text) => {
            this.stdErrText += text;
        };
        this.getStdOut = () => {
            return this.stdOutText;
        };
        this.setStdOut = (stdOut) => {
            this.stdOutText = stdOut;
        };
        this.getStdErr = () => {
            return this.stdErrText;
        };
        this.nbcodePath = nbcodePath;
        this.ideLaunchOptions = ideLaunchOptions;
        this.userdir = userdir;
    }
}
exports.NbProcessManager = NbProcessManager;
//# sourceMappingURL=nbProcessManager.js.map