/*
 * Copyright (c) 2024, Oracle and/or its affiliates.
 *
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
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const launchConfigurations = require("./launchConfigurations");
const constants_1 = require("./constants");
const initializer_1 = require("./lsp/initializer");
const register_1 = require("./commands/register");
const debugger_1 = require("./debugger/debugger");
const listener_1 = require("./configurations/listener");
const textDocumentContentProvider_1 = require("./lsp/listeners/textDocumentContentProvider");
const extensionContextInfo_1 = require("./extensionContextInfo");
const clientPromise_1 = require("./lsp/clientPromise");
const globalState_1 = require("./globalState");
function activate(context) {
    globalState_1.globalState.initialize(new extensionContextInfo_1.ExtensionContextInfo(context), new clientPromise_1.ClientPromise());
    globalState_1.globalState.getClientPromise().initialize();
    (0, listener_1.registerConfigChangeListeners)(context);
    (0, initializer_1.clientInit)();
    (0, debugger_1.registerDebugger)(context);
    (0, register_1.subscribeCommands)(context);
    (0, textDocumentContentProvider_1.registerFileProviders)(context);
    launchConfigurations.updateLaunchConfig();
    // register completions:
    launchConfigurations.registerCompletion(context);
    return Object.freeze({
        version: constants_1.extConstants.API_VERSION,
        apiVersion: constants_1.extConstants.API_VERSION
    });
}
exports.activate = activate;
function deactivate() {
    var _a;
    const process = (_a = globalState_1.globalState.getNbProcessManager()) === null || _a === void 0 ? void 0 : _a.getProcess();
    if (process != null) {
        process === null || process === void 0 ? void 0 : process.kill();
    }
    return globalState_1.globalState.getClientPromise().stopClient();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map