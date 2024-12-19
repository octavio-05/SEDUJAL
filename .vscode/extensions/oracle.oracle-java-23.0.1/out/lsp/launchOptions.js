"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareNbcodeLaunchOptions = exports.getUserConfigLaunchOptionsDefaults = void 0;
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
const configuration_1 = require("../configurations/configuration");
const handlers_1 = require("../configurations/handlers");
const localiser_1 = require("../localiser");
const utils_1 = require("../utils");
const getUserConfigLaunchOptionsDefaults = () => {
    return {
        [configuration_1.configKeys.jdkHome]: {
            value: (0, handlers_1.jdkHomeValueHandler)(),
            optionToPass: ['--jdkhome']
        },
        [configuration_1.configKeys.userdir]: {
            value: (0, handlers_1.userdirHandler)(),
            optionToPass: ['--userdir']
        },
        [configuration_1.configKeys.disableProjSearchLimit]: {
            value: (0, handlers_1.projectSearchRootsValueHandler)(),
            optionToPass: '-J-Dproject.limitScanRoot='
        },
        [configuration_1.configKeys.verbose]: {
            value: (0, handlers_1.isNetbeansVerboseEnabled)(),
            optionToPass: '-J-Dnetbeans.logger.console='
        },
        [configuration_1.builtInConfigKeys.vscodeTheme]: {
            value: (0, handlers_1.isDarkColorThemeHandler)() ? 'com.formdev.flatlaf.FlatDarkLaf' : null,
            optionToPass: ['--laf']
        },
        [configuration_1.configKeys.lspVmOptions]: {
            value: (0, handlers_1.lspServerVmOptionsHandler)()
        }
    };
};
exports.getUserConfigLaunchOptionsDefaults = getUserConfigLaunchOptionsDefaults;
const extraLaunchOptions = [
    "--modules",
    "--list",
    "-J-XX:PerfMaxStringConstLength=10240",
    "--locale", localiser_1.l10n.nbLocaleCode(),
    "--start-java-language-server=listen-hash:0",
    "--start-java-debug-adapter-server=listen-hash:0",
    "-J-DTopSecurityManager.disable=true"
];
const prepareUserConfigLaunchOptions = () => {
    const launchOptions = [];
    const userConfigLaunchOptionsDefaults = (0, exports.getUserConfigLaunchOptionsDefaults)();
    Object.values(userConfigLaunchOptionsDefaults).forEach(userConfig => {
        const { value, optionToPass, encloseInvertedComma } = userConfig;
        if (value) {
            if (!optionToPass && Array.isArray(value)) {
                launchOptions.push(...value);
            }
            else if ((0, utils_1.isString)(optionToPass)) {
                launchOptions.push(`${optionToPass}${value}`);
            }
            else if (Array.isArray(optionToPass)) {
                const arg = [...optionToPass, value];
                launchOptions.push(...arg);
            }
        }
    });
    return launchOptions;
};
const prepareNbcodeLaunchOptions = () => {
    const nbcodeLaunchOptions = [];
    const userConfigLaunchOptions = prepareUserConfigLaunchOptions();
    nbcodeLaunchOptions.push(...userConfigLaunchOptions, ...extraLaunchOptions);
    return nbcodeLaunchOptions;
};
exports.prepareNbcodeLaunchOptions = prepareNbcodeLaunchOptions;
//# sourceMappingURL=launchOptions.js.map