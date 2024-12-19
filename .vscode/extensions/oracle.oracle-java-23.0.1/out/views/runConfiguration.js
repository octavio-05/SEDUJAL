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
exports.runConfigurationUpdateAll = exports.configureRunSettings = exports.workingDirectoryNode = exports.environmentVariablesNode = exports.vmOptionsNode = exports.argumentsNode = exports.runConfigurationNodeProvider = void 0;
/* This file has been modified for Oracle Java SE extension */
const vscode = require("vscode");
const os_1 = require("os");
const localiser_1 = require("../localiser");
const handlers_1 = require("../configurations/handlers");
const configuration_1 = require("../configurations/configuration");
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
            return [exports.argumentsNode, exports.vmOptionsNode, exports.environmentVariablesNode, exports.workingDirectoryNode];
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
        this.value = (0, handlers_1.getConfigurationValue)(this.settingsKey);
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
        (0, handlers_1.updateConfigurationValue)(this.settingsKey, this.value, vscode.workspace.name || vscode.workspace.workspaceFile ? null : true);
        this.updateNode();
    }
    updateNode(reload) {
        if (reload) {
            this.value = (0, handlers_1.getConfigurationValue)(this.settingsKey);
        }
        this.description = this.value ? this.value : localiser_1.l10n.value("jdk.extension.runConfig.default.label");
        this.tooltip = `${this.label} ${this.description}`;
        exports.runConfigurationNodeProvider.refresh();
    }
}
class ArgumentsNode extends RunConfigurationNode {
    constructor() {
        super(localiser_1.l10n.value("jdk.extension.runConfig.arguments.label"), localiser_1.l10n.value("jdk.extension.runConfig.arguments.prompt"), localiser_1.l10n.value("jdk.extension.runConfig.example.label", { data: "foo bar" }), configuration_1.configKeys.runConfigArguments);
    }
}
exports.argumentsNode = new ArgumentsNode();
class VMOptionsNode extends RunConfigurationNode {
    constructor() {
        super(localiser_1.l10n.value("jdk.extension.runConfig.vmoptions.label"), localiser_1.l10n.value("jdk.extension.runConfig.vmoptions.prompt"), localiser_1.l10n.value("jdk.extension.runConfig.example.label", { data: "-Xmx512m -Xms256m" }), configuration_1.configKeys.runConfigVmOptions);
    }
}
exports.vmOptionsNode = new VMOptionsNode();
class EnvironmentVariablesNode extends RunConfigurationNode {
    constructor() {
        super(localiser_1.l10n.value("jdk.extension.runConfig.env.label"), localiser_1.l10n.value("jdk.extension.runConfig.env.prompt"), localiser_1.l10n.value("jdk.extension.runConfig.example.label", { data: "var1=one, varTwo=2" }), configuration_1.configKeys.runConfigEnv);
    }
}
exports.environmentVariablesNode = new EnvironmentVariablesNode();
class WorkingDirectoryNode extends RunConfigurationNode {
    constructor() {
        super(localiser_1.l10n.value("jdk.extension.runConfig.wrkdir.label"), localiser_1.l10n.value("jdk.extension.runConfig.wrkdir.prompt"), WorkingDirectoryNode.getExample(), configuration_1.configKeys.runConfigCwd);
    }
    static getExample() {
        const dir = (0, os_1.homedir)();
        return localiser_1.l10n.value("jdk.extension.runConfig.example.label", { data: dir });
    }
}
exports.workingDirectoryNode = new WorkingDirectoryNode();
function configureRunSettings(context, ...params) {
    if (params[0][0]) {
        params[0][0].configure(context);
    }
}
exports.configureRunSettings = configureRunSettings;
function runConfigurationUpdateAll() {
    exports.argumentsNode.updateNode(true);
    exports.vmOptionsNode.updateNode(true);
    exports.environmentVariablesNode.updateNode(true);
    exports.workingDirectoryNode.updateNode(true);
}
exports.runConfigurationUpdateAll = runConfigurationUpdateAll;
//# sourceMappingURL=runConfiguration.js.map