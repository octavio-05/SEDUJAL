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
exports.createViews = void 0;
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
const runConfiguration_1 = require("./runConfiguration");
const commands_1 = require("../commands/commands");
const handlers_1 = require("../configurations/handlers");
const configuration_1 = require("../configurations/configuration");
const utils_1 = require("../utils");
const TestViewController_1 = require("./TestViewController");
const globalState_1 = require("../globalState");
function createViews() {
    return __awaiter(this, void 0, void 0, function* () {
        const context = globalState_1.globalState.getExtensionContextInfo().getExtensionContext();
        createRunConfigurationView(context);
        const client = yield globalState_1.globalState.getClientPromise().client;
        createProjectView(client);
        globalState_1.globalState.setTestAdapter(new TestViewController_1.NbTestAdapter());
    });
}
exports.createViews = createViews;
function createRunConfigurationView(context) {
    (0, utils_1.initializeRunConfiguration)().then(initialized => {
        if (initialized) {
            context.subscriptions.push(vscode_1.window.registerTreeDataProvider('run-config', runConfiguration_1.runConfigurationNodeProvider));
            vscode_1.commands.executeCommand(commands_1.builtInCommands.setCustomContext, 'runConfigurationInitialized', true);
        }
    });
}
function createProjectView(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const ts = client.findTreeViewService();
        let tv = yield ts.createView('foundProjects', 'Projects', { canSelectMany: false });
        function revealActiveEditor(ed) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                const uri = (_b = (_a = vscode_1.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.uri;
                if (!uri || uri.scheme.toLowerCase() !== 'file') {
                    return;
                }
                if (!tv.visible) {
                    return;
                }
                let vis = yield ts.findPath(tv, uri.toString());
                if (!vis) {
                    return;
                }
                tv.reveal(vis, { select: true, focus: false, expand: false });
            });
        }
        globalState_1.globalState.getExtensionContextInfo().pushSubscription(vscode_1.window.onDidChangeActiveTextEditor(ed => {
            if ((0, handlers_1.getConfigurationValue)(configuration_1.configKeys.revealInActivteProj)) {
                revealActiveEditor(ed);
            }
        }));
        globalState_1.globalState.getExtensionContextInfo().pushSubscription(vscode_1.commands.registerCommand(commands_1.extCommands.selectEditorProjs, () => revealActiveEditor()));
        // attempt to reveal NOW:
        if ((0, handlers_1.getConfigurationValue)(configuration_1.configKeys.revealInActivteProj)) {
            revealActiveEditor();
        }
    });
}
//# sourceMappingURL=initializer.js.map