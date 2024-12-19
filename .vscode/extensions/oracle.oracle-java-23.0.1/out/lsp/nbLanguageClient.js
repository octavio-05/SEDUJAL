"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NbLanguageClient = void 0;
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
const node_1 = require("vscode-languageclient/node");
const vscode_languageclient_1 = require("vscode-languageclient");
const projects_1 = require("../views/projects");
const vscode_1 = require("vscode");
const constants_1 = require("../constants");
const configuration_1 = require("../configurations/configuration");
const utils_1 = require("./utils");
const globalState_1 = require("../globalState");
class NbLanguageClient extends node_1.LanguageClient {
    constructor(id, name, s, log, c) {
        super(id, name, s, c);
        this._treeViewService = (0, projects_1.createTreeViewService)(log, this);
    }
    findTreeViewService() {
        return this._treeViewService;
    }
    stop() {
        const r = super.stop();
        this._treeViewService.dispose();
        return r;
    }
}
exports.NbLanguageClient = NbLanguageClient;
NbLanguageClient.build = (serverOptions, logger) => {
    let documentSelectors = [
        { language: constants_1.extConstants.LANGUAGE_ID },
        { language: 'properties', pattern: '**/*.properties' },
        { language: 'jackpot-hint' },
        { language: 'xml', pattern: '**/pom.xml' },
        { pattern: '*.gradle' },
        { pattern: '*.gradle.kts' }
    ];
    // Options to control the language client
    let clientOptions = {
        // Register the server for java documents
        documentSelector: documentSelectors,
        synchronize: {
            configurationSection: configuration_1.userConfigsListenedByServer,
            fileEvents: [
                vscode_1.workspace.createFileSystemWatcher('**/*.java')
            ]
        },
        outputChannel: logger.getOutputChannel(),
        revealOutputChannelOn: vscode_languageclient_1.RevealOutputChannelOn.Never,
        progressOnInitialization: true,
        initializationOptions: {
            'nbcodeCapabilities': {
                'statusBarMessageSupport': true,
                'testResultsSupport': true,
                'showHtmlPageSupport': true,
                'wantsJavaSupport': true,
                'wantsGroovySupport': false,
                'commandPrefix': constants_1.extConstants.COMMAND_PREFIX,
                'configurationPrefix': `${constants_1.extConstants.COMMAND_PREFIX}.`,
                'altConfigurationPrefix': `${constants_1.extConstants.COMMAND_PREFIX}.`
            }
        },
        errorHandler: {
            error: function (error, _message, count) {
                return { action: vscode_languageclient_1.ErrorAction.Continue, message: error.message };
            },
            closed: function () {
                logger.warn(`Connection to ${constants_1.extConstants.SERVER_NAME} closed.`);
                if (!globalState_1.globalState.getClientPromise().activationPending) {
                    (0, utils_1.restartWithJDKLater)(10000, false);
                }
                return { action: vscode_languageclient_1.CloseAction.DoNotRestart };
            }
        }
    };
    return new NbLanguageClient(constants_1.extConstants.NB_LANGUAGE_CLIENT_ID, constants_1.extConstants.NB_LANGUAGE_CLIENT_NAME, serverOptions, logger.getOutputChannel(), clientOptions);
};
//# sourceMappingURL=nbLanguageClient.js.map