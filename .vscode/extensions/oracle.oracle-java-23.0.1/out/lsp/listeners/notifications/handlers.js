"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationListeners = void 0;
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
const vscode_languageclient_1 = require("vscode-languageclient");
const protocol_1 = require("../../protocol");
const vscode_1 = require("vscode");
const handlers_1 = require("../../../configurations/handlers");
const localiser_1 = require("../../../localiser");
const configuration_1 = require("../../../configurations/configuration");
const commands_1 = require("../../../commands/commands");
const logger_1 = require("../../../logger");
const globalState_1 = require("../../../globalState");
const checkInstallNbJavac = (msg) => {
    const NO_JAVA_SUPPORT = "Cannot initialize Java support";
    if (msg.startsWith(NO_JAVA_SUPPORT)) {
        if ((0, handlers_1.isNbJavacDisabledHandler)()) {
            const message = localiser_1.l10n.value("jdk.extension.nbjavac.message.supportedVersionRequired");
            const enable = localiser_1.l10n.value("jdk.extension.nbjavac.label.enableNbjavac");
            const settings = localiser_1.l10n.value("jdk.extension.nbjavac.label.openSettings");
            vscode_1.window.showErrorMessage(message, enable, settings).then(reply => {
                if (enable === reply) {
                    (0, handlers_1.updateConfigurationValue)(configuration_1.configKeys.disableNbJavac, false);
                }
                else if (settings === reply) {
                    vscode_1.commands.executeCommand(commands_1.builtInCommands.openSettings, configuration_1.configKeys.jdkHome);
                }
            });
        }
    }
};
const showStatusBarMessageHandler = (params) => {
    let decorated = params.message;
    let defTimeout;
    switch (params.type) {
        case vscode_languageclient_1.MessageType.Error:
            decorated = '$(error) ' + params.message;
            defTimeout = 0;
            checkInstallNbJavac(params.message);
            break;
        case vscode_languageclient_1.MessageType.Warning:
            decorated = '$(warning) ' + params.message;
            defTimeout = 0;
            break;
        default:
            defTimeout = 10000;
            break;
    }
    // params.timeout may be defined but 0 -> should be used
    const timeout = params.timeout != undefined ? params.timeout : defTimeout;
    if (timeout > 0) {
        vscode_1.window.setStatusBarMessage(decorated, timeout);
    }
    else {
        vscode_1.window.setStatusBarMessage(decorated);
    }
};
const logMessageHandler = (param) => {
    logger_1.LOGGER.log(param.message);
};
const testProgressHandler = (param) => {
    const testAdapter = globalState_1.globalState.getTestAdapter();
    if (testAdapter) {
        testAdapter.testProgress(param.suite);
    }
};
const textEditorSetDecorationHandler = (param) => {
    let decorationType = globalState_1.globalState.getDecoration(param.key);
    if (decorationType) {
        let editorsWithUri = vscode_1.window.visibleTextEditors.filter(editor => editor.document.uri.toString() == param.uri);
        if (editorsWithUri.length > 0) {
            editorsWithUri[0].setDecorations(decorationType, (0, protocol_1.asRanges)(param.ranges));
            globalState_1.globalState.setDecorationParams(editorsWithUri[0].document.uri, param);
        }
    }
};
const textEditorDecorationDisposeHandler = (param) => {
    let decorationType = globalState_1.globalState.getDecoration(param);
    if (decorationType) {
        globalState_1.globalState.removeDecoration(param);
        decorationType.dispose();
        globalState_1.globalState.getDecorationParamsByUri().forEach((value, key) => {
            if (value.key == param) {
                globalState_1.globalState.removeDecorationParams(key);
            }
        });
    }
};
const telemetryEventHandler = (param) => {
    const ls = globalState_1.globalState.getListener(param);
    if (ls) {
        for (const listener of ls) {
            vscode_1.commands.executeCommand(listener);
        }
    }
};
exports.notificationListeners = [{
        type: protocol_1.StatusMessageRequest.type,
        handler: showStatusBarMessageHandler
    }, {
        type: vscode_languageclient_1.LogMessageNotification.type,
        handler: logMessageHandler
    }, {
        type: protocol_1.TestProgressNotification.type,
        handler: testProgressHandler
    }, {
        type: protocol_1.TextEditorDecorationSetNotification.type,
        handler: textEditorSetDecorationHandler
    }, {
        type: protocol_1.TextEditorDecorationDisposeNotification.type,
        handler: textEditorDecorationDisposeHandler
    }, {
        type: vscode_languageclient_1.TelemetryEventNotification.type,
        handler: telemetryEventHandler
    }];
//# sourceMappingURL=handlers.js.map