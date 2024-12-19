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
exports.makeHtmlForProperties = void 0;
const controlTypes_1 = require("./controlTypes");
function makeHtmlForProperties(name, nonce, scriptUri, properties) {
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}';">
        <title>${name}</title>
    </head>
    
    <body>
        <h1>${name} Properties</h1>
        <vscode-divider></vscode-divider>
        <table>
            ${makePropertiesTable(properties)}
            <tr>
                <td colspan="2">
                </td>
            </tr>
            <tr>
                <td colspan="2" align="right" style="text-align: right;">
                    <vscode-button id="save" appearance="primary">Save</vscode-button>
                    <vscode-button id="cancel" appearance="secondary">Cancel</vscode-button>
                </td>
            </tr>
        </table>
        <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    
    </html>`;
}
exports.makeHtmlForProperties = makeHtmlForProperties;
;
function wrapToTable(name, content, separator = ":") {
    return `<tr><td align="right"><b>${name}${separator}</b></td><td align="left">${content}</td></tr>`;
}
function makePropertiesTable(properties) {
    let html = "";
    for (const prop of properties.properties) {
        html += makePropAccess(prop);
    }
    return html;
}
function makePropAccess(prop) {
    let out;
    switch (prop.type) {
        case controlTypes_1.PropertyTypes.String:
            out = makeStringAccess(prop);
            break;
        case controlTypes_1.PropertyTypes.Boolean:
            out = makeBoolAccess(prop);
            break;
        case controlTypes_1.PropertyTypes.Properties:
            out = makePropertiesAccess(prop);
            break;
        default:
            out = prop.value + "";
            break;
    }
    return wrapToTable(prop.displayName, out) + '\n';
}
function makeStringAccess(prop) {
    return `<vscode-text-field name="input" id="${prop.name}" value="${encode(prop.value)}" ${prop.write ? "" : "disabled"}></vscode-text-field>`;
}
function makeBoolAccess(prop) {
    return `<vscode-checkbox name="input" id="${prop.name}" ${prop.write ? "" : "disabled"} ${prop.value ? "checked" : ""}></vscode-checkbox>`;
}
function makePropertiesAccess(prop) {
    return `<details><summary><b>${prop.displayName}</b></summary><table name="input" id="${prop.name}">
    ${makePropTable(prop)}
    </table></details>`;
}
function makePropTable(prop) {
    let out = "";
    for (const key in prop.value) {
        out += makePropRow(prop, key) + '\n';
    }
    return out;
}
function makePropRow(prop, key) {
    return wrapToTable(asTextField(key, prop.write, "name"), asTextField(prop.value[key], prop.write, "value"), " = ");
}
function asTextField(value, enabled, name) {
    return `<vscode-text-field class="${name}" value="${encode(value)}" ${enabled ? "" : "disabled"}></vscode-text-field>`;
}
function encode(value) {
    return value.replace(/\"/g, "&quot;");
}
//# sourceMappingURL=propertiesHtmlBuilder.js.map