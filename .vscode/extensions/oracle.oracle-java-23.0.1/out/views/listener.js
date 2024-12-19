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
exports.registerListenersAfterClientInit = void 0;
const vscode_1 = require("vscode");
const protocol_1 = require("../lsp/protocol");
const globalState_1 = require("../globalState");
const visibleTextEditorsChangeHandler = (editors) => {
    editors.forEach((editor) => {
        let decorationParams = globalState_1.globalState.getDecorationParamsByUriByKey(editor.document.uri);
        if (decorationParams) {
            let decorationType = globalState_1.globalState.getDecoration(decorationParams.key);
            if (decorationType) {
                editor.setDecorations(decorationType, (0, protocol_1.asRanges)(decorationParams.ranges));
            }
        }
    });
};
const visibleTextEditorsChangeListener = vscode_1.window.onDidChangeVisibleTextEditors(visibleTextEditorsChangeHandler);
const afterInitlisteners = [visibleTextEditorsChangeListener];
const registerListenersAfterClientInit = () => {
    afterInitlisteners.forEach(listener => {
        globalState_1.globalState.getExtensionContextInfo().pushSubscription(listener);
    });
};
exports.registerListenersAfterClientInit = registerListenersAfterClientInit;
//# sourceMappingURL=listener.js.map