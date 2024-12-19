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
exports.ClientPromise = void 0;
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
const logger_1 = require("../logger");
const initializer_1 = require("./initializer");
const globalState_1 = require("../globalState");
class ClientPromise {
    constructor() {
        this.activationPending = true;
        this.initialize = () => {
            this.client = new Promise((clientOK, clientErr) => {
                this.setClient = [
                    (c) => {
                        clientOK(c);
                    },
                    (err) => {
                        clientErr(err);
                    }
                ];
            });
            this.activationPending = true;
            vscode_1.commands.executeCommand('setContext', 'nbJdkReady', false);
        };
        this.initializedSuccessfully = (client) => {
            globalState_1.globalState.getClientPromise().setClient[0](client);
            vscode_1.commands.executeCommand('setContext', 'nbJdkReady', true);
        };
        this.stopClient = () => __awaiter(this, void 0, void 0, function* () {
            const testAdapter = globalState_1.globalState.getTestAdapter();
            if (testAdapter) {
                testAdapter.dispose();
                globalState_1.globalState.setTestAdapter(undefined);
            }
            if (!this.client) {
                return Promise.resolve();
            }
            return (yield this.client).stop();
        });
        this.restartExtension = (nbProcessManager, notifyKill) => __awaiter(this, void 0, void 0, function* () {
            if (this.activationPending) {
                logger_1.LOGGER.warn("Server activation requested repeatedly, ignoring...");
                return;
            }
            if (!nbProcessManager) {
                logger_1.LOGGER.error("Nbcode Process is null");
                return;
            }
            try {
                yield this.stopClient();
                yield nbProcessManager.killProcess(notifyKill);
                this.initialize();
                (0, initializer_1.clientInit)();
            }
            catch (error) {
                logger_1.LOGGER.error(`Error during activation: ${error}`);
                throw error;
            }
            finally {
                this.activationPending = false;
            }
        });
    }
}
exports.ClientPromise = ClientPromise;
//# sourceMappingURL=clientPromise.js.map