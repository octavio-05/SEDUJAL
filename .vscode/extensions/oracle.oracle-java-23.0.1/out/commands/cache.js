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
exports.registerCacheCommands = void 0;
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
const fs = require("fs");
const path = require("path");
const globalState_1 = require("../globalState");
const deleteCache = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // TODO: Change workspace path to userdir path
    const storagePath = (_a = globalState_1.globalState.getExtensionContextInfo().getWorkspaceStorage()) === null || _a === void 0 ? void 0 : _a.fsPath;
    if (!storagePath) {
        vscode_1.window.showErrorMessage(localiser_1.l10n.value("jdk.extension.cache.error_msg.cannotFindWrkSpacePath"));
        return;
    }
    const userDir = path.join(storagePath, "userdir");
    if (userDir && fs.existsSync(userDir)) {
        const yes = localiser_1.l10n.value("jdk.extension.cache.label.confirmation.yes");
        const cancel = localiser_1.l10n.value("jdk.extension.cache.label.confirmation.cancel");
        const confirmation = yield vscode_1.window.showInformationMessage(localiser_1.l10n.value("jdk.extension.cache.message.confirmToDeleteCache"), yes, cancel);
        if (confirmation === yes) {
            const reloadWindowActionLabel = localiser_1.l10n.value("jdk.extension.cache.label.reloadWindow");
            try {
                yield globalState_1.globalState.getClientPromise().stopClient();
                globalState_1.globalState.setDeactivated(true);
                yield ((_b = globalState_1.globalState.getNbProcessManager()) === null || _b === void 0 ? void 0 : _b.killProcess(false));
                yield fs.promises.rmdir(userDir, { recursive: true });
                yield vscode_1.window.showInformationMessage(localiser_1.l10n.value("jdk.extension.message.cacheDeleted"), reloadWindowActionLabel);
            }
            catch (err) {
                yield vscode_1.window.showErrorMessage(localiser_1.l10n.value("jdk.extension.error_msg.cacheDeletionError"), reloadWindowActionLabel);
            }
            finally {
                vscode_1.commands.executeCommand(commands_1.builtInCommands.reloadWindow);
            }
        }
    }
    else {
        vscode_1.window.showErrorMessage(localiser_1.l10n.value("jdk.extension.cache.message.noUserDir"));
    }
});
exports.registerCacheCommands = [{
        command: commands_1.extCommands.deleteCache,
        handler: deleteCache
    }];
//# sourceMappingURL=cache.js.map