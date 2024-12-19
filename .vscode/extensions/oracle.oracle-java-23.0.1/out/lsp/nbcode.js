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
exports.attachNbProcessListeners = exports.launchNbcode = void 0;
const vscode_1 = require("vscode");
const configuration_1 = require("../configurations/configuration");
const constants_1 = require("../constants");
const launchOptions_1 = require("./launchOptions");
const nbProcessManager_1 = require("./nbProcessManager");
const utils_1 = require("./utils");
const localiser_1 = require("../localiser");
const prompt_1 = require("../webviews/jdkDownloader/prompt");
const logger_1 = require("../logger");
const os = require("os");
const globalState_1 = require("../globalState");
const launchNbcode = () => {
    const ideLaunchOptions = (0, launchOptions_1.prepareNbcodeLaunchOptions)();
    const userdir = (0, launchOptions_1.getUserConfigLaunchOptionsDefaults)()[configuration_1.configKeys.userdir].value;
    const specifiedJDK = (0, launchOptions_1.getUserConfigLaunchOptionsDefaults)()[configuration_1.configKeys.jdkHome].value;
    const extensionPath = globalState_1.globalState.getExtensionContextInfo().getExtensionStorageUri().fsPath;
    const nbcodePath = (0, utils_1.findNbcode)(extensionPath);
    const requiredJdk = specifiedJDK ? specifiedJDK : 'default system JDK';
    let launchMsg = localiser_1.l10n.value("jdk.extension.lspServer.statusBar.message.launching", {
        SERVER_NAME: constants_1.extConstants.SERVER_NAME,
        requiredJdk: requiredJdk,
        userdir: userdir
    });
    logger_1.LOGGER.log(launchMsg);
    vscode_1.window.setStatusBarMessage(launchMsg, 2000);
    globalState_1.globalState.setNbProcessManager(new nbProcessManager_1.NbProcessManager(userdir, nbcodePath, ideLaunchOptions));
    globalState_1.globalState.getNbProcessManager().startProcess();
};
exports.launchNbcode = launchNbcode;
const attachNbProcessListeners = (nbProcessManager) => {
    var _a, _b;
    const nbProcess = nbProcessManager.getProcess();
    (_a = nbProcess === null || nbProcess === void 0 ? void 0 : nbProcess.stdout) === null || _a === void 0 ? void 0 : _a.on('data', chunk => {
        processOnDataHandler(nbProcessManager, chunk.toString(), true);
    });
    (_b = nbProcess === null || nbProcess === void 0 ? void 0 : nbProcess.stderr) === null || _b === void 0 ? void 0 : _b.on('data', chunk => {
        processOnDataHandler(nbProcessManager, chunk.toString(), false);
    });
    nbProcess === null || nbProcess === void 0 ? void 0 : nbProcess.on('close', (code) => {
        const status = processOnCloseHandler(nbProcessManager, code);
        if (status != null) {
            throw status;
        }
    });
};
exports.attachNbProcessListeners = attachNbProcessListeners;
const processOnDataHandler = (nbProcessManager, text, isOut) => {
    var _a;
    if (nbProcessManager) {
        globalState_1.globalState.getClientPromise().activationPending = false;
    }
    if (!text.match(/with hash/)) {
        logger_1.LOGGER.logNoNL(text);
    }
    if (nbProcessManager.getStdOut() == null) {
        return;
    }
    isOut ? nbProcessManager.appendStdOut(text) : nbProcessManager.appendStdErr(text);
    if ((_a = nbProcessManager.getStdOut()) === null || _a === void 0 ? void 0 : _a.match(/org.netbeans.modules.java.lsp.server/)) {
        nbProcessManager.setStdOut(null);
    }
};
const processOnCloseHandler = (nbProcessManager, code) => {
    var _a;
    const globalnbProcessManager = globalState_1.globalState.getNbProcessManager();
    if (globalnbProcessManager == nbProcessManager) {
        globalState_1.globalState.setNbProcessManager(null);
        if (code && code != 0) {
            vscode_1.window.showWarningMessage(localiser_1.l10n.value("jdk.extension.lspServer.warning_message.serverExited", { SERVER_NAME: constants_1.extConstants.SERVER_NAME, code }));
        }
    }
    if (((_a = nbProcessManager.getStdErr()) === null || _a === void 0 ? void 0 : _a.match(/Cannot find java/)) || (os.type() === constants_1.NODE_WINDOWS_LABEL && !globalState_1.globalState.isDeactivated())) {
        (0, prompt_1.jdkDownloaderPrompt)();
    }
    if (nbProcessManager.getStdOut() != null) {
        let match = nbProcessManager.getStdOut().match(/org.netbeans.modules.java.lsp.server[^\n]*/);
        if ((match === null || match === void 0 ? void 0 : match.length) == 1) {
            logger_1.LOGGER.log(match[0]);
        }
        else {
            logger_1.LOGGER.error("Cannot find org.netbeans.modules.java.lsp.server in the log!");
        }
        logger_1.LOGGER.log(`Please refer to troubleshooting section for more info: https://github.com/oracle/javavscode/blob/main/README.md#troubleshooting`);
        logger_1.LOGGER.showOutputChannelUI(false);
        nbProcessManager.killProcess(false);
        return localiser_1.l10n.value("jdk.extension.error_msg.notEnabled", { SERVER_NAME: constants_1.extConstants.SERVER_NAME });
    }
    else {
        logger_1.LOGGER.log(`LSP server ${nbProcessManager.getProcessId()} terminated with ${code}`);
        logger_1.LOGGER.log(`Exit code ${code}`);
    }
    return null;
};
//# sourceMappingURL=nbcode.js.map