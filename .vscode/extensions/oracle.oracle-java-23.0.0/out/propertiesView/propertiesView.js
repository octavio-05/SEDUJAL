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
exports.PropertiesView = void 0;
const vscode = require("vscode");
const controlTypes_1 = require("./controlTypes");
const typesUtil_1 = require("../typesUtil");
const propertiesHtmlBuilder_1 = require("./propertiesHtmlBuilder");
const protocol_1 = require("../protocol");
function isVisualizer(node) {
    return (node === null || node === void 0 ? void 0 : node.id) && (node === null || node === void 0 ? void 0 : node.rootId);
}
class PropertiesView {
    constructor(id, name) {
        this._disposables = [];
        this.id = id;
        this.name = name;
        this._panel = vscode.window.createWebviewPanel('Properties', 'Properties', vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
        });
        // Set the webview's html content
        this.load().then(() => this.setHtml()).catch((e) => {
            console.error(e);
            this.dispose();
        });
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Update the content based on view changes
        this._panel.onDidChangeViewState(() => {
            if (this._panel.visible) {
                try {
                    this.setHtml();
                }
                catch (e) {
                    console.error(e);
                    this.dispose();
                }
            }
        }, null, this._disposables);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(message => {
            try {
                this.processMessage(message);
            }
            catch (e) {
                console.error(e);
                this.dispose();
            }
        }, undefined, this._disposables);
    }
    static createOrShow(context, node, treeService) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!node)
                return;
            if (!isVisualizer(node)) {
                return;
            }
            const id = node.id ? Number(node.id) : 0;
            // If we already have a panel, show it.
            const current = PropertiesView.panels[id];
            let view;
            // the listener will remove/close the properties view, if the associated node gets destroyed.
            class L {
                nodeDestroyed(n) {
                    if (view) {
                        /*
                        vscode.window.showInformationMessage(`${node.label} has been removed.`);
                        */
                        view.dispose();
                    }
                }
            }
            try {
                if (current) {
                    yield current.load();
                    current._panel.reveal();
                    return;
                }
                if (!PropertiesView.extensionUri) {
                    PropertiesView.extensionUri = context.extensionUri;
                    PropertiesView.scriptPath = vscode.Uri.joinPath(context.extensionUri, 'out', 'script.js');
                }
                else if (PropertiesView.extensionUri !== context.extensionUri)
                    throw new Error("Extension paths differ.");
                // Otherwise, create a new panel.
                PropertiesView.panels[id] = view = new PropertiesView(id, node.tooltip + " " + node.label);
                if (treeService) {
                    treeService.addNodeChangeListener(node, new L(), protocol_1.NodeChangeType.DESTROY);
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const props = yield this.get();
            if (props.size === 0) {
                throw new Error("No properties.");
            }
            this.properties = props.values().next().value;
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield vscode.commands.executeCommand(PropertiesView.COMMAND_GET_NODE_PROPERTIES, this.id);
            if (!(0, typesUtil_1.isObject)(resp)) {
                // TODO - possibly report protocol error ?
                return new Map();
            }
            return new Map(Object.entries(resp)); // TODO - validate cast
        });
    }
    save(properties) {
        var _a;
        if (!this.properties)
            return;
        for (const prop of properties)
            this.mergeProps(prop, (_a = this.properties) === null || _a === void 0 ? void 0 : _a.properties);
        const msg = {};
        msg[this.properties.name] = this.properties;
        vscode.commands.executeCommand(PropertiesView.COMMAND_SET_NODE_PROPERTIES, this.id, msg)
            .then(done => {
            if ((0, typesUtil_1.isRecord)(typesUtil_1.isRecord.bind(null, typesUtil_1.isString), done)) {
                this.processSaveError(done);
            }
        }, err => vscode.window.showErrorMessage(err.message, { modal: true, detail: err.stack }));
    }
    processSaveError(errObj) {
        if (Object.keys(errObj).length === 0)
            return;
        let out = "";
        for (const propertiesName of Object.keys(errObj)) {
            for (const property of Object.entries(errObj[propertiesName]))
                out += `${propertiesName}.${property[0]}: ${property[1]}\n`;
        }
        vscode.window.showErrorMessage("Saving of properties failed.", { modal: true, detail: out });
    }
    mergeProps(prop, props) {
        const p = props === null || props === void 0 ? void 0 : props.find(p => p.name === prop.name);
        if (p && Object.values(controlTypes_1.PropertyTypes).includes(p.type))
            p.value = prop.value;
    }
    processMessage(message) {
        switch (message._type) {
            case controlTypes_1.CommandKey.Save:
                this.save(message.properties);
            case controlTypes_1.CommandKey.Cancel:
                this.dispose();
                break;
            case controlTypes_1.CommandKey.Error:
                console.error(message.error);
                if (message.stack)
                    console.error(message.stack);
                this.dispose();
                break;
            case controlTypes_1.CommandKey.Info:
                console.log(message.info);
                break;
            default:
                (0, typesUtil_1.assertNever)(message, "Got unknown message: " + JSON.stringify(message));
        }
    }
    static getNonce() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    setHtml() {
        if (!this.properties)
            throw new Error("No properties to show.");
        const script = this._panel.webview.asWebviewUri(PropertiesView.scriptPath);
        const html = (0, propertiesHtmlBuilder_1.makeHtmlForProperties)(this.name, PropertiesView.getNonce(), script, this.properties);
        this._panel.webview.html = html;
    }
    dispose() {
        delete PropertiesView.panels[this.id];
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}
exports.PropertiesView = PropertiesView;
PropertiesView.COMMAND_PREFIX = "java.";
PropertiesView.COMMAND_GET_NODE_PROPERTIES = PropertiesView.COMMAND_PREFIX + "node.properties.get"; // NOI18N
PropertiesView.COMMAND_SET_NODE_PROPERTIES = PropertiesView.COMMAND_PREFIX + "node.properties.set"; // NOI18N
PropertiesView.panels = {};
//# sourceMappingURL=propertiesView.js.map