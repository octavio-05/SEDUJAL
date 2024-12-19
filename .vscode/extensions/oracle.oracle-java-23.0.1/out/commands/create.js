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
exports.registerCreateCommands = void 0;
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
const os = require("os");
const fs = require("fs");
const utils_1 = require("./utils");
const utils_2 = require("../utils");
const globalState_1 = require("../globalState");
const newFromTemplate = (ctx, template) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const client = yield globalState_1.globalState.getClientPromise().client;
    if (yield (0, utils_1.isNbCommandRegistered)(commands_1.nbCommands.newFromTemplate)) {
        const workspaces = vscode_1.workspace.workspaceFolders;
        if (!workspaces) {
            const userHomeDir = os.homedir();
            const folderPath = yield vscode_1.window.showInputBox({
                prompt: localiser_1.l10n.value('jdk.workspace.new.prompt'),
                value: `${userHomeDir}`
            });
            if (!(folderPath === null || folderPath === void 0 ? void 0 : folderPath.trim()))
                return;
            if (!fs.existsSync(folderPath)) {
                yield fs.promises.mkdir(folderPath);
            }
            const folderPathUri = vscode_1.Uri.file(folderPath);
            yield vscode_1.commands.executeCommand(commands_1.nbCommands.newFromTemplate, folderPathUri.toString());
            yield vscode_1.commands.executeCommand(commands_1.builtInCommands.openFolder, folderPathUri);
            return;
        }
        // first give the template (if present), then the context, and then the open-file hint in the case the context is not specific enough
        const params = [];
        if ((0, utils_2.isString)(template)) {
            params.push(template);
        }
        params.push((_a = (0, utils_1.getContextUri)(ctx)) === null || _a === void 0 ? void 0 : _a.toString(), (_d = (_c = (_b = vscode_1.window.activeTextEditor) === null || _b === void 0 ? void 0 : _b.document) === null || _c === void 0 ? void 0 : _c.uri) === null || _d === void 0 ? void 0 : _d.toString());
        const res = yield vscode_1.commands.executeCommand(commands_1.nbCommands.newFromTemplate, ...params);
        if ((0, utils_2.isString)(res)) {
            let newFile = vscode_1.Uri.parse(res);
            yield vscode_1.window.showTextDocument(newFile, { preview: false });
        }
        else if (Array.isArray(res)) {
            for (let r of res) {
                if ((0, utils_2.isString)(r)) {
                    let newFile = vscode_1.Uri.parse(r);
                    yield vscode_1.window.showTextDocument(newFile, { preview: false });
                }
            }
        }
    }
    else {
        throw localiser_1.l10n.value("jdk.extension.error_msg.doesntSupportNewTeamplate", { client });
    }
});
const newProject = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const client = yield globalState_1.globalState.getClientPromise().client;
    if (yield (0, utils_1.isNbCommandRegistered)(commands_1.nbCommands.newProject)) {
        const res = yield vscode_1.commands.executeCommand(commands_1.nbCommands.newProject, (_e = (0, utils_1.getContextUri)(ctx)) === null || _e === void 0 ? void 0 : _e.toString());
        if ((0, utils_2.isString)(res)) {
            let newProject = vscode_1.Uri.parse(res);
            const OPEN_IN_NEW_WINDOW = localiser_1.l10n.value("jdk.extension.label.openInNewWindow");
            const ADD_TO_CURRENT_WORKSPACE = localiser_1.l10n.value("jdk.extension.label.addToWorkSpace");
            const value = yield vscode_1.window.showInformationMessage(localiser_1.l10n.value("jdk.extension.message.newProjectCreated"), OPEN_IN_NEW_WINDOW, ADD_TO_CURRENT_WORKSPACE);
            if (value === OPEN_IN_NEW_WINDOW) {
                yield vscode_1.commands.executeCommand(commands_1.builtInCommands.openFolder, newProject, true);
            }
            else if (value === ADD_TO_CURRENT_WORKSPACE) {
                vscode_1.workspace.updateWorkspaceFolders(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders.length : 0, undefined, { uri: newProject });
            }
        }
    }
    else {
        throw localiser_1.l10n.value("jdk.extension.error_msg.doesntSupportNewProject", { client });
    }
});
exports.registerCreateCommands = [
    {
        command: commands_1.extCommands.newFromTemplate,
        handler: newFromTemplate
    }, {
        command: commands_1.extCommands.newProject,
        handler: newProject
    }
];
//# sourceMappingURL=create.js.map