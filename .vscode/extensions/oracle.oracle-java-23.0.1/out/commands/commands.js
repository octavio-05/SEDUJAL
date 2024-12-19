"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nbCommands = exports.builtInCommands = exports.extCommands = void 0;
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
const utils_1 = require("../utils");
exports.extCommands = {
    configureRunSettings: (0, utils_1.appendPrefixToCommand)('workspace.configureRunSettings'),
    newFromTemplate: (0, utils_1.appendPrefixToCommand)('workspace.new'),
    newProject: (0, utils_1.appendPrefixToCommand)('workspace.newproject'),
    openTest: (0, utils_1.appendPrefixToCommand)('open.test'),
    deleteCache: (0, utils_1.appendPrefixToCommand)('delete.cache'),
    downloadJdk: (0, utils_1.appendPrefixToCommand)('download.jdk'),
    compileWorkspace: (0, utils_1.appendPrefixToCommand)('workspace.compile'),
    cleanWorkspace: (0, utils_1.appendPrefixToCommand)('workspace.clean'),
    compileProject: (0, utils_1.appendPrefixToCommand)('project.compile'),
    cleanProject: (0, utils_1.appendPrefixToCommand)('project.clean'),
    openType: (0, utils_1.appendPrefixToCommand)('open.type'),
    goToSuperImpl: (0, utils_1.appendPrefixToCommand)('java.goto.super.implementation'),
    renameElement: (0, utils_1.appendPrefixToCommand)('rename.element.at'),
    surroundWith: (0, utils_1.appendPrefixToCommand)('surround.with'),
    generateCode: (0, utils_1.appendPrefixToCommand)('generate.code'),
    runTest: (0, utils_1.appendPrefixToCommand)('run.test'),
    debugTest: (0, utils_1.appendPrefixToCommand)('debug.test'),
    runSingle: (0, utils_1.appendPrefixToCommand)('run.single'),
    debugSingle: (0, utils_1.appendPrefixToCommand)('debug.single'),
    projectRun: (0, utils_1.appendPrefixToCommand)('project.run'),
    projectDebug: (0, utils_1.appendPrefixToCommand)('project.debug'),
    projectTest: (0, utils_1.appendPrefixToCommand)('project.test'),
    packageTest: (0, utils_1.appendPrefixToCommand)('package.test'),
    openStackTrace: (0, utils_1.appendPrefixToCommand)('open.stacktrace'),
    workspaceSymbols: (0, utils_1.appendPrefixToCommand)('workspace.symbols'),
    abstractMethodsComplete: (0, utils_1.appendPrefixToCommand)('java.complete.abstract.methods'),
    startupCondition: (0, utils_1.appendPrefixToCommand)('startup.condition'),
    nbEventListener: (0, utils_1.appendPrefixToCommand)('addEventListener'),
    selectEditorProjs: (0, utils_1.appendPrefixToCommand)('select.editor.projects'),
    attachDebuggerConnector: (0, utils_1.appendPrefixToCommand)("java.attachDebugger.connector"),
    attachDebuggerConfigurations: (0, utils_1.appendPrefixToCommand)("java.attachDebugger.configurations"),
    loadWorkspaceTests: (0, utils_1.appendPrefixToCommand)("load.workspace.tests"),
    projectDeleteEntry: (0, utils_1.appendPrefixToCommand)("foundProjects.deleteEntry")
};
exports.builtInCommands = {
    setCustomContext: 'setContext',
    openFolder: 'vscode.openFolder',
    reloadWindow: 'workbench.action.reloadWindow',
    focusActiveEditorGroup: 'workbench.action.focusActiveEditorGroup',
    goToEditorLocations: 'editor.action.goToLocations',
    renameSymbol: 'editor.action.rename',
    quickAccess: 'workbench.action.quickOpen',
    openSettings: 'workbench.action.openSettings',
    startDebug: 'workbench.action.debug.start',
    focusReplDebug: 'workbench.debug.action.focusRepl',
};
exports.nbCommands = {
    newFromTemplate: (0, utils_1.appendPrefixToCommand)('new.from.template'),
    newProject: (0, utils_1.appendPrefixToCommand)('new.project'),
    goToTest: (0, utils_1.appendPrefixToCommand)('go.to.test'),
    quickOpen: (0, utils_1.appendPrefixToCommand)('quick.open'),
    superImpl: (0, utils_1.appendPrefixToCommand)('java.super.implementation'),
    resolveStackLocation: (0, utils_1.appendPrefixToCommand)('resolve.stacktrace.location'),
    implementAbstractMethods: (0, utils_1.appendPrefixToCommand)('java.implement.all.abstract.methods'),
    archiveFileContent: (0, utils_1.appendPrefixToCommand)('get.archive.file.content'),
    htmlProcessCmd: (0, utils_1.appendPrefixToCommand)('htmlui.process.command'),
    projectConfigurations: (0, utils_1.appendPrefixToCommand)('project.configurations'),
    debuggerConfigurations: (0, utils_1.appendPrefixToCommand)('java.attachDebugger.configurations'),
    runProjectAction: (0, utils_1.appendPrefixToCommand)('project.run.action'),
    buildWorkspace: (0, utils_1.appendPrefixToCommand)('build.workspace'),
    cleanWorkspace: (0, utils_1.appendPrefixToCommand)('clean.workspace'),
    clearProjectCaches: (0, utils_1.appendPrefixToCommand)('clear.project.caches'),
    javaProjectPackages: (0, utils_1.appendPrefixToCommand)('java.get.project.packages'),
    openStackTrace: (0, utils_1.appendPrefixToCommand)('open.stacktrace')
};
//# sourceMappingURL=commands.js.map