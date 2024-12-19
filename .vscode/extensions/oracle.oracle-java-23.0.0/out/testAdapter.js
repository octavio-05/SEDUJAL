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
/* This file has been modified for Oracle Java SE extension */
'use strict';
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
exports.NbTestAdapter = void 0;
const vscode_1 = require("vscode");
const path = require("path");
const protocol_1 = require("./protocol");
const extension_1 = require("./extension");
class NbTestAdapter {
    constructor() {
        this.disposables = [];
        this.started = false;
        this.testController = vscode_1.tests.createTestController('apacheNetBeansController', 'Apache NetBeans');
        const runHandler = (request, cancellation) => this.run(request, cancellation);
        this.testController.createRunProfile('Run Tests', vscode_1.TestRunProfileKind.Run, runHandler);
        this.testController.createRunProfile('Debug Tests', vscode_1.TestRunProfileKind.Debug, runHandler);
        this.disposables.push(this.testController);
        this.load();
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let workspaceFolder of vscode_1.workspace.workspaceFolders || []) {
                const loadedTests = yield vscode_1.commands.executeCommand(extension_1.COMMAND_PREFIX + '.load.workspace.tests', workspaceFolder.uri.toString());
                if (loadedTests) {
                    loadedTests.forEach((suite) => {
                        this.updateTests(suite);
                    });
                }
            }
        });
    }
    run(request, cancellation) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.currentRun) {
                vscode_1.commands.executeCommand('workbench.debug.action.focusRepl');
                cancellation.onCancellationRequested(() => this.cancel());
                this.currentRun = this.testController.createTestRun(request);
                this.itemsToRun = new Set();
                this.started = false;
                if (request.include) {
                    const include = [...new Map(request.include.map(item => { var _a; return !item.uri && ((_a = item.parent) === null || _a === void 0 ? void 0 : _a.uri) ? [item.parent.id, item.parent] : [item.id, item]; })).values()];
                    for (let item of include) {
                        if (item.uri) {
                            this.set(item, 'enqueued');
                            const idx = item.id.indexOf(':');
                            if (!cancellation.isCancellationRequested) {
                                yield vscode_1.commands.executeCommand(((_a = request.profile) === null || _a === void 0 ? void 0 : _a.kind) === vscode_1.TestRunProfileKind.Debug ? extension_1.COMMAND_PREFIX + '.debug.single' : extension_1.COMMAND_PREFIX + '.run.single', item.uri.toString(), idx < 0 ? undefined : item.id.slice(idx + 1));
                            }
                        }
                    }
                }
                else {
                    this.testController.items.forEach(item => this.set(item, 'enqueued'));
                    for (let workspaceFolder of vscode_1.workspace.workspaceFolders || []) {
                        if (!cancellation.isCancellationRequested) {
                            yield vscode_1.commands.executeCommand(((_b = request.profile) === null || _b === void 0 ? void 0 : _b.kind) === vscode_1.TestRunProfileKind.Debug ? extension_1.COMMAND_PREFIX + '.debug.test' : extension_1.COMMAND_PREFIX + '.run.test', workspaceFolder.uri.toString());
                        }
                    }
                }
                if (this.started) {
                    this.itemsToRun.forEach(item => this.set(item, 'skipped'));
                }
                this.itemsToRun = undefined;
                this.currentRun.end();
                this.currentRun = undefined;
            }
        });
    }
    set(item, state, message, noPassDown) {
        var _a, _b, _c;
        if (this.currentRun) {
            switch (state) {
                case 'enqueued':
                    (_a = this.itemsToRun) === null || _a === void 0 ? void 0 : _a.add(item);
                    this.currentRun.enqueued(item);
                    break;
                case 'started':
                case 'passed':
                case 'skipped':
                    (_b = this.itemsToRun) === null || _b === void 0 ? void 0 : _b.delete(item);
                    this.currentRun[state](item);
                    break;
                case 'failed':
                case 'errored':
                    (_c = this.itemsToRun) === null || _c === void 0 ? void 0 : _c.delete(item);
                    this.currentRun[state](item, message || new vscode_1.TestMessage(""));
                    break;
            }
            if (!noPassDown) {
                item.children.forEach(child => this.set(child, state, message, noPassDown));
            }
        }
    }
    cancel() {
        vscode_1.debug.stopDebugging();
    }
    dispose() {
        this.cancel();
        for (const disposable of this.disposables) {
            disposable.dispose();
        }
        this.disposables = [];
    }
    testOutput(output) {
        if (this.currentRun && output) {
            this.currentRun.appendOutput(output.replace(/\n/g, '\r\n'));
        }
    }
    testProgress(suite) {
        var _a;
        const currentSuite = this.testController.items.get(suite.name);
        switch (suite.state) {
            case 'loaded':
                this.updateTests(suite);
                break;
            case 'started':
                this.started = true;
                if (currentSuite) {
                    this.set(currentSuite, 'started');
                }
                break;
            case 'passed':
            case "failed":
            case 'errored':
            case 'skipped':
                if (suite.tests) {
                    this.updateTests(suite, true);
                    if (currentSuite) {
                        const suiteMessages = [];
                        (_a = suite.tests) === null || _a === void 0 ? void 0 : _a.forEach(test => {
                            var _a, _b, _c;
                            if (this.currentRun) {
                                let currentTest = currentSuite.children.get(test.id);
                                if (!currentTest) {
                                    currentSuite.children.forEach(item => {
                                        if (!currentTest) {
                                            const subName = this.subTestName(item, test);
                                            if (subName) {
                                                currentTest = subName === '()' ? item : item.children.get(test.id);
                                            }
                                        }
                                    });
                                }
                                let message;
                                if (test.stackTrace) {
                                    message = new vscode_1.TestMessage(this.stacktrace2Message((_a = currentTest === null || currentTest === void 0 ? void 0 : currentTest.uri) === null || _a === void 0 ? void 0 : _a.toString(), test.stackTrace));
                                    if (currentTest) {
                                        const testUri = currentTest.uri || ((_b = currentTest.parent) === null || _b === void 0 ? void 0 : _b.uri);
                                        if (testUri) {
                                            const fileName = path.basename(testUri.path);
                                            const line = test.stackTrace.map(frame => {
                                                const info = frame.match(/^\s*at[^\(]*\((\S*):(\d*)\)$/);
                                                if (info && info.length >= 3 && info[1] === fileName) {
                                                    return parseInt(info[2]);
                                                }
                                                return null;
                                            }).find(l => l);
                                            const pos = line ? new vscode_1.Position(line - 1, 0) : (_c = currentTest.range) === null || _c === void 0 ? void 0 : _c.start;
                                            if (pos) {
                                                message.location = new vscode_1.Location(testUri, pos);
                                            }
                                        }
                                    }
                                    else {
                                        message.location = new vscode_1.Location(currentSuite.uri, currentSuite.range.start);
                                    }
                                }
                                if (currentTest && test.state !== 'loaded') {
                                    this.set(currentTest, test.state, message, true);
                                }
                                else if (test.state !== 'passed' && message) {
                                    suiteMessages.push(message);
                                }
                            }
                        });
                        if (suiteMessages.length > 0) {
                            this.set(currentSuite, 'errored', suiteMessages, true);
                            currentSuite.children.forEach(item => this.set(item, 'skipped'));
                        }
                        else {
                            this.set(currentSuite, suite.state, undefined, true);
                        }
                    }
                }
                break;
        }
    }
    updateTests(suite, testExecution) {
        var _a, _b;
        let currentSuite = this.testController.items.get(suite.name);
        const suiteUri = suite.file ? vscode_1.Uri.parse(suite.file) : undefined;
        if (!currentSuite || suiteUri && ((_a = currentSuite.uri) === null || _a === void 0 ? void 0 : _a.toString()) !== suiteUri.toString()) {
            currentSuite = this.testController.createTestItem(suite.name, suite.name, suiteUri);
            this.testController.items.add(currentSuite);
        }
        const suiteRange = (0, protocol_1.asRange)(suite.range);
        if (!testExecution && suiteRange && suiteRange !== currentSuite.range) {
            currentSuite.range = suiteRange;
        }
        const children = [];
        const parentTests = new Map();
        (_b = suite.tests) === null || _b === void 0 ? void 0 : _b.forEach(test => {
            var _a;
            let currentTest = currentSuite === null || currentSuite === void 0 ? void 0 : currentSuite.children.get(test.id);
            const testUri = test.file ? vscode_1.Uri.parse(test.file) : undefined;
            if (currentTest) {
                if (testUri && ((_a = currentTest.uri) === null || _a === void 0 ? void 0 : _a.toString()) !== (testUri === null || testUri === void 0 ? void 0 : testUri.toString())) {
                    currentTest = this.testController.createTestItem(test.id, test.name, testUri);
                    currentSuite === null || currentSuite === void 0 ? void 0 : currentSuite.children.add(currentTest);
                }
                const testRange = (0, protocol_1.asRange)(test.range);
                if (!testExecution && testRange && testRange !== currentTest.range) {
                    currentTest.range = testRange;
                }
                children.push(currentTest);
            }
            else {
                if (testExecution) {
                    const parents = new Map();
                    currentSuite === null || currentSuite === void 0 ? void 0 : currentSuite.children.forEach(item => {
                        const subName = this.subTestName(item, test);
                        if (subName && '()' !== subName) {
                            parents.set(item, subName);
                        }
                    });
                    const parent = this.selectParent(parents);
                    if (parent) {
                        let arr = parentTests.get(parent.test);
                        if (!arr) {
                            parentTests.set(parent.test, arr = []);
                            children.push(parent.test);
                        }
                        arr.push(this.testController.createTestItem(test.id, parent.label));
                    }
                }
                else {
                    currentTest = this.testController.createTestItem(test.id, test.name, testUri);
                    currentTest.range = (0, protocol_1.asRange)(test.range);
                    children.push(currentTest);
                    currentSuite === null || currentSuite === void 0 ? void 0 : currentSuite.children.add(currentTest);
                }
            }
        });
        if (testExecution) {
            parentTests.forEach((val, key) => {
                const item = this.testController.createTestItem(key.id, key.label, key.uri);
                item.range = key.range;
                item.children.replace(val);
                currentSuite === null || currentSuite === void 0 ? void 0 : currentSuite.children.add(item);
            });
        }
        else {
            currentSuite.children.replace(children);
        }
    }
    subTestName(item, test) {
        if (test.id.startsWith(item.id)) {
            let label = test.name;
            if (label.startsWith(item.label)) {
                label = label.slice(item.label.length).trim();
            }
            return label;
        }
        else {
            const regexp = new RegExp(item.id.replace(/[-[\]{}()*+?.,\\^$|\s]/g, '\\$&').replace(/#\w*/g, '\\S*'));
            if (regexp.test(test.id)) {
                return test.name;
            }
        }
        return undefined;
    }
    selectParent(parents) {
        let ret = undefined;
        parents.forEach((label, parentTest) => {
            if (ret) {
                if (parentTest.id.replace(/#\w*/g, '').length > ret.test.id.replace(/#\w*/g, '').length) {
                    ret = { test: parentTest, label };
                }
            }
            else {
                ret = { test: parentTest, label };
            }
        });
        return ret;
    }
    stacktrace2Message(currentTestUri, stacktrace) {
        const regExp = /(\s*at\s+(?:[\w$\\.]+\/)?((?:[\w$]+\.)+[\w\s$<>]+))\(((.*):(\d+))\)/;
        const message = new vscode_1.MarkdownString();
        message.isTrusted = true;
        message.supportHtml = true;
        for (const line of stacktrace) {
            if (message.value.length) {
                message.appendMarkdown('<br/>');
            }
            const result = regExp.exec(line);
            if (result) {
                message.appendText(result[1]).appendText('(').appendMarkdown(`[${result[3]}](command:${extension_1.COMMAND_PREFIX}.open.stacktrace?${encodeURIComponent(JSON.stringify([currentTestUri, result[2], result[4], +result[5]]))})`).appendText(')');
            }
            else {
                message.appendText(line);
            }
        }
        return message;
    }
}
exports.NbTestAdapter = NbTestAdapter;
//# sourceMappingURL=testAdapter.js.map