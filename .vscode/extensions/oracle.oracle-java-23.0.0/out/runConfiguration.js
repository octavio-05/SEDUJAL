"use strict";
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
exports.runConfigurationUpdateAll = exports.configureRunSettings = exports.runConfigurationNodeProvider = exports.runConfigurationProvider = exports.initializeRunConfiguration = void 0;
/* This file has been modified for Oracle Java SE extension */
const vscode = require("vscode");
const os_1 = require("os");
const localiser_1 = require("./localiser");
function initializeRunConfiguration() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (vscode.workspace.name || vscode.workspace.workspaceFile) {
            const java = yield vscode.workspace.findFiles('**/*.java', '**/node_modules/**', 1);
            if ((java === null || java === void 0 ? void 0 : java.length) > 0) {
                return true;
            }
        }
        else {
            for (let doc of vscode.workspace.textDocuments) {
                if ((_a = doc.fileName) === null || _a === void 0 ? void 0 : _a.endsWith(".java")) {
                    return true;
                }
            }
        }
        return false;
    });
}
exports.initializeRunConfiguration = initializeRunConfiguration;
class RunConfigurationProvider {
    resolveDebugConfiguration(_folder, config, _token) {
        return new Promise(resolve => {
            resolve(config);
        });
    }
    resolveDebugConfigurationWithSubstitutedVariables(_folder, config, _token) {
        return new Promise(resolve => {
            const args = argumentsNode.getValue();
            if (args) {
                if (!config.args) {
                    config.args = args;
                }
                else {
                    config.args = `${config.args} ${args}`;
                }
            }
            const vmArgs = vmOptionsNode.getValue();
            if (vmArgs) {
                if (!config.vmArgs) {
                    config.vmArgs = vmArgs;
                }
                else {
                    config.vmArgs = `${config.vmArgs} ${vmArgs}`;
                }
            }
            const env = environmentVariablesNode.getValue();
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
            const cwd = workingDirectoryNode.getValue();
            if (cwd) {
                config.cwd = cwd;
            }
            resolve(config);
        });
    }
}
exports.runConfigurationProvider = new RunConfigurationProvider();
class RunConfigurationNodeProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return [argumentsNode, vmOptionsNode, environmentVariablesNode, workingDirectoryNode];
        }
        return [];
    }
}
exports.runConfigurationNodeProvider = new RunConfigurationNodeProvider();
class RunConfigurationNode extends vscode.TreeItem {
    constructor(label, prompt, hint, settingsKey) {
        super(label);
        this.contextValue = 'configureRunSettings';
        this.collapsibleState = vscode.TreeItemCollapsibleState.None;
        this.prompt = prompt;
        this.hint = hint;
        this.settingsKey = settingsKey;
        this.value = this.getConfig().get(this.settingsKey);
        this.updateNode();
    }
    configure(_context) {
        vscode.window.showInputBox({
            prompt: this.prompt,
            value: this.value,
            placeHolder: this.hint,
            ignoreFocusOut: true
        }).then((val) => __awaiter(this, void 0, void 0, function* () {
            if (val !== undefined) {
                const value = val.toString().trim();
                this.setValue(value ? value : undefined);
            }
        }));
    }
    getValue() {
        return this.value;
    }
    setValue(value) {
        this.value = value;
        this.getConfig().update(this.settingsKey, this.value, vscode.workspace.name || vscode.workspace.workspaceFile ? null : true);
        this.updateNode();
    }
    updateNode(reload) {
        if (reload) {
            this.value = this.getConfig().get(this.settingsKey);
        }
        this.description = this.value ? this.value : localiser_1.l10n.value("jdk.extension.runConfig.default.label");
        this.tooltip = `${this.label} ${this.description}`;
        exports.runConfigurationNodeProvider.refresh();
    }
    getConfig() {
        return vscode.workspace.getConfiguration('jdk.runConfig');
    }
}
class ArgumentsNode extends RunConfigurationNode {
    constructor() {
        super(localiser_1.l10n.value("jdk.extension.runConfig.arguments.label"), localiser_1.l10n.value("jdk.extension.runConfig.arguments.prompt"), localiser_1.l10n.value("jdk.extension.runConfig.example.label", { data: "foo bar" }), 'arguments');
    }
}
const argumentsNode = new ArgumentsNode();
class VMOptionsNode extends RunConfigurationNode {
    constructor() {
        super(localiser_1.l10n.value("jdk.extension.runConfig.vmoptions.label"), localiser_1.l10n.value("jdk.extension.runConfig.vmoptions.prompt"), localiser_1.l10n.value("jdk.extension.runConfig.example.label", { data: "-Xmx512m -Xms256m" }), 'vmOptions');
    }
}
const vmOptionsNode = new VMOptionsNode();
class EnvironmentVariablesNode extends RunConfigurationNode {
    constructor() {
        super(localiser_1.l10n.value("jdk.extension.runConfig.env.label"), localiser_1.l10n.value("jdk.extension.runConfig.env.prompt"), localiser_1.l10n.value("jdk.extension.runConfig.example.label", { data: "var1=one, varTwo=2" }), 'env');
    }
}
const environmentVariablesNode = new EnvironmentVariablesNode();
class WorkingDirectoryNode extends RunConfigurationNode {
    constructor() {
        super(localiser_1.l10n.value("jdk.extension.runConfig.wrkdir.label"), localiser_1.l10n.value("jdk.extension.runConfig.wrkdir.prompt"), WorkingDirectoryNode.getExample(), 'cwd');
    }
    static getExample() {
        const dir = (0, os_1.homedir)();
        return localiser_1.l10n.value("jdk.extension.runConfig.example.label", { data: dir });
    }
}
const workingDirectoryNode = new WorkingDirectoryNode();
function configureRunSettings(context, ...params) {
    if (params[0][0]) {
        params[0][0].configure(context);
    }
}
exports.configureRunSettings = configureRunSettings;
function runConfigurationUpdateAll() {
    argumentsNode.updateNode(true);
    vmOptionsNode.updateNode(true);
    environmentVariablesNode.updateNode(true);
    workingDirectoryNode.updateNode(true);
}
exports.runConfigurationUpdateAll = runConfigurationUpdateAll;
//# sourceMappingURL=runConfiguration.js.map