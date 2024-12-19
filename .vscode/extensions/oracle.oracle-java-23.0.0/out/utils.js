"use strict";
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
exports.calculateChecksum = exports.downloadFileWithProgressBar = exports.httpsGet = exports.MultiStepInput = void 0;
const vscode = require("vscode");
const https = require("https");
const fs = require("fs");
const util_1 = require("util");
const crypto = require("crypto");
const localiser_1 = require("./localiser");
class InputFlowAction {
}
InputFlowAction.back = new InputFlowAction();
InputFlowAction.cancel = new InputFlowAction();
InputFlowAction.resume = new InputFlowAction();
class MultiStepInput {
    constructor() {
        this.steps = [];
    }
    static run(start) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = new MultiStepInput();
            return input.stepThrough(start);
        });
    }
    stepThrough(start) {
        return __awaiter(this, void 0, void 0, function* () {
            let step = start;
            while (step) {
                this.steps.push(step);
                if (this.current) {
                    this.current.enabled = false;
                    this.current.busy = true;
                }
                try {
                    step = yield step(this);
                }
                catch (err) {
                    if (err === InputFlowAction.back) {
                        this.steps.pop();
                        step = this.steps.pop();
                    }
                    else if (err === InputFlowAction.resume) {
                        step = this.steps.pop();
                    }
                    else if (err === InputFlowAction.cancel) {
                        step = undefined;
                    }
                    else {
                        throw err;
                    }
                }
            }
            if (this.current) {
                this.current.dispose();
            }
        });
    }
    showQuickPick({ title, step, totalSteps, items, selectedItems, placeholder, canSelectMany, buttons, shouldResume }) {
        return __awaiter(this, void 0, void 0, function* () {
            const disposables = [];
            try {
                return yield new Promise((resolve, reject) => {
                    const input = vscode.window.createQuickPick();
                    input.title = title;
                    input.step = step;
                    input.totalSteps = totalSteps;
                    input.placeholder = placeholder;
                    input.items = items;
                    if (canSelectMany) {
                        input.canSelectMany = canSelectMany;
                    }
                    if (selectedItems) {
                        input.selectedItems = selectedItems;
                    }
                    input.buttons = [
                        ...(this.steps.length > 1 ? [vscode.QuickInputButtons.Back] : []),
                        ...(buttons || [])
                    ];
                    input.ignoreFocusOut = true;
                    disposables.push(input.onDidTriggerButton(item => {
                        if (item === vscode.QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        }
                        else {
                            resolve(item);
                        }
                    }), input.onDidAccept(() => {
                        resolve(input.selectedItems);
                    }), input.onDidHide(() => {
                        (() => __awaiter(this, void 0, void 0, function* () {
                            reject(shouldResume && (yield shouldResume()) ? InputFlowAction.resume : InputFlowAction.cancel);
                        }))()
                            .catch(reject);
                    }));
                    if (this.current) {
                        this.current.dispose();
                    }
                    this.current = input;
                    this.current.show();
                });
            }
            finally {
                disposables.forEach(d => d.dispose());
            }
        });
    }
    showInputBox({ title, step, totalSteps, value, prompt, validate, password, buttons, shouldResume }) {
        return __awaiter(this, void 0, void 0, function* () {
            const disposables = [];
            try {
                return yield new Promise((resolve, reject) => {
                    const input = vscode.window.createInputBox();
                    input.title = title;
                    input.step = step;
                    input.totalSteps = totalSteps;
                    input.value = value || '';
                    input.prompt = prompt;
                    if (password) {
                        input.password = password;
                    }
                    input.buttons = [
                        ...(this.steps.length > 1 ? [vscode.QuickInputButtons.Back] : []),
                        ...(buttons || [])
                    ];
                    input.ignoreFocusOut = true;
                    // let validating = validate('');
                    disposables.push(input.onDidTriggerButton(item => {
                        if (item === vscode.QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        }
                        else {
                            resolve(item);
                        }
                    }), input.onDidAccept(() => __awaiter(this, void 0, void 0, function* () {
                        const value = input.value;
                        input.enabled = false;
                        input.busy = true;
                        const validationMessage = yield validate(value);
                        if (validationMessage) {
                            input.validationMessage = validationMessage;
                        }
                        else {
                            resolve(value);
                        }
                        input.enabled = true;
                        input.busy = false;
                    })), input.onDidHide(() => {
                        (() => __awaiter(this, void 0, void 0, function* () {
                            reject(shouldResume && (yield shouldResume()) ? InputFlowAction.resume : InputFlowAction.cancel);
                        }))()
                            .catch(reject);
                    }));
                    if (this.current) {
                        this.current.dispose();
                    }
                    this.current = input;
                    this.current.show();
                });
            }
            finally {
                disposables.forEach(d => d.dispose());
            }
        });
    }
}
exports.MultiStepInput = MultiStepInput;
function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(localiser_1.l10n.value("jdk.extension.utils.error_message.failedHttpsRequest", {
                    url,
                    statusCode: res.statusCode
                })));
            }
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (e) => {
            reject(e);
        });
    });
}
exports.httpsGet = httpsGet;
function downloadFileWithProgressBar(downloadUrl, downloadLocation, message) {
    return vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, cancellable: false }, p => {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(downloadLocation);
            https.get(downloadUrl, (response) => {
                if (response.statusCode !== 200) {
                    return reject(new Error(localiser_1.l10n.value("jdk.extension.utils.error_message.failedHttpsRequest", {
                        url: downloadUrl,
                        statusCode: response.statusCode
                    })));
                }
                const totalSize = parseInt(response.headers['content-length'] || '0');
                let downloadedSize = 0;
                response.pipe(file);
                response.on('data', (chunk) => {
                    downloadedSize += chunk.length;
                    if (totalSize) {
                        const increment = parseFloat(((chunk.length / totalSize) * 100).toFixed(2));
                        const progress = parseFloat(((downloadedSize / totalSize) * 100).toFixed(2));
                        p.report({ increment, message: `${message}: ${progress} %` });
                    }
                });
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlink(downloadLocation, () => reject(err));
            });
        });
    });
}
exports.downloadFileWithProgressBar = downloadFileWithProgressBar;
const calculateChecksum = (filePath, algorithm = 'sha256') => __awaiter(void 0, void 0, void 0, function* () {
    const hash = crypto.createHash(algorithm);
    const pipeline = (0, util_1.promisify)(require('stream').pipeline);
    const readStream = fs.createReadStream(filePath);
    yield pipeline(readStream, hash);
    const checksum = hash.digest('hex');
    return checksum;
});
exports.calculateChecksum = calculateChecksum;
//# sourceMappingURL=utils.js.map