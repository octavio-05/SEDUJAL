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
exports.isNetbeansVerboseEnabled = exports.isNbJavacDisabledHandler = exports.userdirHandler = exports.isDarkColorThemeHandler = exports.lspServerVmOptionsHandler = exports.projectSearchRootsValueHandler = exports.jdkHomeValueHandler = exports.getBuiltinConfigurationValue = exports.updateConfigurationValue = exports.getConfigurationValue = exports.getConfiguration = void 0;
const vscode_1 = require("vscode");
const configuration_1 = require("./configuration");
const constants_1 = require("../constants");
const os = require("os");
const logger_1 = require("../logger");
const path = require("path");
const fs = require("fs");
const globalState_1 = require("../globalState");
const getConfiguration = (key = constants_1.extConstants.COMMAND_PREFIX) => {
    return vscode_1.workspace.getConfiguration(key);
};
exports.getConfiguration = getConfiguration;
const getConfigurationValue = (key, defaultValue = undefined) => {
    const conf = (0, exports.getConfiguration)();
    return defaultValue != undefined ? conf.get(key, defaultValue) : conf.get(key);
};
exports.getConfigurationValue = getConfigurationValue;
const updateConfigurationValue = (key, newValue, configurationTarget = null) => {
    (0, exports.getConfiguration)().update(key, newValue, configurationTarget);
};
exports.updateConfigurationValue = updateConfigurationValue;
const getBuiltinConfigurationValue = (key, defaultValue = undefined) => {
    var _a;
    const splitKey = key.split('.');
    const selector = splitKey === null || splitKey === void 0 ? void 0 : splitKey[0];
    const conf = vscode_1.workspace.getConfiguration(selector);
    const confKey = (_a = splitKey === null || splitKey === void 0 ? void 0 : splitKey.slice(1)) === null || _a === void 0 ? void 0 : _a.join('.');
    return defaultValue != undefined ? conf === null || conf === void 0 ? void 0 : conf.get(confKey, defaultValue) : conf === null || conf === void 0 ? void 0 : conf.get(confKey);
};
exports.getBuiltinConfigurationValue = getBuiltinConfigurationValue;
const jdkHomeValueHandler = () => {
    return (0, exports.getConfigurationValue)(configuration_1.configKeys.jdkHome) ||
        process.env.JDK_HOME ||
        process.env.JAVA_HOME ||
        null;
};
exports.jdkHomeValueHandler = jdkHomeValueHandler;
const projectSearchRootsValueHandler = () => {
    let projectSearchRoots = '';
    const isProjectFolderSearchLimited = !(0, exports.getConfigurationValue)(configuration_1.configKeys.disableProjSearchLimit, false);
    if (isProjectFolderSearchLimited) {
        try {
            projectSearchRoots = os.homedir();
        }
        catch (err) {
            logger_1.LOGGER.error(`Failed to obtain the user home directory due to: ${err}`);
        }
        if (!projectSearchRoots) {
            projectSearchRoots = os.type() === constants_1.NODE_WINDOWS_LABEL ? '%USERPROFILE%' : '$HOME'; // The launcher script may perform the env variable substitution
            logger_1.LOGGER.log(`Using userHomeDir = "${projectSearchRoots}" as the launcher script may perform env var substitution to get its value.`);
        }
        const workspaces = vscode_1.workspace.workspaceFolders;
        if (workspaces) {
            workspaces.forEach(workspace => {
                if (workspace.uri) {
                    try {
                        projectSearchRoots = projectSearchRoots + path.delimiter + path.normalize(workspace.uri.fsPath);
                    }
                    catch (err) {
                        logger_1.LOGGER.log(`Failed to get the workspace path: ${err}`);
                    }
                }
            });
        }
    }
    return projectSearchRoots;
};
exports.projectSearchRootsValueHandler = projectSearchRootsValueHandler;
const lspServerVmOptionsHandler = () => {
    let serverVmOptions = (0, exports.getConfigurationValue)(configuration_1.configKeys.lspVmOptions, []);
    return serverVmOptions.map(el => `-J${el}`);
};
exports.lspServerVmOptionsHandler = lspServerVmOptionsHandler;
const isDarkColorThemeHandler = () => {
    var _a, _b;
    const themeName = (0, exports.getBuiltinConfigurationValue)(configuration_1.builtInConfigKeys.vscodeTheme);
    if (!themeName) {
        return false;
    }
    for (const ext of vscode_1.extensions.all) {
        const themeList = ((_a = ext.packageJSON) === null || _a === void 0 ? void 0 : _a.contributes) && ((_b = ext.packageJSON) === null || _b === void 0 ? void 0 : _b.contributes['themes']);
        if (!themeList) {
            continue;
        }
        let t;
        for (t of themeList) {
            if (t.id !== themeName) {
                continue;
            }
            const uiTheme = t.uiTheme;
            if (typeof (uiTheme) == 'string') {
                if (uiTheme.includes('-dark') || uiTheme.includes('-black')) {
                    return true;
                }
            }
        }
    }
    return false;
};
exports.isDarkColorThemeHandler = isDarkColorThemeHandler;
const userdirHandler = () => {
    var _a;
    const extensionContextInfo = globalState_1.globalState.getExtensionContextInfo();
    const userdirScope = process.env['nbcode_userdir'] || (0, exports.getConfigurationValue)(configuration_1.configKeys.userdir, "local");
    const workspaceStoragePath = (_a = extensionContextInfo.getWorkspaceStorage()) === null || _a === void 0 ? void 0 : _a.fsPath;
    const userdirParentDir = userdirScope === "local" && workspaceStoragePath
        ? workspaceStoragePath
        : extensionContextInfo.getGlobalStorage().fsPath;
    if (!userdirParentDir) {
        throw new Error(`Cannot create path for ${userdirScope} directory.`);
    }
    const userdir = path.join(userdirParentDir, "userdir");
    try {
        if (!fs.existsSync(userdir)) {
            fs.mkdirSync(userdir, { recursive: true });
            const stats = fs.statSync(userdir);
            if (!stats.isDirectory()) {
                throw new Error(`${userdir} is not a directory`);
            }
        }
        return userdir;
    }
    catch (error) {
        throw new Error(`Failed to create or access ${userdir}: ${error.message}`);
    }
};
exports.userdirHandler = userdirHandler;
const isNbJavacDisabledHandler = () => {
    return (0, exports.getConfigurationValue)(configuration_1.configKeys.disableNbJavac, false);
};
exports.isNbJavacDisabledHandler = isNbJavacDisabledHandler;
const isNetbeansVerboseEnabled = () => {
    return (0, exports.getConfigurationValue)(configuration_1.configKeys.verbose, false);
};
exports.isNetbeansVerboseEnabled = isNetbeansVerboseEnabled;
//# sourceMappingURL=handlers.js.map