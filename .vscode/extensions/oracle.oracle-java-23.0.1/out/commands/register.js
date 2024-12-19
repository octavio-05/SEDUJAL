"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeCommands = void 0;
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
const create_1 = require("./create");
const cache_1 = require("./cache");
const navigation_1 = require("./navigation");
const webViews_1 = require("./webViews");
const buildOperations_1 = require("./buildOperations");
const refactor_1 = require("./refactor");
const utilCommands_1 = require("./utilCommands");
const debug_1 = require("./debug");
const runConfiguration_1 = require("./runConfiguration");
const commandModules = {
    create: create_1.registerCreateCommands,
    cache: cache_1.registerCacheCommands,
    navigation: navigation_1.registerNavigationCommands,
    webview: webViews_1.registerWebviewCommands,
    buildOperations: buildOperations_1.registerBuildOperationCommands,
    refactor: refactor_1.registerRefactorCommands,
    util: utilCommands_1.registerUtilCommands,
    debug: debug_1.registerDebugCommands,
    runConfiguration: runConfiguration_1.registerRunConfigurationCommands
};
const subscribeCommands = (context) => {
    for (const cmds of Object.values(commandModules)) {
        for (const command of cmds) {
            const cmdRegistered = registerCommand(command);
            if (cmdRegistered) {
                context.subscriptions.push(cmdRegistered);
            }
        }
    }
};
exports.subscribeCommands = subscribeCommands;
const registerCommand = (commandInfo) => {
    const { command, handler } = commandInfo;
    if (command.trim().length && handler) {
        return vscode_1.commands.registerCommand(command, handler);
    }
    return null;
};
//# sourceMappingURL=register.js.map