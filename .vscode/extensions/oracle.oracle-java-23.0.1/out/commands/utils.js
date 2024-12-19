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
exports.wrapCommandWithProgress = exports.wrapProjectActionWithProgress = exports.isNbCommandRegistered = exports.getContextUri = void 0;
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
const commands_1 = require("./commands");
const localiser_1 = require("../localiser");
const logger_1 = require("../logger");
const globalState_1 = require("../globalState");
const getContextUri = (ctx) => {
    var _a, _b;
    if (ctx === null || ctx === void 0 ? void 0 : ctx.fsPath) {
        return ctx;
    }
    if (ctx === null || ctx === void 0 ? void 0 : ctx.resourceUri) {
        return ctx.resourceUri;
    }
    if (typeof ctx == 'string') {
        try {
            return vscode_1.Uri.parse(ctx, true);
        }
        catch (err) {
            return vscode_1.Uri.file(ctx);
        }
    }
    return (_b = (_a = vscode_1.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.uri;
};
exports.getContextUri = getContextUri;
const isNbCommandRegistered = (command) => __awaiter(void 0, void 0, void 0, function* () {
    const registeredCommands = yield vscode_1.commands.getCommands();
    return registeredCommands.includes(command);
});
exports.isNbCommandRegistered = isNbCommandRegistered;
/**
 * Executes a project action. It is possible to provide an explicit configuration to use (or undefined), display output from the action etc.
 * Arguments are attempted to parse as file or editor references or Nodes; otherwise they are attempted to be passed to the action as objects.
 *
 * @param action ID of the project action to run
 * @param configuration configuration to use or undefined - use default/active one.
 * @param title Title for the progress displayed in vscode
 * @param log output channel that should be revealed
 * @param showOutput if true, reveals the passed output channel
 * @param args additional arguments
 * @returns Promise for the command's result
 */
const wrapProjectActionWithProgress = (action, configuration, title, log, ...args) => {
    let items = [];
    let actionParams = {
        action: action,
        configuration: configuration,
    };
    for (let item of args) {
        let u;
        if (item === null || item === void 0 ? void 0 : item.fsPath) {
            items.push(item.fsPath.toString());
        }
        else if (item === null || item === void 0 ? void 0 : item.resourceUri) {
            items.push(item.resourceUri.toString());
        }
        else {
            items.push(item);
        }
    }
    return (0, exports.wrapCommandWithProgress)(commands_1.nbCommands.runProjectAction, title, log, actionParams, ...items);
};
exports.wrapProjectActionWithProgress = wrapProjectActionWithProgress;
const wrapCommandWithProgress = (lsCommand, title, log, ...args) => {
    return vscode_1.window.withProgress({ location: vscode_1.ProgressLocation.Window }, p => {
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            let c = yield globalState_1.globalState.getClientPromise().client;
            if (yield (0, exports.isNbCommandRegistered)(lsCommand)) {
                p.report({ message: title });
                c.outputChannel.show(true);
                const start = new Date().getTime();
                try {
                    if (log) {
                        logger_1.LOGGER.log(`starting ${lsCommand}`);
                    }
                    const res = yield vscode_1.commands.executeCommand(lsCommand, ...args);
                    const elapsed = new Date().getTime() - start;
                    if (log) {
                        logger_1.LOGGER.log(`finished ${lsCommand} in ${elapsed} ms with result ${res}`);
                    }
                    const humanVisibleDelay = elapsed < 1000 ? 1000 : 0;
                    setTimeout(() => {
                        if (res) {
                            resolve(res);
                        }
                        else {
                            if (log) {
                                logger_1.LOGGER.error(`Result not obtained while executing ${lsCommand}`);
                            }
                            reject(res);
                        }
                    }, humanVisibleDelay);
                }
                catch (err) {
                    if (log) {
                        logger_1.LOGGER.error(`command ${lsCommand} executed with error: ${JSON.stringify(err)}`);
                    }
                    reject(err);
                }
            }
            else {
                reject(localiser_1.l10n.value("jdk.extension.progressBar.error_msg.cannotRun", { lsCommand: lsCommand, client: c }));
            }
        }));
    });
};
exports.wrapCommandWithProgress = wrapCommandWithProgress;
//# sourceMappingURL=utils.js.map