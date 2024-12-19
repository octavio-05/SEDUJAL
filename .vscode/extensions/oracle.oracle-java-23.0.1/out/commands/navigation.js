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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNavigationCommands = void 0;
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
const path = require("path");
const logger_1 = require("../logger");
const utils_1 = require("./utils");
const globalState_1 = require("../globalState");
const goToTest = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    var _b, _c, _d;
    let client = yield globalState_1.globalState.getClientPromise().client;
    if (yield (0, utils_1.isNbCommandRegistered)(commands_1.nbCommands.goToTest)) {
        try {
            const res = yield vscode_1.commands.executeCommand(commands_1.nbCommands.goToTest, (_b = (0, utils_1.getContextUri)(ctx)) === null || _b === void 0 ? void 0 : _b.toString());
            if ("errorMessage" in res) {
                throw new Error(res.errorMessage);
            }
            (_c = res === null || res === void 0 ? void 0 : res.providerErrors) === null || _c === void 0 ? void 0 : _c.map((error) => {
                if (error === null || error === void 0 ? void 0 : error.message) {
                    vscode_1.window.showErrorMessage(error.message);
                }
            });
            if ((_d = res === null || res === void 0 ? void 0 : res.locations) === null || _d === void 0 ? void 0 : _d.length) {
                if (res.locations.length === 1) {
                    const { file, offset } = res.locations[0];
                    const filePath = vscode_1.Uri.parse(file);
                    const editor = yield vscode_1.window.showTextDocument(filePath, { preview: false });
                    if (offset != -1) {
                        const pos = editor.document.positionAt(offset);
                        editor.selections = [new vscode_1.Selection(pos, pos)];
                        const range = new vscode_1.Range(pos, pos);
                        editor.revealRange(range);
                    }
                }
                else {
                    const namePathMapping = {};
                    res.locations.forEach((fp) => {
                        const fileName = path.basename(fp.file);
                        namePathMapping[fileName] = fp.file;
                    });
                    const selected = yield vscode_1.window.showQuickPick(Object.keys(namePathMapping), {
                        title: localiser_1.l10n.value("jdk.extension.fileSelector.label.selectFiles"),
                        placeHolder: localiser_1.l10n.value("jdk.extension.fileSelector.label.testFilesOrSourceFiles"),
                        canPickMany: true
                    });
                    if (selected) {
                        try {
                            for (var selected_1 = __asyncValues(selected), selected_1_1; selected_1_1 = yield selected_1.next(), !selected_1_1.done;) {
                                const filePath = selected_1_1.value;
                                let file = vscode_1.Uri.parse(filePath);
                                yield vscode_1.window.showTextDocument(file, { preview: false });
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (selected_1_1 && !selected_1_1.done && (_a = selected_1.return)) yield _a.call(selected_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    else {
                        vscode_1.window.showInformationMessage(localiser_1.l10n.value("jdk.extension.fileSelector.label.noFileSelected"));
                    }
                }
            }
        }
        catch (err) {
            vscode_1.window.showInformationMessage((err === null || err === void 0 ? void 0 : err.message) || localiser_1.l10n.value("jdk.extension.fileSelector.label.noTestFound"));
        }
    }
    else {
        throw localiser_1.l10n.value("jdk.extension.error_msg.doesntSupportGoToTest", { client });
    }
});
const openTypeHandler = () => {
    (0, utils_1.wrapCommandWithProgress)(commands_1.nbCommands.quickOpen, localiser_1.l10n.value('jdk.extension.command.progress.quickOpen'), logger_1.LOGGER.getOutputChannel()).then(() => {
        vscode_1.commands.executeCommand(commands_1.builtInCommands.focusActiveEditorGroup);
    });
};
const openStackHandler = (uri, methodName, fileName, line) => __awaiter(void 0, void 0, void 0, function* () {
    const location = uri ? yield vscode_1.commands.executeCommand(commands_1.nbCommands.resolveStackLocation, uri, methodName, fileName) : undefined;
    if (location) {
        const lNum = line - 1;
        vscode_1.window.showTextDocument(vscode_1.Uri.parse(location), { selection: new vscode_1.Range(new vscode_1.Position(lNum, 0), new vscode_1.Position(lNum, 0)) });
    }
    else {
        if (methodName) {
            const fqn = methodName.substring(0, methodName.lastIndexOf('.'));
            yield vscode_1.commands.executeCommand(commands_1.builtInCommands.quickAccess, '#' + fqn.substring(fqn.lastIndexOf('.') + 1));
        }
    }
});
exports.registerNavigationCommands = [
    {
        command: commands_1.extCommands.openTest,
        handler: goToTest
    }, {
        command: commands_1.extCommands.openType,
        handler: openTypeHandler
    }, {
        command: commands_1.extCommands.openStackTrace,
        handler: openStackHandler
    }
];
//# sourceMappingURL=navigation.js.map