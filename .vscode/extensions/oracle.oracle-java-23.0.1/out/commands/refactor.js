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
exports.registerRefactorCommands = void 0;
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
const constants_1 = require("../constants");
const commands_1 = require("./commands");
const localiser_1 = require("../localiser");
const globalState_1 = require("../globalState");
const goToSuperImplementationHandler = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = vscode_1.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.languageId) !== constants_1.extConstants.LANGUAGE_ID) {
        return;
    }
    const uri = vscode_1.window.activeTextEditor.document.uri;
    const position = vscode_1.window.activeTextEditor.selection.active;
    const locations = (yield vscode_1.commands.executeCommand(commands_1.nbCommands.superImpl, uri.toString(), position)) || [];
    return vscode_1.commands.executeCommand(commands_1.builtInCommands.goToEditorLocations, vscode_1.window.activeTextEditor.document.uri, position, locations.map(location => new vscode_1.Location(vscode_1.Uri.parse(location.uri), new vscode_1.Range(location.range.start.line, location.range.start.character, location.range.end.line, location.range.end.character))), 'peek', localiser_1.l10n.value('jdk.extension.error_msg.noSuperImpl'));
});
const renameElementHandler = (offset) => __awaiter(void 0, void 0, void 0, function* () {
    const editor = vscode_1.window.activeTextEditor;
    if (editor) {
        yield vscode_1.commands.executeCommand(commands_1.builtInCommands.renameSymbol, [
            editor.document.uri,
            editor.document.positionAt(offset),
        ]);
    }
});
const surroundWithHandler = (items) => __awaiter(void 0, void 0, void 0, function* () {
    const selected = yield vscode_1.window.showQuickPick(items, { placeHolder: localiser_1.l10n.value('jdk.extension.command.quickPick.placeholder.surroundWith') });
    if (selected) {
        if (selected.userData.edit) {
            const client = yield globalState_1.globalState.getClientPromise().client;
            const edit = yield client.protocol2CodeConverter.asWorkspaceEdit(selected.userData.edit);
            yield vscode_1.workspace.applyEdit(edit);
            yield vscode_1.commands.executeCommand(commands_1.builtInCommands.focusActiveEditorGroup);
        }
        yield vscode_1.commands.executeCommand(selected.userData.command.command, ...(selected.userData.command.arguments || []));
    }
});
const codeGenerateHandler = (command, data) => __awaiter(void 0, void 0, void 0, function* () {
    const edit = yield vscode_1.commands.executeCommand(command, data);
    if (edit) {
        const client = yield globalState_1.globalState.getClientPromise().client;
        const wsEdit = yield client.protocol2CodeConverter.asWorkspaceEdit(edit);
        yield vscode_1.workspace.applyEdit(wsEdit);
        yield vscode_1.commands.executeCommand(commands_1.builtInCommands.focusActiveEditorGroup);
    }
});
const completeAbstractMethodsHandler = () => __awaiter(void 0, void 0, void 0, function* () {
    const active = vscode_1.window.activeTextEditor;
    if (active) {
        const position = new vscode_1.Position(active.selection.start.line, active.selection.start.character);
        yield vscode_1.commands.executeCommand(commands_1.nbCommands.implementAbstractMethods, active.document.uri.toString(), position);
    }
});
const workspaceSymbolsHandler = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const client = yield globalState_1.globalState.getClientPromise().client;
    return (_b = (yield client.sendRequest("workspace/symbol", { "query": query }))) !== null && _b !== void 0 ? _b : [];
});
exports.registerRefactorCommands = [
    {
        command: commands_1.extCommands.goToSuperImpl,
        handler: goToSuperImplementationHandler
    }, {
        command: commands_1.extCommands.renameElement,
        handler: renameElementHandler
    }, {
        command: commands_1.extCommands.surroundWith,
        handler: surroundWithHandler
    }, {
        command: commands_1.extCommands.generateCode,
        handler: codeGenerateHandler
    }, {
        command: commands_1.extCommands.abstractMethodsComplete,
        handler: completeAbstractMethodsHandler
    }, {
        command: commands_1.extCommands.workspaceSymbols,
        handler: workspaceSymbolsHandler
    }
];
//# sourceMappingURL=refactor.js.map