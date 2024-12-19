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
exports.registerCompletion = exports.updateLaunchConfig = void 0;
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
const jsoncp = require("jsonc-parser");
const fs = require("fs");
const extension_1 = require("./extension");
const localiser_1 = require("./localiser");
function updateLaunchConfig() {
    vscode_1.workspace.findFiles('.vscode/launch.json').then((files) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        let selection = undefined;
        for (const file of files) {
            let edits = [];
            const content = fs.readFileSync(file.fsPath, 'utf8');
            const root = jsoncp.parseTree(content);
            (_a = root === null || root === void 0 ? void 0 : root.children) === null || _a === void 0 ? void 0 : _a.forEach(rch => {
                var _a, _b;
                if (rch.type === 'property' && ((_a = rch.children) === null || _a === void 0 ? void 0 : _a.length) === 2) {
                    const name = rch.children[0].type === 'string' ? rch.children[0].value : undefined;
                    if (name === 'configurations' && rch.children[1].type === 'array') {
                        (_b = rch.children[1].children) === null || _b === void 0 ? void 0 : _b.forEach(config => {
                            var _a;
                            if (config.type === 'object') {
                                (_a = config.children) === null || _a === void 0 ? void 0 : _a.forEach(cch => {
                                    var _a;
                                    if (cch.type === 'property' && ((_a = cch.children) === null || _a === void 0 ? void 0 : _a.length) === 2) {
                                        const cname = cch.children[0].type === 'string' ? cch.children[0].value : undefined;
                                        if (cname === 'type' && cch.children[1].type === 'string' && cch.children[1].value === 'java8+') {
                                            const path = jsoncp.getNodePath(cch.children[1]);
                                            if (path) {
                                                edits = edits.concat(jsoncp.modify(content, path, 'jdk', {}));
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
            const newContent = jsoncp.applyEdits(content, edits);
            const updateOption = localiser_1.l10n.value("jdk.extension.runConfig.label.updateExistingLaunchJson");
            if (newContent !== content) {
                if (!selection) {
                    selection = yield vscode_1.window.showWarningMessage(localiser_1.l10n.value("jdk.extension.runConfig.warning_message.renamedDebugConfig"), updateOption);
                }
                if (selection === updateOption) {
                    fs.writeFileSync(file.fsPath, newContent);
                }
                else {
                    return;
                }
            }
        }
        ;
    }));
}
exports.updateLaunchConfig = updateLaunchConfig;
function registerCompletion(context) {
    context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider({ language: 'jsonc', pattern: '**/launch.json' }, {
        provideCompletionItems(document, position, cancelToken) {
            var _a, _b;
            const sourceText = document.getText();
            const root = jsoncp.parseTree(sourceText);
            if (root) {
                const offset = document.offsetAt(position);
                const currentNode = jsoncp.findNodeAtOffset(root, offset);
                if (currentNode) {
                    const path = jsoncp.getNodePath(currentNode);
                    if (path.length >= 1 && 'configurations' == path[0]) {
                        const uri = document.uri.toString();
                        let completionItems;
                        if (path.length == 1) {
                            // Get all configurations:
                            completionItems = vscode_1.commands.executeCommand(extension_1.COMMAND_PREFIX + '.project.configuration.completion', uri);
                        }
                        else {
                            let node = currentNode;
                            if (currentNode.type == 'property' && currentNode.parent) {
                                let propName = (_b = (_a = currentNode.children) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
                                if (!propName) { // Invalid node?
                                    return new vscode_1.CompletionList();
                                }
                                node = currentNode.parent;
                                let attributesMap = getAttributes(node);
                                // Get possible values of property 'propName':
                                completionItems = vscode_1.commands.executeCommand(extension_1.COMMAND_PREFIX + '.project.configuration.completion', uri, attributesMap, propName);
                            }
                            else {
                                let attributesMap = getAttributes(node);
                                // Get additional possible attributes:
                                completionItems = vscode_1.commands.executeCommand(extension_1.COMMAND_PREFIX + '.project.configuration.completion', uri, attributesMap);
                            }
                        }
                        return completionItems.then(itemsList => {
                            let items = itemsList.items;
                            if (!items) {
                                items = itemsList;
                            }
                            addCommas(sourceText, offset, items);
                            return new vscode_1.CompletionList(items);
                        });
                    }
                }
            }
        }
    }));
}
exports.registerCompletion = registerCompletion;
function getAttributes(node) {
    let attributes = {};
    if (node.children) {
        for (let index in node.children) {
            let ch = node.children[index];
            let prop = ch.children;
            if (prop) {
                attributes[prop[0].value] = prop[1].value;
            }
        }
    }
    return attributes;
}
function addCommas(sourceText, offset, completionItems) {
    if (!completionItems) {
        return;
    }
    let prepend = false;
    let o = offset - 1;
    while (o >= 0) {
        let c = sourceText.charAt(o);
        if (!/\s/.test(c)) {
            prepend = c != '[' && c != '{' && c != ',' && c != ':';
            break;
        }
        o--;
    }
    let append = false;
    o = offset + 1;
    while (o < sourceText.length) {
        let c = sourceText.charAt(o);
        if (!/\s/.test(c)) {
            append = c != ']' && c != '}' && c != ',';
            break;
        }
        o++;
    }
    for (let index in completionItems) {
        let ci = completionItems[index];
        if (ci.insertText) {
            if (ci.insertTextFormat === vscode_languageclient_1.InsertTextFormat.Snippet) {
                let snippet = new vscode_1.SnippetString(ci.insertText);
                ci.insertText = snippet;
                if (prepend) {
                    snippet.value = ',' + snippet.value;
                }
                if (append) {
                    snippet.value = snippet.value + ',';
                }
            }
            else {
                if (prepend) {
                    ci.insertText = ',' + ci.insertText;
                }
                if (append) {
                    ci.insertText = ci.insertText + ',';
                }
            }
        }
        if (ci.kind) {
            ci.kind--; // Note difference between vscode's CompletionItemKind and lsp's CompletionItemKind
        }
    }
}
//# sourceMappingURL=launchConfigurations.js.map