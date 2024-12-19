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
Object.defineProperty(exports, "__esModule", { value: true });
const webview_ui_toolkit_1 = require("@vscode/webview-ui-toolkit");
const typesUtil_1 = require("../typesUtil");
const controlTypes_1 = require("./controlTypes");
(0, webview_ui_toolkit_1.provideVSCodeDesignSystem)().register((0, webview_ui_toolkit_1.vsCodeButton)(), (0, webview_ui_toolkit_1.vsCodeTextField)(), (0, webview_ui_toolkit_1.vsCodeDivider)(), (0, webview_ui_toolkit_1.vsCodeCheckbox)());
const vscode = acquireVsCodeApi();
document.addEventListener("DOMContentLoaded", () => {
    try {
        (0, typesUtil_1.asClass)(webview_ui_toolkit_1.Button, document.getElementById('save'))
            .addEventListener('click', () => {
            try {
                if (validate())
                    sendMessage({ _type: controlTypes_1.CommandKey.Save, properties: getProperties() });
            }
            catch (e) {
                handleError(e);
            }
        });
        (0, typesUtil_1.asClass)(webview_ui_toolkit_1.Button, document.getElementById('cancel'))
            .addEventListener('click', () => {
            sendMessage({ _type: controlTypes_1.CommandKey.Cancel });
        });
    }
    catch (e) {
        handleError(e);
    }
});
function handleError(error) {
    if ((0, typesUtil_1.isError)(error))
        sendMessage({ _type: controlTypes_1.CommandKey.Error, error: error.message, stack: error.stack });
    else
        sendMessage({ _type: controlTypes_1.CommandKey.Error, error: JSON.stringify(error) });
}
function sendMessage(message) {
    vscode.postMessage(message);
}
function getProperties() {
    const out = [];
    const elements = document.getElementsByName("input");
    for (let i = 0; i < elements.length; ++i) {
        const element = elements.item(i);
        if (element)
            out.push(getProperty(element));
    }
    return out;
}
function getProperty(element) {
    if ((0, typesUtil_1.isClass)(webview_ui_toolkit_1.TextField, element)) {
        return makeProperty(element.value, element === null || element === void 0 ? void 0 : element.id);
    }
    else if ((0, typesUtil_1.isClass)(webview_ui_toolkit_1.Checkbox, element)) {
        return makeProperty(element.checked, element === null || element === void 0 ? void 0 : element.id);
    }
    else if ((0, typesUtil_1.isClass)(HTMLTableElement, element)) {
        return makeProperty(parseProperties(element), element === null || element === void 0 ? void 0 : element.id);
    }
    throw new Error("Unknown HTML Element type.");
}
function makeProperty(value, name) {
    if (name)
        return { name: name, value: value };
    throw new Error("HTML Element have no ID.");
}
function parseProperties(table) {
    var _a;
    const out = {};
    for (let i = 0; i < table.rows.length; ++i) {
        readProperty(out, (_a = table.rows.item(i)) === null || _a === void 0 ? void 0 : _a.cells);
    }
    return out;
}
function readProperty(out, cells) {
    var _a, _b;
    out[(0, typesUtil_1.asClass)(webview_ui_toolkit_1.TextField, (_a = cells === null || cells === void 0 ? void 0 : cells.item(0)) === null || _a === void 0 ? void 0 : _a.getElementsByClassName("name").item(0)).value]
        = (0, typesUtil_1.asClass)(webview_ui_toolkit_1.TextField, (_b = cells === null || cells === void 0 ? void 0 : cells.item(1)) === null || _b === void 0 ? void 0 : _b.getElementsByClassName("value").item(0)).value;
}
function validate() {
    return true; // no validation needed ATM
}
//# sourceMappingURL=script.js.map