"use strict";
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
exports.requestListeners = void 0;
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
const vscode_1 = require("vscode");
const protocol_1 = require("../../protocol");
const utils_1 = require("../../../utils");
const runConfiguration_1 = require("../../../views/runConfiguration");
const utils_2 = require("../../../utils");
const utils_3 = require("../../../utils");
const logger_1 = require("../../../logger");
const nbWebviewHandler_1 = require("../../../webviews/nbWebviewHandler");
const globalState_1 = require("../../../globalState");
const textEditorDecorationCreateRequestHandler = (param) => {
    let decorationType = vscode_1.window.createTextEditorDecorationType(param);
    globalState_1.globalState.setDecoration(decorationType.key, decorationType);
    return decorationType.key;
};
const multiStepInputRequestHandler = (param) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield globalState_1.globalState.getClientPromise().client;
    const data = {};
    function nextStep(input, step, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputStep = yield client.sendRequest(protocol_1.MutliStepInputRequest.step, { inputId: param.id, step, data: state });
            if (inputStep && inputStep.hasOwnProperty('items')) {
                const quickPickStep = inputStep;
                state[inputStep.stepId] = yield input.showQuickPick({
                    title: param.title,
                    step,
                    totalSteps: quickPickStep.totalSteps,
                    placeholder: quickPickStep.placeHolder,
                    items: quickPickStep.items,
                    canSelectMany: quickPickStep.canPickMany,
                    selectedItems: quickPickStep.items.filter(item => item.picked)
                });
                return (input) => nextStep(input, step + 1, state);
            }
            else if (inputStep && inputStep.hasOwnProperty('value')) {
                const inputBoxStep = inputStep;
                state[inputStep.stepId] = yield input.showInputBox({
                    title: param.title,
                    step,
                    totalSteps: inputBoxStep.totalSteps,
                    value: state[inputStep.stepId] || inputBoxStep.value,
                    prompt: inputBoxStep.prompt,
                    password: inputBoxStep.password,
                    validate: (val) => {
                        const d = Object.assign({}, state);
                        d[inputStep.stepId] = val;
                        return client.sendRequest(protocol_1.MutliStepInputRequest.validate, { inputId: param.id, step, data: d });
                    }
                });
                return (input) => nextStep(input, step + 1, state);
            }
        });
    }
    yield utils_1.MultiStepInput.run(input => nextStep(input, 1, data));
    return data;
});
const inputBoxRequestHandler = (param) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vscode_1.window.showInputBox({ title: param.title, prompt: param.prompt, value: param.value, password: param.password });
});
const saveDocumentRequestHandler = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const uriList = request.documents.map(s => {
        let re = /^file:\/(?:\/\/)?([A-Za-z]):\/(.*)$/.exec(s);
        if (!re) {
            return s;
        }
        // don't ask why vscode mangles URIs this way; in addition, it uses lowercase drive letter ???
        return `file:///${re[1].toLowerCase()}%3A/${re[2]}`;
    });
    for (let ed of vscode_1.workspace.textDocuments) {
        if (uriList.includes(ed.uri.toString())) {
            return ed.save();
        }
    }
    return false;
});
const updateConfigRequestHandler = (param) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.LOGGER.log(`Received config update: ${param.section}.${param.key}=${param.value}`);
    let wsFile = vscode_1.workspace.workspaceFile;
    let wsConfig = vscode_1.workspace.getConfiguration(param.section);
    if (wsConfig) {
        try {
            wsConfig.update(param.key, param.value, wsFile ? null : true)
                .then(() => {
                logger_1.LOGGER.log("Updated configuration: " + param.section + "." + param.key + "=" + param.value + "; in: " + (wsFile ? wsFile.toString() : "Global"));
            })
                .then(() => {
                (0, runConfiguration_1.runConfigurationUpdateAll)();
            });
        }
        catch (err) {
            logger_1.LOGGER.error("Failed to update configuration. Reason: " + ((0, utils_3.isString)(err) ? err : (0, utils_2.isError)(err) ? err.message : "error"));
        }
    }
});
const quickPickRequestHandler = (param) => __awaiter(void 0, void 0, void 0, function* () {
    const selected = yield vscode_1.window.showQuickPick(param.items, { title: param.title, placeHolder: param.placeHolder, canPickMany: param.canPickMany, ignoreFocusOut: true });
    return selected ? Array.isArray(selected) ? selected : [selected] : undefined;
});
exports.requestListeners = [{
        type: protocol_1.TextEditorDecorationCreateRequest.type,
        handler: textEditorDecorationCreateRequestHandler
    }, {
        type: protocol_1.MutliStepInputRequest.type,
        handler: multiStepInputRequestHandler
    }, {
        type: protocol_1.InputBoxRequest.type,
        handler: inputBoxRequestHandler
    }, {
        type: protocol_1.SaveDocumentsRequest.type,
        handler: saveDocumentRequestHandler
    }, {
        type: protocol_1.UpdateConfigurationRequest.type,
        handler: updateConfigRequestHandler
    }, {
        type: protocol_1.QuickPickRequest.type,
        handler: quickPickRequestHandler
    }, {
        type: protocol_1.HtmlPageRequest.type,
        handler: nbWebviewHandler_1.showHtmlPage
    }, {
        type: protocol_1.ExecInHtmlPageRequest.type,
        handler: nbWebviewHandler_1.execInHtmlPage
    }];
//# sourceMappingURL=handlers.js.map