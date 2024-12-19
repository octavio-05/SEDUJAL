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
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.l10n = void 0;
const l10nLib = require("@vscode/l10n");
const vscode = require("vscode");
const constants_1 = require("./constants");
const DEFAULT_LANGAUGE = "en";
const DEFAULT_BUNDLE_FILE = `l10n/bundle.l10n.${DEFAULT_LANGAUGE}.json`;
class l10Wrapper {
    constructor(extensionId, defaultBundlePath) {
        var _a;
        let defaultBundleAbsoluteFsPath = vscode.Uri.file(`${(_a = vscode.extensions.getExtension(extensionId)) === null || _a === void 0 ? void 0 : _a.extensionPath}/${defaultBundlePath}`).fsPath;
        l10nLib.config({
            fsPath: defaultBundleAbsoluteFsPath
        });
        this.defaultTranslation = l10nLib.t;
    }
    value(key, placeholderMap) {
        const valueFromBundle = vscode.l10n.bundle ? vscode.l10n.t(key, placeholderMap) : key;
        const isPresentInBundle = valueFromBundle !== key;
        return isPresentInBundle ? valueFromBundle : this.defaultTranslation(key, placeholderMap);
    }
    nbLocaleCode() {
        const vscodeLanguage = vscode.env.language;
        if (!vscodeLanguage)
            return DEFAULT_LANGAUGE;
        const localeParts = vscodeLanguage.split(/[-_]/g);
        if (localeParts.length > 1) {
            localeParts[1] = localeParts[1].toUpperCase();
        }
        var nbFormatLocale = localeParts.join(":");
        return nbFormatLocale;
    }
}
exports.l10n = new l10Wrapper(constants_1.extConstants.ORACLE_VSCODE_EXTENSION_ID, DEFAULT_BUNDLE_FILE);
//# sourceMappingURL=localiser.js.map