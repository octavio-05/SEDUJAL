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
exports.registerRunConfigurationCommands = void 0;
const commands_1 = require("./commands");
const runConfiguration_1 = require("../views/runConfiguration");
const globalState_1 = require("../globalState");
const configureRunSettingsHandler = (...params) => {
    (0, runConfiguration_1.configureRunSettings)(globalState_1.globalState.getExtensionContextInfo().getExtensionContext(), params);
};
exports.registerRunConfigurationCommands = [{
        command: commands_1.extCommands.configureRunSettings,
        handler: configureRunSettingsHandler
    }];
//# sourceMappingURL=runConfiguration.js.map