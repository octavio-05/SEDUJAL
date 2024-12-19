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
exports.registerDebugCommands = void 0;
const vscode = require("vscode");
const commands_1 = require("./commands");
const constants_1 = require("../constants");
const utils_1 = require("./utils");
const runTest = (uri, methodName, launchConfiguration) => __awaiter(void 0, void 0, void 0, function* () {
    yield runDebug(true, true, uri, methodName, launchConfiguration);
});
const debugTest = (uri, methodName, launchConfiguration) => __awaiter(void 0, void 0, void 0, function* () {
    yield runDebug(false, true, uri, methodName, launchConfiguration);
});
const runSingle = (uri, methodName, launchConfiguration) => __awaiter(void 0, void 0, void 0, function* () {
    yield runDebug(true, false, uri, methodName, launchConfiguration);
});
const debugSingle = (uri, methodName, launchConfiguration) => __awaiter(void 0, void 0, void 0, function* () {
    yield runDebug(false, false, uri, methodName, launchConfiguration);
});
const projectRun = (node, launchConfiguration) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    return runDebug(true, false, ((_a = (0, utils_1.getContextUri)(node)) === null || _a === void 0 ? void 0 : _a.toString()) || '', undefined, launchConfiguration, true);
});
const projectDebug = (node, launchConfiguration) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    return runDebug(false, false, ((_b = (0, utils_1.getContextUri)(node)) === null || _b === void 0 ? void 0 : _b.toString()) || '', undefined, launchConfiguration, true);
});
const projectTest = (node, launchConfiguration) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    return runDebug(true, true, ((_c = (0, utils_1.getContextUri)(node)) === null || _c === void 0 ? void 0 : _c.toString()) || '', undefined, launchConfiguration, true);
});
const packageTest = (uri, launchConfiguration) => __awaiter(void 0, void 0, void 0, function* () {
    yield runDebug(true, true, uri, undefined, launchConfiguration);
});
const runDebug = (noDebug, testRun, uri, methodName, launchConfiguration, project = false) => __awaiter(void 0, void 0, void 0, function* () {
    const docUri = (0, utils_1.getContextUri)(uri);
    if (docUri) {
        // attempt to find the active configuration in the vsode launch settings; undefined if no config is there.
        let debugConfig = (yield findRunConfiguration(docUri)) || {
            type: constants_1.extConstants.COMMAND_PREFIX,
            name: "Java Single Debug",
            request: "launch"
        };
        if (methodName) {
            debugConfig['methodName'] = methodName;
        }
        if (launchConfiguration == '') {
            if (debugConfig['launchConfiguration']) {
                delete debugConfig['launchConfiguration'];
            }
        }
        else {
            debugConfig['launchConfiguration'] = launchConfiguration;
        }
        debugConfig['testRun'] = testRun;
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(docUri);
        if (project) {
            debugConfig['projectFile'] = docUri.toString();
            debugConfig['project'] = true;
        }
        else {
            debugConfig['mainClass'] = docUri.toString();
        }
        const debugOptions = {
            noDebug: noDebug,
        };
        const ret = yield vscode.debug.startDebugging(workspaceFolder, debugConfig, debugOptions);
        return ret ? new Promise((resolve) => {
            const listener = vscode.debug.onDidTerminateDebugSession(() => {
                listener.dispose();
                resolve(true);
            });
        }) : ret;
    }
});
function findRunConfiguration(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        // do not invoke debug start with no (jdk) configurations, as it would probably create an user prompt
        let cfg = vscode.workspace.getConfiguration("launch");
        let c = cfg.get('configurations');
        if (!Array.isArray(c)) {
            return undefined;
        }
        let f = c.filter((v) => v['type'] === constants_1.extConstants.COMMAND_PREFIX);
        if (!f.length) {
            return undefined;
        }
        class P {
            resolveDebugConfigurationWithSubstitutedVariables(folder, debugConfiguration, token) {
                this.config = debugConfiguration;
                return undefined;
            }
        }
        let provider = new P();
        let d = vscode.debug.registerDebugConfigurationProvider(constants_1.extConstants.COMMAND_PREFIX, provider);
        // let vscode to select a debug config
        return yield vscode.commands.executeCommand(commands_1.builtInCommands.startDebug, { config: {
                type: constants_1.extConstants.COMMAND_PREFIX,
                mainClass: uri.toString()
            }, noDebug: true }).then((v) => {
            d.dispose();
            return provider.config;
        }, (err) => {
            d.dispose();
            return undefined;
        });
    });
}
exports.registerDebugCommands = [
    {
        command: commands_1.extCommands.runTest,
        handler: runTest
    }, {
        command: commands_1.extCommands.debugTest,
        handler: debugTest
    }, {
        command: commands_1.extCommands.runSingle,
        handler: runSingle
    }, {
        command: commands_1.extCommands.debugSingle,
        handler: debugSingle
    }, {
        command: commands_1.extCommands.projectRun,
        handler: projectRun
    }, {
        command: commands_1.extCommands.projectDebug,
        handler: projectDebug
    }, {
        command: commands_1.extCommands.projectTest,
        handler: projectTest
    }, {
        command: commands_1.extCommands.packageTest,
        handler: packageTest
    }
];
//# sourceMappingURL=debug.js.map