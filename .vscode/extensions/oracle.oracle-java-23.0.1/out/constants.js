"use strict";
/*
  Copyright (c) 2023, Oracle and/or its affiliates.

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
exports.NODE_WINDOWS_LABEL = exports.jdkDownloaderConstants = exports.extConstants = void 0;
var extConstants;
(function (extConstants) {
    extConstants.API_VERSION = "1.0";
    extConstants.SERVER_NAME = "Oracle Java SE Language Server";
    extConstants.NB_LANGUAGE_CLIENT_ID = 'Oracle Java SE';
    extConstants.NB_LANGUAGE_CLIENT_NAME = "java";
    extConstants.LANGUAGE_ID = "java";
    extConstants.ORACLE_VSCODE_EXTENSION_ID = 'oracle.oracle-java';
    extConstants.COMMAND_PREFIX = 'jdk';
})(extConstants = exports.extConstants || (exports.extConstants = {}));
var jdkDownloaderConstants;
(function (jdkDownloaderConstants) {
    jdkDownloaderConstants.JDK_RELEASES_TRACK_URL = `https://www.java.com/releases/releases.json`;
    jdkDownloaderConstants.ORACLE_JDK_BASE_DOWNLOAD_URL = `https://download.oracle.com/java`;
    jdkDownloaderConstants.ORACLE_JDK_DOWNLOAD_VERSIONS = ['23', '21'];
    jdkDownloaderConstants.OPEN_JDK_VERSION_DOWNLOAD_LINKS = {
        "23": "https://download.java.net/java/GA/jdk23.0.1/c28985cbf10d4e648e4004050f8781aa/11/GPL/openjdk-23.0.1"
    };
})(jdkDownloaderConstants = exports.jdkDownloaderConstants || (exports.jdkDownloaderConstants = {}));
exports.NODE_WINDOWS_LABEL = "Windows_NT";
//# sourceMappingURL=constants.js.map