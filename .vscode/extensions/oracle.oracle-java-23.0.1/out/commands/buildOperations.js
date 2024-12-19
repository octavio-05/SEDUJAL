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
exports.registerBuildOperationCommands = void 0;
const logger_1 = require("../logger");
const localiser_1 = require("../localiser");
const commands_1 = require("./commands");
const utils_1 = require("./utils");
const compileWorkspaceHandler = () => {
    return (0, utils_1.wrapCommandWithProgress)(commands_1.nbCommands.buildWorkspace, localiser_1.l10n.value('jdk.extension.command.progress.compilingWorkSpace'), logger_1.LOGGER.getOutputChannel());
};
const cleanWorkspaceHandler = () => {
    return (0, utils_1.wrapCommandWithProgress)(commands_1.nbCommands.cleanWorkspace, localiser_1.l10n.value('jdk.extension.command.progress.cleaningWorkSpace'), logger_1.LOGGER.getOutputChannel());
};
const compileProjectHandler = (args) => {
    (0, utils_1.wrapProjectActionWithProgress)('build', undefined, localiser_1.l10n.value('jdk.extension.command.progress.compilingProject'), logger_1.LOGGER.getOutputChannel(), args);
};
const cleanProjectHandler = (args) => {
    (0, utils_1.wrapProjectActionWithProgress)('clean', undefined, localiser_1.l10n.value('jdk.extension.command.progress.cleaningProject'), logger_1.LOGGER.getOutputChannel(), args);
};
exports.registerBuildOperationCommands = [
    {
        command: commands_1.extCommands.compileWorkspace,
        handler: compileWorkspaceHandler
    }, {
        command: commands_1.extCommands.cleanWorkspace,
        handler: cleanWorkspaceHandler
    }, {
        command: commands_1.extCommands.compileProject,
        handler: compileProjectHandler
    }, {
        command: commands_1.extCommands.cleanProject,
        handler: cleanProjectHandler
    }
];
//# sourceMappingURL=buildOperations.js.map