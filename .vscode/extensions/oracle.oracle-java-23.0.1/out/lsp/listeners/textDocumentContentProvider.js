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
exports.registerFileProviders = void 0;
const vscode_1 = require("vscode");
const commands_1 = require("../../commands/commands");
const archiveFileProvider = {
    provideTextDocumentContent: (uri) => __awaiter(void 0, void 0, void 0, function* () {
        return yield vscode_1.commands.executeCommand(commands_1.nbCommands.archiveFileContent, uri.toString());
    })
};
const textDocumentContentProvider = [
    vscode_1.workspace.registerTextDocumentContentProvider('nbjrt', archiveFileProvider),
    vscode_1.workspace.registerTextDocumentContentProvider('jar', archiveFileProvider)
];
const registerFileProviders = (context) => {
    textDocumentContentProvider.forEach((provider) => {
        context.subscriptions.push(provider);
    });
};
exports.registerFileProviders = registerFileProviders;
//# sourceMappingURL=textDocumentContentProvider.js.map