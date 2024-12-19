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
exports.registerDebugger = void 0;
const net = require("net");
const vscode = require("vscode");
const vscode_1 = require("vscode");
const constants_1 = require("../constants");
const localiser_1 = require("../localiser");
const streamDebugAdapter_1 = require("./streamDebugAdapter");
const commands_1 = require("../commands/commands");
const runConfiguration_1 = require("../views/runConfiguration");
const utils_1 = require("../utils");
const globalState_1 = require("../globalState");
function registerDebugger(context) {
    let debugTrackerFactory = new NetBeansDebugAdapterTrackerFactory();
    context.subscriptions.push(vscode.debug.registerDebugAdapterTrackerFactory(constants_1.extConstants.COMMAND_PREFIX, debugTrackerFactory));
    let configInitialProvider = new NetBeansConfigurationInitialProvider();
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider(constants_1.extConstants.COMMAND_PREFIX, configInitialProvider, vscode.DebugConfigurationProviderTriggerKind.Initial));
    let configDynamicProvider = new NetBeansConfigurationDynamicProvider(context);
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider(constants_1.extConstants.COMMAND_PREFIX, configDynamicProvider, vscode.DebugConfigurationProviderTriggerKind.Dynamic));
    let configResolver = new NetBeansConfigurationResolver();
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider(constants_1.extConstants.COMMAND_PREFIX, configResolver));
    let debugDescriptionFactory = new NetBeansDebugAdapterDescriptionFactory();
    context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory(constants_1.extConstants.COMMAND_PREFIX, debugDescriptionFactory));
    (0, utils_1.initializeRunConfiguration)().then(initialized => {
        if (initialized) {
            context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider(constants_1.extConstants.COMMAND_PREFIX, new RunConfigurationProvider()));
        }
    });
}
exports.registerDebugger = registerDebugger;
;
class NetBeansDebugAdapterTrackerFactory {
    createDebugAdapterTracker(_session) {
        return {
            onDidSendMessage(message) {
                const testAdapter = globalState_1.globalState.getTestAdapter();
                if (testAdapter && message.type === 'event' && message.event === 'output') {
                    testAdapter.testOutput(message.body.output);
                }
            }
        };
    }
}
class NetBeansDebugAdapterDescriptionFactory {
    createDebugAdapterDescriptor(_session, _executable) {
        return new Promise((resolve, reject) => {
            let cnt = 10;
            const fnc = () => {
                if (globalState_1.globalState.getDebugPort() < 0) {
                    if (cnt-- > 0) {
                        setTimeout(fnc, 1000);
                    }
                    else {
                        reject(new Error(localiser_1.l10n.value('jdk.extension.debugger.error_msg.debugAdapterNotInitialized')));
                    }
                }
                else {
                    // resolve(new vscode.DebugAdapterServer(debugPort));
                    const socket = net.connect(globalState_1.globalState.getDebugPort(), "127.0.0.1", () => { });
                    socket.on("connect", () => {
                        const adapter = new streamDebugAdapter_1.StreamDebugAdapter();
                        socket.write((globalState_1.globalState === null || globalState_1.globalState === void 0 ? void 0 : globalState_1.globalState.getDebugHash()) || "");
                        adapter.connect(socket, socket);
                        resolve(new vscode.DebugAdapterInlineImplementation(adapter));
                    });
                }
            };
            fnc();
        });
    }
}
class NetBeansConfigurationInitialProvider {
    provideDebugConfigurations(folder, token) {
        return this.doProvideDebugConfigurations(folder, token);
    }
    doProvideDebugConfigurations(folder, _token) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let c = yield globalState_1.globalState.getClientPromise().client;
            if (!folder) {
                return [];
            }
            var u;
            if (folder && folder.uri) {
                u = folder.uri;
            }
            else {
                u = (_b = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.uri;
            }
            let result = [];
            const configNames = yield vscode.commands.executeCommand(commands_1.nbCommands.projectConfigurations, u === null || u === void 0 ? void 0 : u.toString());
            if (configNames) {
                let first = true;
                for (let cn of configNames) {
                    let cname;
                    if (first) {
                        // ignore the default config, comes first.
                        first = false;
                        continue;
                    }
                    else {
                        cname = "Launch Java: " + cn;
                    }
                    const debugConfig = {
                        name: cname,
                        type: constants_1.extConstants.COMMAND_PREFIX,
                        request: "launch",
                        launchConfiguration: cn,
                    };
                    result.push(debugConfig);
                }
            }
            return result;
        });
    }
}
class NetBeansConfigurationDynamicProvider {
    constructor(context) {
        this.commandValues = new Map();
        this.context = context;
    }
    provideDebugConfigurations(folder, token) {
        return this.doProvideDebugConfigurations(folder, this.context, this.commandValues, token);
    }
    doProvideDebugConfigurations(folder, context, commandValues, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            let c = yield globalState_1.globalState.getClientPromise().client;
            if (!folder) {
                return [];
            }
            let result = [];
            const attachConnectors = yield vscode.commands.executeCommand(commands_1.extCommands.attachDebuggerConfigurations);
            if (attachConnectors) {
                for (let ac of attachConnectors) {
                    const debugConfig = {
                        name: ac.name,
                        type: ac.type,
                        request: "attach",
                    };
                    for (let i = 0; i < ac.arguments.length; i++) {
                        let defaultValue = ac.defaultValues[i];
                        if (!defaultValue.startsWith("${command:")) {
                            // Create a command that asks for the argument value:
                            let cmd = `${commands_1.extCommands.attachDebuggerConnector}.${ac.id}.${ac.arguments[i]}`;
                            debugConfig[ac.arguments[i]] = "${command:" + cmd + "}";
                            if (!commandValues.has(cmd)) {
                                commandValues.set(cmd, ac.defaultValues[i]);
                                let description = ac.descriptions[i];
                                context.subscriptions.push(vscode_1.commands.registerCommand(cmd, (ctx) => __awaiter(this, void 0, void 0, function* () {
                                    return vscode.window.showInputBox({
                                        prompt: description,
                                        value: commandValues.get(cmd),
                                    }).then((value) => {
                                        if (value) {
                                            commandValues.set(cmd, value);
                                        }
                                        return value;
                                    });
                                })));
                            }
                        }
                        else {
                            debugConfig[ac.arguments[i]] = defaultValue;
                        }
                    }
                    result.push(debugConfig);
                }
            }
            return result;
        });
    }
}
class NetBeansConfigurationResolver {
    resolveDebugConfiguration(_folder, config, _token) {
        if (!config.type) {
            config.type = constants_1.extConstants.COMMAND_PREFIX;
        }
        if (!config.request) {
            config.request = 'launch';
        }
        if (vscode.window.activeTextEditor) {
            config.file = '${file}';
        }
        if (!config.classPaths) {
            config.classPaths = ['any'];
        }
        if (!config.console) {
            config.console = 'internalConsole';
        }
        return config;
    }
}
class RunConfigurationProvider {
    resolveDebugConfiguration(_folder, config, _token) {
        return new Promise(resolve => {
            resolve(config);
        });
    }
    resolveDebugConfigurationWithSubstitutedVariables(_folder, config, _token) {
        return new Promise(resolve => {
            const args = runConfiguration_1.argumentsNode.getValue();
            if (args) {
                if (!config.args) {
                    config.args = args;
                }
                else {
                    config.args = `${config.args} ${args}`;
                }
            }
            const vmArgs = runConfiguration_1.vmOptionsNode.getValue();
            if (vmArgs) {
                if (!config.vmArgs) {
                    config.vmArgs = vmArgs;
                }
                else {
                    config.vmArgs = `${config.vmArgs} ${vmArgs}`;
                }
            }
            const env = runConfiguration_1.environmentVariablesNode.getValue();
            if (env) {
                const envs = env.split(',');
                if (!config.env) {
                    config.env = {};
                }
                for (let val of envs) {
                    val = val.trim();
                    const div = val.indexOf('=');
                    if (div > 0) { // div === 0 means bad format (no ENV name)
                        config.env[val.substring(0, div)] = val.substring(div + 1, val.length);
                    }
                }
            }
            const cwd = runConfiguration_1.workingDirectoryNode.getValue();
            if (cwd) {
                config.cwd = cwd;
            }
            resolve(config);
        });
    }
}
//# sourceMappingURL=debugger.js.map