"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConfigChangeListeners = void 0;
const vscode_1 = require("vscode");
const configuration_1 = require("./configuration");
const globalState_1 = require("../globalState");
const configChangeHandler = (params) => {
    configuration_1.userConfigsListened.forEach((config) => {
        const doesAffect = params.affectsConfiguration(config);
        if (doesAffect) {
            globalState_1.globalState.getClientPromise().restartExtension(globalState_1.globalState.getNbProcessManager(), true);
        }
    });
};
const configChangeListener = vscode_1.workspace.onDidChangeConfiguration(configChangeHandler);
const listeners = [configChangeListener];
const registerConfigChangeListeners = (context) => {
    listeners.forEach((listener) => {
        context.subscriptions.push(listener);
    });
};
exports.registerConfigChangeListeners = registerConfigChangeListeners;
//# sourceMappingURL=listener.js.map