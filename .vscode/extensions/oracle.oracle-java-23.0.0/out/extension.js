/*
 * Copyright (c) 2023, Oracle and/or its affiliates.
 *
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
/* This file has been modified for Oracle Java SE extension */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.awaitClient = exports.findClusters = exports.enableConsoleLog = exports.handleLog = exports.NbLanguageClient = exports.COMMAND_PREFIX = void 0;
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const vscode_languageclient_1 = require("vscode-languageclient");
const net = require("net");
const fs = require("fs");
const os = require("os");
const path = require("path");
const vscode = require("vscode");
const launcher = require("./nbcode");
const streamDebugAdapter_1 = require("./streamDebugAdapter");
const testAdapter_1 = require("./testAdapter");
const protocol_1 = require("./protocol");
const launchConfigurations = require("./launchConfigurations");
const explorer_1 = require("./explorer");
const runConfiguration_1 = require("./runConfiguration");
const utils_1 = require("./utils");
const propertiesView_1 = require("./propertiesView/propertiesView");
const localiser_1 = require("./localiser");
const constants_1 = require("./constants");
const view_1 = require("./jdkDownloader/view");
const API_VERSION = "1.0";
const SERVER_NAME = "Oracle Java SE Language Server";
const NB_LANGUAGE_CLIENT_ID = "java";
const LANGUAGE_ID = "java";
exports.COMMAND_PREFIX = "jdk";
const listeners = new Map();
let client;
let testAdapter;
let nbProcess = null;
let debugPort = -1;
let debugHash;
let consoleLog = !!process.env['ENABLE_CONSOLE_LOG'];
let deactivated = true;
class NbLanguageClient extends node_1.LanguageClient {
    constructor(id, name, s, log, c) {
        super(id, name, s, c);
        this._treeViewService = (0, explorer_1.createTreeViewService)(log, this);
    }
    findTreeViewService() {
        return this._treeViewService;
    }
    stop() {
        // stop will be called even in case of external close & client restart, so OK.
        const r = super.stop();
        this._treeViewService.dispose();
        return r;
    }
}
exports.NbLanguageClient = NbLanguageClient;
function handleLog(log, msg) {
    log.appendLine(msg);
    if (consoleLog) {
        console.log(msg);
    }
}
exports.handleLog = handleLog;
function handleLogNoNL(log, msg) {
    log.append(msg);
    if (consoleLog) {
        process.stdout.write(msg);
    }
}
function enableConsoleLog() {
    consoleLog = true;
    console.log("enableConsoleLog");
}
exports.enableConsoleLog = enableConsoleLog;
function findClusters(myPath) {
    let clusters = [];
    for (let e of vscode.extensions.all) {
        if (e.extensionPath === myPath) {
            continue;
        }
        const dir = path.join(e.extensionPath, 'nbcode');
        if (!fs.existsSync(dir)) {
            continue;
        }
        const exists = fs.readdirSync(dir);
        for (let clusterName of exists) {
            let clusterPath = path.join(dir, clusterName);
            let clusterModules = path.join(clusterPath, 'config', 'Modules');
            if (!fs.existsSync(clusterModules)) {
                continue;
            }
            let perm = fs.statSync(clusterModules);
            if (perm.isDirectory()) {
                clusters.push(clusterPath);
            }
        }
    }
    return clusters;
}
exports.findClusters = findClusters;
// for tests only !
function awaitClient() {
    const c = client;
    if (c && !(c instanceof InitialPromise)) {
        return c;
    }
    let nbcode = vscode.extensions.getExtension(constants_1.ORACLE_VSCODE_EXTENSION_ID);
    if (!nbcode) {
        return Promise.reject(new Error(localiser_1.l10n.value("jdk.extension.notInstalled.label")));
    }
    const t = nbcode.activate().then(nc => {
        if (client === undefined || client instanceof InitialPromise) {
            throw new Error(localiser_1.l10n.value("jdk.extension.error_msg.clientNotAvailable"));
        }
        else {
            return client;
        }
    });
    return Promise.resolve(t);
}
exports.awaitClient = awaitClient;
function findJDK(onChange) {
    let nowDark = isDarkColorTheme();
    let nowNbJavacDisabled = isNbJavacDisabled();
    function find() {
        let nbJdk = vscode_1.workspace.getConfiguration(exports.COMMAND_PREFIX).get('jdkhome');
        if (nbJdk) {
            return nbJdk;
        }
        let jdkHome = process.env.JDK_HOME;
        if (jdkHome) {
            return jdkHome;
        }
        let jHome = process.env.JAVA_HOME;
        if (jHome) {
            return jHome;
        }
        return null;
    }
    let currentJdk = find();
    let projectJdk = getProjectJDKHome();
    let timeout = undefined;
    vscode_1.workspace.onDidChangeConfiguration(params => {
        if (timeout) {
            return;
        }
        let interested = false;
        if (params.affectsConfiguration(exports.COMMAND_PREFIX)) {
            interested = true;
        }
        else if (params.affectsConfiguration('workbench.colorTheme')) {
            let d = isDarkColorTheme();
            if (d != nowDark) {
                interested = true;
            }
        }
        if (!interested) {
            return;
        }
        timeout = setTimeout(() => {
            var _a;
            timeout = undefined;
            let newJdk = find();
            let newD = isDarkColorTheme();
            let newNbJavacDisabled = isNbJavacDisabled();
            let newProjectJdk = (_a = vscode_1.workspace.getConfiguration(exports.COMMAND_PREFIX)) === null || _a === void 0 ? void 0 : _a.get('project.jdkhome');
            if (newJdk !== currentJdk || newD != nowDark || newNbJavacDisabled != nowNbJavacDisabled || newProjectJdk != projectJdk) {
                nowDark = newD;
                currentJdk = newJdk;
                nowNbJavacDisabled = newNbJavacDisabled;
                projectJdk = newProjectJdk;
                onChange(currentJdk);
            }
        }, 0);
    });
    onChange(currentJdk);
}
function contextUri(ctx) {
    var _a, _b;
    if (ctx === null || ctx === void 0 ? void 0 : ctx.fsPath) {
        return ctx;
    }
    else if (ctx === null || ctx === void 0 ? void 0 : ctx.resourceUri) {
        return ctx.resourceUri;
    }
    else if (typeof ctx == 'string') {
        try {
            return vscode.Uri.parse(ctx, true);
        }
        catch (err) {
            return vscode.Uri.file(ctx);
        }
    }
    return (_b = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.uri;
}
/**
 * Executes a project action. It is possible to provide an explicit configuration to use (or undefined), display output from the action etc.
 * Arguments are attempted to parse as file or editor references or Nodes; otherwise they are attempted to be passed to the action as objects.
 *
 * @param action ID of the project action to run
 * @param configuration configuration to use or undefined - use default/active one.
 * @param title Title for the progress displayed in vscode
 * @param log output channel that should be revealed
 * @param showOutput if true, reveals the passed output channel
 * @param args additional arguments
 * @returns Promise for the command's result
 */
function wrapProjectActionWithProgress(action, configuration, title, log, showOutput, ...args) {
    let items = [];
    let actionParams = {
        action: action,
        configuration: configuration,
    };
    for (let item of args) {
        let u;
        if (item === null || item === void 0 ? void 0 : item.fsPath) {
            items.push(item.fsPath.toString());
        }
        else if (item === null || item === void 0 ? void 0 : item.resourceUri) {
            items.push(item.resourceUri.toString());
        }
        else {
            items.push(item);
        }
    }
    return wrapCommandWithProgress(exports.COMMAND_PREFIX + '.project.run.action', title, log, showOutput, actionParams, ...items);
}
function wrapCommandWithProgress(lsCommand, title, log, showOutput, ...args) {
    return vscode_1.window.withProgress({ location: vscode_1.ProgressLocation.Window }, p => {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let c = yield client;
            const commands = yield vscode.commands.getCommands();
            if (commands.includes(lsCommand)) {
                p.report({ message: title });
                c.outputChannel.show(true);
                const start = new Date().getTime();
                try {
                    if (log) {
                        handleLog(log, `starting ${lsCommand}`);
                    }
                    const res = yield vscode.commands.executeCommand(lsCommand, ...args);
                    const elapsed = new Date().getTime() - start;
                    if (log) {
                        handleLog(log, `finished ${lsCommand} in ${elapsed} ms with result ${res}`);
                    }
                    const humanVisibleDelay = elapsed < 1000 ? 1000 : 0;
                    setTimeout(() => {
                        if (res) {
                            resolve(res);
                        }
                        else {
                            if (log) {
                                handleLog(log, `Command ${lsCommand} takes too long to start`);
                            }
                            reject(res);
                        }
                    }, humanVisibleDelay);
                }
                catch (err) {
                    if (log) {
                        handleLog(log, `command ${lsCommand} executed with error: ${JSON.stringify(err)}`);
                    }
                }
            }
            else {
                reject(localiser_1.l10n.value("jdk.extension.progressBar.error_msg.cannotRun", { lsCommand: lsCommand, client: c }));
            }
        }));
    });
}
/**
 * Just a simple promise subclass, so I can test for the 'initial promise' value:
 * unlike all other promises, that must be fullfilled in order to e.g. properly stop the server or otherwise communicate with it,
 * the initial one needs to be largely ignored in the launching/mgmt code, BUT should be available to normal commands / features.
 */
class InitialPromise extends Promise {
    constructor(f) {
        super(f);
    }
}
function activate(context) {
    deactivated = false;
    let log = vscode.window.createOutputChannel(SERVER_NAME);
    var clientResolve;
    var clientReject;
    // establish a waitable Promise, export the callbacks so they can be called after activation.
    client = new InitialPromise((resolve, reject) => {
        clientResolve = resolve;
        clientReject = reject;
    });
    // find acceptable JDK and launch the Java part
    findJDK((specifiedJDK) => {
        let currentClusters = findClusters(context.extensionPath).sort();
        const dsSorter = (a, b) => {
            return (a.language || '').localeCompare(b.language || '')
                || (a.pattern || '').localeCompare(b.pattern || '')
                || (a.scheme || '').localeCompare(b.scheme || '');
        };
        let currentDocumentSelectors = collectDocumentSelectors().sort(dsSorter);
        context.subscriptions.push(vscode.extensions.onDidChange(() => {
            const newClusters = findClusters(context.extensionPath).sort();
            const newDocumentSelectors = collectDocumentSelectors().sort(dsSorter);
            if (newClusters.length !== currentClusters.length || newDocumentSelectors.length !== currentDocumentSelectors.length
                || newClusters.find((value, index) => value !== currentClusters[index]) || newDocumentSelectors.find((value, index) => value !== currentDocumentSelectors[index])) {
                currentClusters = newClusters;
                currentDocumentSelectors = newDocumentSelectors;
                activateWithJDK(specifiedJDK, context, log, true, clientResolve, clientReject);
            }
        }));
        activateWithJDK(specifiedJDK, context, log, true, clientResolve, clientReject);
    });
    //register debugger:
    let debugTrackerFactory = new NetBeansDebugAdapterTrackerFactory();
    context.subscriptions.push(vscode.debug.registerDebugAdapterTrackerFactory(exports.COMMAND_PREFIX, debugTrackerFactory));
    let configInitialProvider = new NetBeansConfigurationInitialProvider();
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider(exports.COMMAND_PREFIX, configInitialProvider, vscode.DebugConfigurationProviderTriggerKind.Initial));
    let configDynamicProvider = new NetBeansConfigurationDynamicProvider(context);
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider(exports.COMMAND_PREFIX, configDynamicProvider, vscode.DebugConfigurationProviderTriggerKind.Dynamic));
    let configResolver = new NetBeansConfigurationResolver();
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider(exports.COMMAND_PREFIX, configResolver));
    context.subscriptions.push(vscode.debug.onDidTerminateDebugSession(((session) => onDidTerminateSession(session))));
    let debugDescriptionFactory = new NetBeansDebugAdapterDescriptionFactory();
    context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory(exports.COMMAND_PREFIX, debugDescriptionFactory));
    // initialize Run Configuration
    (0, runConfiguration_1.initializeRunConfiguration)().then(initialized => {
        if (initialized) {
            context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider(exports.COMMAND_PREFIX, runConfiguration_1.runConfigurationProvider));
            context.subscriptions.push(vscode.window.registerTreeDataProvider('run-config', runConfiguration_1.runConfigurationNodeProvider));
            context.subscriptions.push(vscode.commands.registerCommand(exports.COMMAND_PREFIX + '.workspace.configureRunSettings', (...params) => {
                (0, runConfiguration_1.configureRunSettings)(context, params);
            }));
            vscode.commands.executeCommand('setContext', 'runConfigurationInitialized', true);
        }
    });
    // register commands
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.workspace.new', (ctx, template) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        let c = yield client;
        const commands = yield vscode.commands.getCommands();
        if (commands.includes(exports.COMMAND_PREFIX + '.new.from.template')) {
            const workspaces = vscode_1.workspace.workspaceFolders;
            if (!workspaces) {
                const userHomeDir = os.homedir();
                const folderPath = yield vscode.window.showInputBox({
                    prompt: localiser_1.l10n.value('jdk.workspace.new.prompt'),
                    value: `${userHomeDir}`
                });
                if (!(folderPath === null || folderPath === void 0 ? void 0 : folderPath.trim()))
                    return;
                if (!fs.existsSync(folderPath)) {
                    yield fs.promises.mkdir(folderPath);
                }
                const folderPathUri = vscode.Uri.file(folderPath);
                yield vscode.commands.executeCommand(exports.COMMAND_PREFIX + '.new.from.template', folderPathUri.toString());
                yield vscode.commands.executeCommand(`vscode.openFolder`, folderPathUri);
                return;
            }
            // first give the template (if present), then the context, and then the open-file hint in the case the context is not specific enough
            const params = [];
            if (typeof template === 'string') {
                params.push(template);
            }
            params.push((_a = contextUri(ctx)) === null || _a === void 0 ? void 0 : _a.toString(), (_d = (_c = (_b = vscode.window.activeTextEditor) === null || _b === void 0 ? void 0 : _b.document) === null || _c === void 0 ? void 0 : _c.uri) === null || _d === void 0 ? void 0 : _d.toString());
            const res = yield vscode.commands.executeCommand(exports.COMMAND_PREFIX + '.new.from.template', ...params);
            if (typeof res === 'string') {
                let newFile = vscode.Uri.parse(res);
                yield vscode.window.showTextDocument(newFile, { preview: false });
            }
            else if (Array.isArray(res)) {
                for (let r of res) {
                    if (typeof r === 'string') {
                        let newFile = vscode.Uri.parse(r);
                        yield vscode.window.showTextDocument(newFile, { preview: false });
                    }
                }
            }
        }
        else {
            throw localiser_1.l10n.value("jdk.extension.error_msg.doesntSupportNewTeamplate", { client: c });
        }
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.workspace.newproject', (ctx) => __awaiter(this, void 0, void 0, function* () {
        var _e;
        let c = yield client;
        const commands = yield vscode.commands.getCommands();
        if (commands.includes(exports.COMMAND_PREFIX + '.new.project')) {
            const res = yield vscode.commands.executeCommand(exports.COMMAND_PREFIX + '.new.project', (_e = contextUri(ctx)) === null || _e === void 0 ? void 0 : _e.toString());
            if (typeof res === 'string') {
                let newProject = vscode.Uri.parse(res);
                const OPEN_IN_NEW_WINDOW = localiser_1.l10n.value("jdk.extension.label.openInNewWindow");
                const ADD_TO_CURRENT_WORKSPACE = localiser_1.l10n.value("jdk.extension.label.addToWorkSpace");
                const value = yield vscode.window.showInformationMessage(localiser_1.l10n.value("jdk.extension.message.newProjectCreated"), OPEN_IN_NEW_WINDOW, ADD_TO_CURRENT_WORKSPACE);
                if (value === OPEN_IN_NEW_WINDOW) {
                    yield vscode.commands.executeCommand('vscode.openFolder', newProject, true);
                }
                else if (value === ADD_TO_CURRENT_WORKSPACE) {
                    vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0, undefined, { uri: newProject });
                }
            }
        }
        else {
            throw localiser_1.l10n.value("jdk.extension.error_msg.doesntSupportNewProject", { client: c });
        }
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.open.test', (ctx) => __awaiter(this, void 0, void 0, function* () {
        var e_1, _f;
        var _g, _h, _j;
        let c = yield client;
        const commands = yield vscode.commands.getCommands();
        if (commands.includes(exports.COMMAND_PREFIX + '.go.to.test')) {
            try {
                const res = yield vscode.commands.executeCommand(exports.COMMAND_PREFIX + '.go.to.test', (_g = contextUri(ctx)) === null || _g === void 0 ? void 0 : _g.toString());
                if ("errorMessage" in res) {
                    throw new Error(res.errorMessage);
                }
                (_h = res === null || res === void 0 ? void 0 : res.providerErrors) === null || _h === void 0 ? void 0 : _h.map((error) => {
                    if (error === null || error === void 0 ? void 0 : error.message) {
                        vscode.window.showErrorMessage(error.message);
                    }
                });
                if ((_j = res === null || res === void 0 ? void 0 : res.locations) === null || _j === void 0 ? void 0 : _j.length) {
                    if (res.locations.length === 1) {
                        const { file, offset } = res.locations[0];
                        const filePath = vscode.Uri.parse(file);
                        const editor = yield vscode.window.showTextDocument(filePath, { preview: false });
                        if (offset != -1) {
                            const pos = editor.document.positionAt(offset);
                            editor.selections = [new vscode.Selection(pos, pos)];
                            const range = new vscode.Range(pos, pos);
                            editor.revealRange(range);
                        }
                    }
                    else {
                        const namePathMapping = {};
                        res.locations.forEach((fp) => {
                            const fileName = path.basename(fp.file);
                            namePathMapping[fileName] = fp.file;
                        });
                        const selected = yield vscode_1.window.showQuickPick(Object.keys(namePathMapping), {
                            title: localiser_1.l10n.value("jdk.extension.fileSelector.label.selectFiles"),
                            placeHolder: localiser_1.l10n.value("jdk.extension.fileSelector.label.testFilesOrSourceFiles"),
                            canPickMany: true
                        });
                        if (selected) {
                            try {
                                for (var selected_1 = __asyncValues(selected), selected_1_1; selected_1_1 = yield selected_1.next(), !selected_1_1.done;) {
                                    const filePath = selected_1_1.value;
                                    let file = vscode.Uri.parse(filePath);
                                    yield vscode.window.showTextDocument(file, { preview: false });
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (selected_1_1 && !selected_1_1.done && (_f = selected_1.return)) yield _f.call(selected_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                        }
                        else {
                            vscode.window.showInformationMessage(localiser_1.l10n.value("jdk.extension.fileSelector.label.noFileSelected"));
                        }
                    }
                }
            }
            catch (err) {
                vscode.window.showInformationMessage((err === null || err === void 0 ? void 0 : err.message) || localiser_1.l10n.value("jdk.extension.fileSelector.label.noTestFound"));
            }
        }
        else {
            throw localiser_1.l10n.value("jdk.extension.error_msg.doesntSupportGoToTest", { client: c });
        }
    })));
    context.subscriptions.push(vscode.commands.registerCommand(exports.COMMAND_PREFIX + ".delete.cache", () => __awaiter(this, void 0, void 0, function* () {
        var _k;
        const storagePath = (_k = context.storageUri) === null || _k === void 0 ? void 0 : _k.fsPath;
        if (!storagePath) {
            vscode.window.showErrorMessage(localiser_1.l10n.value("jdk.extension.cache.error_msg.cannotFindWrkSpacePath"));
            return;
        }
        const userDir = path.join(storagePath, "userdir");
        if (userDir && fs.existsSync(userDir)) {
            const yes = localiser_1.l10n.value("jdk.extension.cache.label.confirmation.yes");
            const cancel = localiser_1.l10n.value("jdk.extension.cache.label.confirmation.cancel");
            const confirmation = yield vscode.window.showInformationMessage('Are you sure you want to delete cache for this workspace  and reload the window ?', yes, cancel);
            if (confirmation === yes) {
                const reloadWindowActionLabel = localiser_1.l10n.value("jdk.extension.cache.label.reloadWindow");
                try {
                    yield stopClient(client);
                    deactivated = true;
                    yield killNbProcess(false, log);
                    yield fs.promises.rmdir(userDir, { recursive: true });
                    yield vscode.window.showInformationMessage(localiser_1.l10n.value("jdk.extension.message.cacheDeleted"), reloadWindowActionLabel);
                }
                catch (err) {
                    yield vscode.window.showErrorMessage(localiser_1.l10n.value("jdk.extension.error_msg.cacheDeletionError"), reloadWindowActionLabel);
                }
                finally {
                    vscode.commands.executeCommand("workbench.action.reloadWindow");
                }
            }
        }
        else {
            vscode.window.showErrorMessage(localiser_1.l10n.value("jdk.extension.cache.message.noUserDir"));
        }
    })));
    context.subscriptions.push(vscode.commands.registerCommand(exports.COMMAND_PREFIX + ".download.jdk", () => __awaiter(this, void 0, void 0, function* () {
        const jdkDownloaderView = new view_1.JdkDownloaderView(log);
        jdkDownloaderView.createView();
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.workspace.compile', () => wrapCommandWithProgress(exports.COMMAND_PREFIX + '.build.workspace', localiser_1.l10n.value('jdk.extension.command.progress.compilingWorkSpace'), log, true)));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.workspace.clean', () => wrapCommandWithProgress(exports.COMMAND_PREFIX + '.clean.workspace', localiser_1.l10n.value('jdk.extension.command.progress.cleaningWorkSpace'), log, true)));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.project.compile', (args) => {
        wrapProjectActionWithProgress('build', undefined, localiser_1.l10n.value('jdk.extension.command.progress.compilingProject'), log, true, args);
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.project.clean', (args) => {
        wrapProjectActionWithProgress('clean', undefined, localiser_1.l10n.value('jdk.extension.command.progress.cleaningProject'), log, true, args);
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.open.type', () => {
        wrapCommandWithProgress(exports.COMMAND_PREFIX + '.quick.open', localiser_1.l10n.value('jdk.extension.command.progress.quickOpen'), log, true).then(() => {
            vscode_1.commands.executeCommand('workbench.action.focusActiveEditorGroup');
        });
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.java.goto.super.implementation', () => __awaiter(this, void 0, void 0, function* () {
        var _l;
        if (((_l = vscode_1.window.activeTextEditor) === null || _l === void 0 ? void 0 : _l.document.languageId) !== LANGUAGE_ID) {
            return;
        }
        const uri = vscode_1.window.activeTextEditor.document.uri;
        const position = vscode_1.window.activeTextEditor.selection.active;
        const locations = (yield vscode.commands.executeCommand(exports.COMMAND_PREFIX + '.java.super.implementation', uri.toString(), position)) || [];
        return vscode.commands.executeCommand('editor.action.goToLocations', vscode_1.window.activeTextEditor.document.uri, position, locations.map(location => new vscode.Location(vscode.Uri.parse(location.uri), new vscode.Range(location.range.start.line, location.range.start.character, location.range.end.line, location.range.end.character))), 'peek', localiser_1.l10n.value('jdk.extension.error_msg.noSuperImpl'));
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.rename.element.at', (offset) => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode_1.window.activeTextEditor;
        if (editor) {
            yield vscode_1.commands.executeCommand('editor.action.rename', [
                editor.document.uri,
                editor.document.positionAt(offset),
            ]);
        }
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.surround.with', (items) => __awaiter(this, void 0, void 0, function* () {
        const selected = yield vscode_1.window.showQuickPick(items, { placeHolder: localiser_1.l10n.value('jdk.extension.command.quickPick.placeholder.surroundWith') });
        if (selected) {
            if (selected.userData.edit) {
                const edit = yield (yield client).protocol2CodeConverter.asWorkspaceEdit(selected.userData.edit);
                yield vscode_1.workspace.applyEdit(edit);
                yield vscode_1.commands.executeCommand('workbench.action.focusActiveEditorGroup');
            }
            yield vscode_1.commands.executeCommand(selected.userData.command.command, ...(selected.userData.command.arguments || []));
        }
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.generate.code', (command, data) => __awaiter(this, void 0, void 0, function* () {
        const edit = yield vscode_1.commands.executeCommand(command, data);
        if (edit) {
            const wsEdit = yield (yield client).protocol2CodeConverter.asWorkspaceEdit(edit);
            yield vscode_1.workspace.applyEdit(wsEdit);
            yield vscode_1.commands.executeCommand('workbench.action.focusActiveEditorGroup');
        }
    })));
    function findRunConfiguration(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            // do not invoke debug start with no (jdk) configurations, as it would probably create an user prompt
            let cfg = vscode.workspace.getConfiguration("launch");
            let c = cfg.get('configurations');
            if (!Array.isArray(c)) {
                return undefined;
            }
            let f = c.filter((v) => v['type'] === exports.COMMAND_PREFIX);
            if (!f.length) {
                return undefined;
            }
            class P {
                resolveDebugConfigurationWithSubstitutedVariables(folder, debugConfiguration, token) {
                    this.config = debugConfiguration;
                    return undefined;
                }
            }
            let provider = new P();
            let d = vscode.debug.registerDebugConfigurationProvider(exports.COMMAND_PREFIX, provider);
            // let vscode to select a debug config
            return yield vscode.commands.executeCommand('workbench.action.debug.start', { config: {
                    type: exports.COMMAND_PREFIX,
                    mainClass: uri.toString()
                }, noDebug: true }).then((v) => {
                d.dispose();
                return provider.config;
            }, (err) => {
                d.dispose();
                return undefined;
            });
        });
    }
    const runDebug = (noDebug, testRun, uri, methodName, launchConfiguration, project = false) => __awaiter(this, void 0, void 0, function* () {
        const docUri = contextUri(uri);
        if (docUri) {
            // attempt to find the active configuration in the vsode launch settings; undefined if no config is there.
            let debugConfig = (yield findRunConfiguration(docUri)) || {
                type: exports.COMMAND_PREFIX,
                name: "Java Single Debug",
                request: "launch"
            };
            if (methodName) {
                debugConfig['methodName'] = methodName;
            }
            if (launchConfiguration == '') {
                if (debugConfig['launchConfiguration']) {
                    delete debugConfig['launchConfiguration'];
                }
            }
            else {
                debugConfig['launchConfiguration'] = launchConfiguration;
            }
            debugConfig['testRun'] = testRun;
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(docUri);
            if (project) {
                debugConfig['projectFile'] = docUri.toString();
                debugConfig['project'] = true;
            }
            else {
                debugConfig['mainClass'] = docUri.toString();
            }
            const debugOptions = {
                noDebug: noDebug,
            };
            const ret = yield vscode.debug.startDebugging(workspaceFolder, debugConfig, debugOptions);
            return ret ? new Promise((resolve) => {
                const listener = vscode.debug.onDidTerminateDebugSession(() => {
                    listener.dispose();
                    resolve(true);
                });
            }) : ret;
        }
    });
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.run.test', (uri, methodName, launchConfiguration) => __awaiter(this, void 0, void 0, function* () {
        yield runDebug(true, true, uri, methodName, launchConfiguration);
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.debug.test', (uri, methodName, launchConfiguration) => __awaiter(this, void 0, void 0, function* () {
        yield runDebug(false, true, uri, methodName, launchConfiguration);
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.run.single', (uri, methodName, launchConfiguration) => __awaiter(this, void 0, void 0, function* () {
        yield runDebug(true, false, uri, methodName, launchConfiguration);
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.debug.single', (uri, methodName, launchConfiguration) => __awaiter(this, void 0, void 0, function* () {
        yield runDebug(false, false, uri, methodName, launchConfiguration);
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.project.run', (node, launchConfiguration) => __awaiter(this, void 0, void 0, function* () {
        var _m;
        return runDebug(true, false, ((_m = contextUri(node)) === null || _m === void 0 ? void 0 : _m.toString()) || '', undefined, launchConfiguration, true);
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.project.debug', (node, launchConfiguration) => __awaiter(this, void 0, void 0, function* () {
        var _o;
        return runDebug(false, false, ((_o = contextUri(node)) === null || _o === void 0 ? void 0 : _o.toString()) || '', undefined, launchConfiguration, true);
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.project.test', (node, launchConfiguration) => __awaiter(this, void 0, void 0, function* () {
        var _p;
        return runDebug(true, true, ((_p = contextUri(node)) === null || _p === void 0 ? void 0 : _p.toString()) || '', undefined, launchConfiguration, true);
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.package.test', (uri, launchConfiguration) => __awaiter(this, void 0, void 0, function* () {
        yield runDebug(true, true, uri, undefined, launchConfiguration);
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.open.stacktrace', (uri, methodName, fileName, line) => __awaiter(this, void 0, void 0, function* () {
        const location = uri ? yield vscode_1.commands.executeCommand(exports.COMMAND_PREFIX + '.resolve.stacktrace.location', uri, methodName, fileName) : undefined;
        if (location) {
            const lNum = line - 1;
            vscode_1.window.showTextDocument(vscode.Uri.parse(location), { selection: new vscode.Range(new vscode.Position(lNum, 0), new vscode.Position(lNum, 0)) });
        }
        else {
            if (methodName) {
                const fqn = methodName.substring(0, methodName.lastIndexOf('.'));
                vscode_1.commands.executeCommand('workbench.action.quickOpen', '#' + fqn.substring(fqn.lastIndexOf('.') + 1));
            }
        }
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.workspace.symbols', (query) => __awaiter(this, void 0, void 0, function* () {
        var _q;
        const c = yield client;
        return (_q = (yield c.sendRequest("workspace/symbol", { "query": query }))) !== null && _q !== void 0 ? _q : [];
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.java.complete.abstract.methods', () => __awaiter(this, void 0, void 0, function* () {
        const active = vscode.window.activeTextEditor;
        if (active) {
            const position = new vscode.Position(active.selection.start.line, active.selection.start.character);
            yield vscode_1.commands.executeCommand(exports.COMMAND_PREFIX + '.java.implement.all.abstract.methods', active.document.uri.toString(), position);
        }
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.startup.condition', () => __awaiter(this, void 0, void 0, function* () {
        return client;
    })));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.addEventListener', (eventName, listener) => {
        let ls = listeners.get(eventName);
        if (!ls) {
            ls = [];
            listeners.set(eventName, ls);
        }
        ls.push(listener);
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand(exports.COMMAND_PREFIX + '.node.properties.edit', (node) => __awaiter(this, void 0, void 0, function* () { return yield propertiesView_1.PropertiesView.createOrShow(context, node, (yield client).findTreeViewService()); })));
    const archiveFileProvider = {
        provideTextDocumentContent: (uri, token) => __awaiter(this, void 0, void 0, function* () {
            return yield vscode_1.commands.executeCommand(exports.COMMAND_PREFIX + '.get.archive.file.content', uri.toString());
        })
    };
    context.subscriptions.push(vscode_1.workspace.registerTextDocumentContentProvider('jar', archiveFileProvider));
    context.subscriptions.push(vscode_1.workspace.registerTextDocumentContentProvider('nbjrt', archiveFileProvider));
    launchConfigurations.updateLaunchConfig();
    // register completions:
    launchConfigurations.registerCompletion(context);
    return Object.freeze({
        version: API_VERSION,
        apiVersion: API_VERSION
    });
}
exports.activate = activate;
/**
 * Pending maintenance (install) task, activations should be chained after it.
 */
let maintenance;
/**
 * Pending activation flag. Will be cleared when the process produces some message or fails.
 */
let activationPending = false;
function activateWithJDK(specifiedJDK, context, log, notifyKill, clientResolve, clientReject) {
    if (activationPending) {
        // do not activate more than once in parallel.
        handleLog(log, "Server activation requested repeatedly, ignoring...");
        return;
    }
    let oldClient = client;
    let setClient;
    client = new Promise((clientOK, clientErr) => {
        setClient = [
            function (c) {
                clientOK(c);
                if (clientResolve) {
                    clientResolve(c);
                }
            }, function (err) {
                clientErr(err);
                if (clientReject) {
                    clientReject(err);
                }
            }
        ];
        //setClient = [ clientOK, clientErr ];
    });
    const a = maintenance;
    vscode_1.commands.executeCommand('setContext', 'nbJdkReady', false);
    activationPending = true;
    // chain the restart after termination of the former process.
    if (a != null) {
        handleLog(log, "Server activation initiated while in maintenance mode, scheduling after maintenance");
        a.then(() => stopClient(oldClient)).then(() => killNbProcess(notifyKill, log)).then(() => {
            doActivateWithJDK(specifiedJDK, context, log, notifyKill, setClient);
        });
    }
    else {
        handleLog(log, "Initiating server activation");
        stopClient(oldClient).then(() => killNbProcess(notifyKill, log)).then(() => {
            doActivateWithJDK(specifiedJDK, context, log, notifyKill, setClient);
        });
    }
}
function killNbProcess(notifyKill, log, specProcess) {
    const p = nbProcess;
    handleLog(log, "Request to kill LSP server.");
    if (p && (!specProcess || specProcess == p)) {
        if (notifyKill) {
            vscode.window.setStatusBarMessage(localiser_1.l10n.value("jdk.extension.command.statusBar.message.restartingServer", { SERVER_NAME: SERVER_NAME }), 2000);
        }
        return new Promise((resolve, reject) => {
            nbProcess = null;
            p.on('close', function (code) {
                handleLog(log, "LSP server closed: " + p.pid);
                resolve();
            });
            handleLog(log, "Killing LSP server " + p.pid);
            if (!p.kill()) {
                reject("Cannot kill");
            }
        });
    }
    else {
        let msg = "Cannot kill: ";
        if (specProcess) {
            msg += "Requested kill on " + specProcess.pid + ", ";
        }
        handleLog(log, msg + "current process is " + (p ? p.pid : "None"));
        return new Promise((res, rej) => { res(); });
    }
}
/**
 * Attempts to determine if the Workbench is using dark-style color theme, so that NBLS
 * starts with some dark L&F for icon resource selection.
 */
function isDarkColorTheme() {
    var _a, _b, _c;
    const themeName = (_a = vscode_1.workspace.getConfiguration('workbench')) === null || _a === void 0 ? void 0 : _a.get('colorTheme');
    if (!themeName) {
        return false;
    }
    for (const ext of vscode.extensions.all) {
        const themeList = ((_b = ext.packageJSON) === null || _b === void 0 ? void 0 : _b.contributes) && ((_c = ext.packageJSON) === null || _c === void 0 ? void 0 : _c.contributes['themes']);
        if (!themeList) {
            continue;
        }
        let t;
        for (t of themeList) {
            if (t.id !== themeName) {
                continue;
            }
            const uiTheme = t.uiTheme;
            if (typeof (uiTheme) == 'string') {
                if (uiTheme.includes('-dark') || uiTheme.includes('-black')) {
                    return true;
                }
            }
        }
    }
    return false;
}
function isNbJavacDisabled() {
    var _a;
    return (_a = vscode_1.workspace.getConfiguration(exports.COMMAND_PREFIX)) === null || _a === void 0 ? void 0 : _a.get('advanced.disable.nbjavac');
}
function getProjectJDKHome() {
    var _a;
    return (_a = vscode_1.workspace.getConfiguration(exports.COMMAND_PREFIX)) === null || _a === void 0 ? void 0 : _a.get('project.jdkhome');
}
function doActivateWithJDK(specifiedJDK, context, log, notifyKill, setClient) {
    maintenance = null;
    let restartWithJDKLater = function restartLater(time, n) {
        handleLog(log, `Restart of ${SERVER_NAME} requested in ${(time / 1000)} s.`);
        setTimeout(() => {
            activateWithJDK(specifiedJDK, context, log, n);
        }, time);
    };
    const netbeansConfig = vscode_1.workspace.getConfiguration(exports.COMMAND_PREFIX);
    const beVerbose = netbeansConfig.get('verbose', false);
    let userdir = process.env['nbcode_userdir'] || netbeansConfig.get('userdir', 'local');
    switch (userdir) {
        case 'local':
            if (context.storagePath) {
                userdir = context.storagePath;
                break;
            }
        // fallthru
        case 'global':
            userdir = context.globalStoragePath;
            break;
        default:
        // assume storage is path on disk
    }
    let disableModules = [];
    let enableModules = [];
    if (isNbJavacDisabled()) {
        disableModules.push('org.netbeans.libs.nbjavacapi');
    }
    else {
        enableModules.push('org.netbeans.libs.nbjavacapi');
    }
    let projectSearchRoots = '';
    const isProjectFolderSearchLimited = !netbeansConfig.get('advanced.disable.projectSearchLimit', false);
    if (isProjectFolderSearchLimited) {
        try {
            projectSearchRoots = os.homedir();
        }
        catch (err) {
            handleLog(log, `Failed to obtain the user home directory due to: ${err}`);
        }
        if (!projectSearchRoots) {
            projectSearchRoots = os.type() === constants_1.NODE_WINDOWS_LABEL ? '%USERPROFILE%' : '$HOME'; // The launcher script may perform the env variable substitution
            handleLog(log, `Using userHomeDir = "${projectSearchRoots}" as the launcher script may perform env var substitution to get its value.`);
        }
        const workspaces = vscode_1.workspace.workspaceFolders;
        if (workspaces) {
            workspaces.forEach(workspace => {
                if (workspace.uri) {
                    try {
                        projectSearchRoots = projectSearchRoots + path.delimiter + path.normalize(workspace.uri.fsPath);
                    }
                    catch (err) {
                        handleLog(log, `Failed to get the workspace path: ${err}`);
                    }
                }
            });
        }
    }
    let info = {
        clusters: findClusters(context.extensionPath),
        extensionPath: context.extensionPath,
        storagePath: userdir,
        jdkHome: specifiedJDK,
        projectSearchRoots: projectSearchRoots,
        verbose: beVerbose,
        disableModules: disableModules,
        enableModules: enableModules,
    };
    const requiredJdk = specifiedJDK ? specifiedJDK : 'default system JDK';
    let launchMsg = localiser_1.l10n.value("jdk.extension.lspServer.statusBar.message.launching", {
        SERVER_NAME: SERVER_NAME,
        requiredJdk: requiredJdk,
        userdir: userdir
    });
    handleLog(log, launchMsg);
    vscode.window.setStatusBarMessage(launchMsg, 2000);
    let ideRunning = new Promise((resolve, reject) => {
        let stdOut = '';
        let stdErr = '';
        function logAndWaitForEnabled(text, isOut) {
            if (p == nbProcess) {
                activationPending = false;
            }
            handleLogNoNL(log, text);
            if (stdOut == null) {
                return;
            }
            if (isOut) {
                stdOut += text;
            }
            else {
                stdErr += text;
            }
            if (stdOut.match(/org.netbeans.modules.java.lsp.server/)) {
                resolve(text);
                stdOut = null;
            }
        }
        let extras = ["--modules", "--list", "-J-XX:PerfMaxStringConstLength=10240", "--locale", localiser_1.l10n.nbLocaleCode()];
        if (isDarkColorTheme()) {
            extras.push('--laf', 'com.formdev.flatlaf.FlatDarkLaf');
        }
        let serverVmOptions = vscode_1.workspace.getConfiguration(exports.COMMAND_PREFIX).get("serverVmOptions", []);
        extras.push(...serverVmOptions.map(el => `-J${el}`));
        let p = launcher.launch(info, ...extras);
        handleLog(log, "LSP server launching: " + p.pid);
        handleLog(log, "LSP server user directory: " + userdir);
        p.stdout.on('data', function (d) {
            logAndWaitForEnabled(d.toString(), true);
        });
        p.stderr.on('data', function (d) {
            logAndWaitForEnabled(d.toString(), false);
        });
        nbProcess = p;
        p.on('close', function (code) {
            if (p == nbProcess) {
                nbProcess = null;
            }
            if (p == nbProcess && code != 0 && code) {
                vscode.window.showWarningMessage(localiser_1.l10n.value("jdk.extension.lspServer.warning_message.serverExited", { SERVER_NAME: SERVER_NAME, code: code }));
            }
            if ((stdErr === null || stdErr === void 0 ? void 0 : stdErr.match(/Cannot find java/)) || (os.type() === constants_1.NODE_WINDOWS_LABEL && !deactivated)) {
                const downloadAndSetupActionLabel = localiser_1.l10n.value("jdk.extension.lspServer.label.downloadAndSetup");
                vscode.window.showInformationMessage(localiser_1.l10n.value("jdk.extension.lspServer.message.noJdkFound"), downloadAndSetupActionLabel).then(selection => {
                    if (selection === downloadAndSetupActionLabel) {
                        vscode_1.commands.executeCommand(`${exports.COMMAND_PREFIX}.download.jdk`);
                    }
                });
            }
            if (stdOut != null) {
                let match = stdOut.match(/org.netbeans.modules.java.lsp.server[^\n]*/);
                if ((match === null || match === void 0 ? void 0 : match.length) == 1) {
                    handleLog(log, match[0]);
                }
                else {
                    handleLog(log, "Cannot find org.netbeans.modules.java.lsp.server in the log!");
                }
                handleLog(log, `Please refer to troubleshooting section for more info: https://github.com/oracle/javavscode/blob/main/README.md#troubleshooting`);
                log.show(false);
                killNbProcess(false, log, p);
                reject(localiser_1.l10n.value("jdk.extension.error_msg.notEnabled", { SERVER_NAME }));
            }
            else {
                handleLog(log, "LSP server " + p.pid + " terminated with " + code);
                handleLog(log, "Exit code " + code);
            }
        });
    });
    ideRunning.then(() => {
        const connection = () => new Promise((resolve, reject) => {
            const srv = launcher.launch(info, `--start-java-language-server=listen-hash:0`, `--start-java-debug-adapter-server=listen-hash:0`);
            if (!srv) {
                reject();
            }
            else {
                if (!srv.stdout) {
                    reject(`No stdout to parse!`);
                    srv.disconnect();
                    return;
                }
                debugPort = -1;
                var lspServerStarted = false;
                srv.stdout.on("data", (chunk) => {
                    if (debugPort < 0) {
                        const info = chunk.toString().match(/Debug Server Adapter listening at port (\d*) with hash (.*)\n/);
                        if (info) {
                            debugPort = info[1];
                            debugHash = info[2];
                        }
                    }
                    if (!lspServerStarted) {
                        const info = chunk.toString().match(/Java Language Server listening at port (\d*) with hash (.*)\n/);
                        if (info) {
                            const port = info[1];
                            const server = net.connect(port, "127.0.0.1", () => {
                                server.write(info[2]);
                                resolve({
                                    reader: server,
                                    writer: server
                                });
                            });
                            lspServerStarted = true;
                        }
                    }
                });
                srv.once("error", (err) => {
                    reject(err);
                });
            }
        });
        const conf = vscode_1.workspace.getConfiguration();
        let documentSelectors = [
            { language: LANGUAGE_ID },
            { language: 'yaml', pattern: '**/{application,bootstrap}*.yml' },
            { language: 'properties', pattern: '**/{application,bootstrap}*.properties' },
            { language: 'jackpot-hint' },
            { language: 'xml', pattern: '**/pom.xml' },
            { pattern: '**/build.gradle' }
        ];
        documentSelectors.push(...collectDocumentSelectors());
        // Options to control the language client
        let clientOptions = {
            // Register the server for java documents
            documentSelector: documentSelectors,
            synchronize: {
                configurationSection: [
                    exports.COMMAND_PREFIX + '.hints',
                    exports.COMMAND_PREFIX + '.format',
                    exports.COMMAND_PREFIX + '.java.imports',
                    exports.COMMAND_PREFIX + '.project.jdkhome',
                    exports.COMMAND_PREFIX + '.runConfig.vmOptions',
                    exports.COMMAND_PREFIX + '.runConfig.cwd'
                ],
                fileEvents: [
                    vscode_1.workspace.createFileSystemWatcher('**/*.java')
                ]
            },
            outputChannel: log,
            revealOutputChannelOn: vscode_languageclient_1.RevealOutputChannelOn.Never,
            progressOnInitialization: true,
            initializationOptions: {
                'nbcodeCapabilities': {
                    'statusBarMessageSupport': true,
                    'testResultsSupport': true,
                    'showHtmlPageSupport': true,
                    'wantsJavaSupport': true,
                    'wantsGroovySupport': false,
                    'commandPrefix': exports.COMMAND_PREFIX,
                    'configurationPrefix': 'jdk.',
                    'altConfigurationPrefix': 'jdk.'
                }
            },
            errorHandler: {
                error: function (error, _message, count) {
                    return { action: vscode_languageclient_1.ErrorAction.Continue, message: error.message };
                },
                closed: function () {
                    handleLog(log, `Connection to ${SERVER_NAME} closed.`);
                    if (!activationPending) {
                        restartWithJDKLater(10000, false);
                    }
                    return { action: vscode_languageclient_1.CloseAction.DoNotRestart };
                }
            }
        };
        let c = new NbLanguageClient(NB_LANGUAGE_CLIENT_ID, 'Oracle Java SE', connection, log, clientOptions);
        handleLog(log, 'Language Client: Starting');
        c.start().then(() => {
            testAdapter = new testAdapter_1.NbTestAdapter();
            c.onNotification(protocol_1.StatusMessageRequest.type, showStatusBarMessage);
            c.onRequest(protocol_1.HtmlPageRequest.type, showHtmlPage);
            c.onRequest(protocol_1.ExecInHtmlPageRequest.type, execInHtmlPage);
            c.onNotification(vscode_languageclient_1.LogMessageNotification.type, (param) => handleLog(log, param.message));
            c.onRequest(protocol_1.QuickPickRequest.type, (param) => __awaiter(this, void 0, void 0, function* () {
                const selected = yield vscode_1.window.showQuickPick(param.items, { title: param.title, placeHolder: param.placeHolder, canPickMany: param.canPickMany, ignoreFocusOut: true });
                return selected ? Array.isArray(selected) ? selected : [selected] : undefined;
            }));
            c.onRequest(protocol_1.UpdateConfigurationRequest.type, (param) => __awaiter(this, void 0, void 0, function* () {
                handleLog(log, "Received config update: " + param.section + "." + param.key + "=" + param.value);
                let wsFile = vscode.workspace.workspaceFile;
                let wsConfig = vscode.workspace.getConfiguration(param.section);
                if (wsConfig) {
                    try {
                        wsConfig.update(param.key, param.value, wsFile ? null : true)
                            .then(() => {
                            handleLog(log, "Updated configuration: " + param.section + "." + param.key + "=" + param.value + "; in: " + (wsFile ? wsFile.toString() : "Global"));
                        })
                            .then(() => {
                            (0, runConfiguration_1.runConfigurationUpdateAll)();
                        });
                    }
                    catch (err) {
                        handleLog(log, "Failed to update configuration. Reason: " + (typeof err === "string" ? err : err instanceof Error ? err.message : "error"));
                    }
                }
            }));
            c.onRequest(protocol_1.SaveDocumentsRequest.type, (request) => __awaiter(this, void 0, void 0, function* () {
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
            }));
            c.onRequest(protocol_1.InputBoxRequest.type, (param) => __awaiter(this, void 0, void 0, function* () {
                return yield vscode_1.window.showInputBox({ title: param.title, prompt: param.prompt, value: param.value, password: param.password });
            }));
            c.onRequest(protocol_1.MutliStepInputRequest.type, (param) => __awaiter(this, void 0, void 0, function* () {
                const data = {};
                function nextStep(input, step, state) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const inputStep = yield c.sendRequest(protocol_1.MutliStepInputRequest.step, { inputId: param.id, step, data: state });
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
                                    return c.sendRequest(protocol_1.MutliStepInputRequest.validate, { inputId: param.id, step, data: d });
                                }
                            });
                            return (input) => nextStep(input, step + 1, state);
                        }
                    });
                }
                yield utils_1.MultiStepInput.run(input => nextStep(input, 1, data));
                return data;
            }));
            c.onNotification(protocol_1.TestProgressNotification.type, param => {
                if (testAdapter) {
                    testAdapter.testProgress(param.suite);
                }
            });
            let decorations = new Map();
            let decorationParamsByUri = new Map();
            c.onRequest(protocol_1.TextEditorDecorationCreateRequest.type, param => {
                let decorationType = vscode.window.createTextEditorDecorationType(param);
                decorations.set(decorationType.key, decorationType);
                return decorationType.key;
            });
            c.onNotification(protocol_1.TextEditorDecorationSetNotification.type, param => {
                let decorationType = decorations.get(param.key);
                if (decorationType) {
                    let editorsWithUri = vscode.window.visibleTextEditors.filter(editor => editor.document.uri.toString() == param.uri);
                    if (editorsWithUri.length > 0) {
                        editorsWithUri[0].setDecorations(decorationType, (0, protocol_1.asRanges)(param.ranges));
                        decorationParamsByUri.set(editorsWithUri[0].document.uri, param);
                    }
                }
            });
            let disposableListener = vscode.window.onDidChangeVisibleTextEditors(editors => {
                editors.forEach(editor => {
                    let decorationParams = decorationParamsByUri.get(editor.document.uri);
                    if (decorationParams) {
                        let decorationType = decorations.get(decorationParams.key);
                        if (decorationType) {
                            editor.setDecorations(decorationType, (0, protocol_1.asRanges)(decorationParams.ranges));
                        }
                    }
                });
            });
            context.subscriptions.push(disposableListener);
            c.onNotification(protocol_1.TextEditorDecorationDisposeNotification.type, param => {
                let decorationType = decorations.get(param);
                if (decorationType) {
                    decorations.delete(param);
                    decorationType.dispose();
                    decorationParamsByUri.forEach((value, key, map) => {
                        if (value.key == param) {
                            map.delete(key);
                        }
                    });
                }
            });
            c.onNotification(vscode_languageclient_1.TelemetryEventNotification.type, (param) => {
                const ls = listeners.get(param);
                if (ls) {
                    for (const listener of ls) {
                        vscode_1.commands.executeCommand(listener);
                    }
                }
            });
            handleLog(log, 'Language Client: Ready');
            setClient[0](c);
            vscode_1.commands.executeCommand('setContext', 'nbJdkReady', true);
            // create project explorer:
            //c.findTreeViewService().createView('foundProjects', 'Projects', { canSelectMany : false });
            createProjectView(context, c);
        }).catch(setClient[1]);
    }).catch((reason) => {
        activationPending = false;
        handleLog(log, reason);
        vscode_1.window.showErrorMessage(localiser_1.l10n.value("jdk.extension.lspServer.error_message", { reason: reason }));
    });
    function createProjectView(ctx, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const ts = client.findTreeViewService();
            let tv = yield ts.createView('foundProjects', 'Projects', { canSelectMany: false });
            function revealActiveEditor(ed) {
                var _a, _b;
                return __awaiter(this, void 0, void 0, function* () {
                    const uri = (_b = (_a = vscode_1.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.uri;
                    if (!uri || uri.scheme.toLowerCase() !== 'file') {
                        return;
                    }
                    if (!tv.visible) {
                        return;
                    }
                    let vis = yield ts.findPath(tv, uri.toString());
                    if (!vis) {
                        return;
                    }
                    tv.reveal(vis, { select: true, focus: false, expand: false });
                });
            }
            ctx.subscriptions.push(vscode_1.window.onDidChangeActiveTextEditor(ed => {
                const netbeansConfig = vscode_1.workspace.getConfiguration(exports.COMMAND_PREFIX);
                if (netbeansConfig.get("revealActiveInProjects")) {
                    revealActiveEditor(ed);
                }
            }));
            ctx.subscriptions.push(vscode.commands.registerCommand(exports.COMMAND_PREFIX + ".select.editor.projects", () => revealActiveEditor()));
            // attempt to reveal NOW:
            if (netbeansConfig.get("revealActiveInProjects")) {
                revealActiveEditor();
            }
        });
    }
    const webviews = new Map();
    function showHtmlPage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                let data = params.text;
                const match = /<title>(.*)<\/title>/i.exec(data);
                const name = match && match.length > 1 ? match[1] : '';
                const resourceDir = vscode.Uri.joinPath(context.globalStorageUri, params.id);
                vscode_1.workspace.fs.createDirectory(resourceDir);
                let view = vscode.window.createWebviewPanel('htmlView', name, vscode.ViewColumn.Beside, {
                    enableScripts: true,
                    localResourceRoots: [resourceDir, vscode.Uri.joinPath(context.extensionUri, 'node_modules', '@vscode/codicons', 'dist')]
                });
                webviews.set(params.id, view.webview);
                const resources = params.resources;
                if (resources) {
                    for (const resourceName in resources) {
                        const resourceText = resources[resourceName];
                        const resourceUri = vscode.Uri.joinPath(resourceDir, resourceName);
                        vscode_1.workspace.fs.writeFile(resourceUri, Buffer.from(resourceText, 'utf8'));
                        data = data.replace('href="' + resourceName + '"', 'href="' + view.webview.asWebviewUri(resourceUri) + '"');
                    }
                }
                const codiconsUri = view.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css'));
                view.webview.html = data.replace('href="codicon.css"', 'href="' + codiconsUri + '"');
                view.webview.onDidReceiveMessage(message => {
                    switch (message.command) {
                        case 'dispose':
                            webviews.delete(params.id);
                            view.dispose();
                            break;
                        case 'command':
                            vscode.commands.executeCommand(exports.COMMAND_PREFIX + '.htmlui.process.command', message.data);
                            break;
                    }
                });
                view.onDidDispose(() => {
                    resolve();
                    vscode_1.workspace.fs.delete(resourceDir, { recursive: true });
                });
            });
        });
    }
    function execInHtmlPage(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                const webview = webviews.get(params.id);
                if (webview) {
                    webview.postMessage({
                        execScript: params.text,
                        pause: params.pause
                    }).then(ret => {
                        resolve(ret);
                    });
                }
                resolve(false);
            });
        });
    }
    function showStatusBarMessage(params) {
        let decorated = params.message;
        let defTimeout;
        switch (params.type) {
            case vscode_languageclient_1.MessageType.Error:
                decorated = '$(error) ' + params.message;
                defTimeout = 0;
                checkInstallNbJavac(params.message);
                break;
            case vscode_languageclient_1.MessageType.Warning:
                decorated = '$(warning) ' + params.message;
                defTimeout = 0;
                break;
            default:
                defTimeout = 10000;
                break;
        }
        // params.timeout may be defined but 0 -> should be used
        const timeout = params.timeout != undefined ? params.timeout : defTimeout;
        if (timeout > 0) {
            vscode_1.window.setStatusBarMessage(decorated, timeout);
        }
        else {
            vscode_1.window.setStatusBarMessage(decorated);
        }
    }
    function checkInstallNbJavac(msg) {
        const NO_JAVA_SUPPORT = "Cannot initialize Java support";
        if (msg.startsWith(NO_JAVA_SUPPORT)) {
            if (isNbJavacDisabled()) {
                const message = localiser_1.l10n.value("jdk.extension.nbjavac.message.supportedVersionRequired");
                const enable = localiser_1.l10n.value("jdk.extension.nbjavac.label.enableNbjavac");
                const settings = localiser_1.l10n.value("jdk.extension.nbjavac.label.openSettings");
                vscode_1.window.showErrorMessage(message, enable, settings).then(reply => {
                    if (enable === reply) {
                        vscode_1.workspace.getConfiguration().update(exports.COMMAND_PREFIX + '.advanced.disable.nbjavac', false);
                    }
                    else if (settings === reply) {
                        vscode.commands.executeCommand('workbench.action.openSettings', exports.COMMAND_PREFIX + '.jdkhome');
                    }
                });
            }
            else {
                const yes = localiser_1.l10n.value("jdk.extension.javaSupport.label.installGpl");
                vscode_1.window.showErrorMessage(localiser_1.l10n.value("jdk.extension.javaSupport.message.needAdditionalSupport"), yes).then(reply => {
                    if (yes === reply) {
                        vscode.window.setStatusBarMessage(`Preparing ${SERVER_NAME} for additional installation`, 2000);
                        restartWithJDKLater = function () {
                            handleLog(log, `Ignoring request for restart of ${SERVER_NAME}`);
                        };
                        maintenance = new Promise((resolve, reject) => {
                            const kill = killNbProcess(false, log);
                            kill.then(() => {
                                let installProcess = launcher.launch(info, "-J-Dnetbeans.close=true", "--modules", "--install", ".*nbjavac.*");
                                handleLog(log, "Launching installation process: " + installProcess.pid);
                                let logData = function (d) {
                                    handleLogNoNL(log, d.toString());
                                };
                                installProcess.stdout.on('data', logData);
                                installProcess.stderr.on('data', logData);
                                installProcess.addListener("error", reject);
                                // MUST wait on 'close', since stdout is inherited by children. The installProcess dies but
                                // the inherited stream will be closed by the last child dying.
                                installProcess.on('close', function (code) {
                                    handleLog(log, "Installation completed: " + installProcess.pid);
                                    handleLog(log, "Additional Java Support installed with exit code " + code);
                                    // will be actually run after maintenance is resolve()d.
                                    activateWithJDK(specifiedJDK, context, log, notifyKill);
                                    resolve();
                                });
                                return installProcess;
                            });
                        });
                    }
                });
            }
        }
    }
}
function stopClient(clientPromise) {
    if (testAdapter) {
        testAdapter.dispose();
        testAdapter = undefined;
    }
    return clientPromise && !(clientPromise instanceof InitialPromise) ? clientPromise.then(c => c.stop()) : Promise.resolve();
}
function deactivate() {
    if (nbProcess != null) {
        nbProcess.kill();
    }
    return stopClient(client);
}
exports.deactivate = deactivate;
function collectDocumentSelectors() {
    const selectors = [];
    for (const extension of vscode.extensions.all) {
        const contributesSection = extension.packageJSON['contributes'];
        if (contributesSection) {
            const documentSelectors = contributesSection['netbeans.documentSelectors'];
            if (Array.isArray(documentSelectors) && documentSelectors.length) {
                selectors.push(...documentSelectors);
            }
        }
    }
    return selectors;
}
class NetBeansDebugAdapterTrackerFactory {
    createDebugAdapterTracker(_session) {
        return {
            onDidSendMessage(message) {
                if (testAdapter && message.type === 'event' && message.event === 'output') {
                    testAdapter.testOutput(message.body.output);
                }
            }
        };
    }
}
class NetBeansDebugAdapterDescriptionFactory {
    createDebugAdapterDescriptor(_session, _executable) {
        return new Promise((resolve, reject) => {
            let cnt = 10;
            const fnc = () => {
                if (debugPort < 0) {
                    if (cnt-- > 0) {
                        setTimeout(fnc, 1000);
                    }
                    else {
                        reject(new Error(localiser_1.l10n.value('jdk.extension.debugger.error_msg.debugAdapterNotInitialized')));
                    }
                }
                else {
                    // resolve(new vscode.DebugAdapterServer(debugPort));
                    const socket = net.connect(debugPort, "127.0.0.1", () => { });
                    socket.on("connect", () => {
                        const adapter = new streamDebugAdapter_1.StreamDebugAdapter();
                        socket.write(debugHash ? debugHash : "");
                        adapter.connect(socket, socket);
                        resolve(new vscode.DebugAdapterInlineImplementation(adapter));
                    });
                }
            };
            fnc();
        });
    }
}
class NetBeansConfigurationInitialProvider {
    provideDebugConfigurations(folder, token) {
        return this.doProvideDebugConfigurations(folder, token);
    }
    doProvideDebugConfigurations(folder, _token) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let c = yield client;
            if (!folder) {
                return [];
            }
            var u;
            if (folder && folder.uri) {
                u = folder.uri;
            }
            else {
                u = (_b = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.uri;
            }
            let result = [];
            const configNames = yield vscode.commands.executeCommand(exports.COMMAND_PREFIX + '.project.configurations', u === null || u === void 0 ? void 0 : u.toString());
            if (configNames) {
                let first = true;
                for (let cn of configNames) {
                    let cname;
                    if (first) {
                        // ignore the default config, comes first.
                        first = false;
                        continue;
                    }
                    else {
                        cname = "Launch Java: " + cn;
                    }
                    const debugConfig = {
                        name: cname,
                        type: exports.COMMAND_PREFIX,
                        request: "launch",
                        launchConfiguration: cn,
                    };
                    result.push(debugConfig);
                }
            }
            return result;
        });
    }
}
class NetBeansConfigurationDynamicProvider {
    constructor(context) {
        this.commandValues = new Map();
        this.context = context;
    }
    provideDebugConfigurations(folder, token) {
        return this.doProvideDebugConfigurations(folder, this.context, this.commandValues, token);
    }
    doProvideDebugConfigurations(folder, context, commandValues, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            let c = yield client;
            if (!folder) {
                return [];
            }
            let result = [];
            const attachConnectors = yield vscode.commands.executeCommand(exports.COMMAND_PREFIX + '.java.attachDebugger.configurations');
            if (attachConnectors) {
                for (let ac of attachConnectors) {
                    const debugConfig = {
                        name: ac.name,
                        type: ac.type,
                        request: "attach",
                    };
                    for (let i = 0; i < ac.arguments.length; i++) {
                        let defaultValue = ac.defaultValues[i];
                        if (!defaultValue.startsWith("${command:")) {
                            // Create a command that asks for the argument value:
                            let cmd = exports.COMMAND_PREFIX + ".java.attachDebugger.connector." + ac.id + "." + ac.arguments[i];
                            debugConfig[ac.arguments[i]] = "${command:" + cmd + "}";
                            if (!commandValues.has(cmd)) {
                                commandValues.set(cmd, ac.defaultValues[i]);
                                let description = ac.descriptions[i];
                                context.subscriptions.push(vscode_1.commands.registerCommand(cmd, (ctx) => __awaiter(this, void 0, void 0, function* () {
                                    return vscode.window.showInputBox({
                                        prompt: description,
                                        value: commandValues.get(cmd),
                                    }).then((value) => {
                                        if (value) {
                                            commandValues.set(cmd, value);
                                        }
                                        return value;
                                    });
                                })));
                            }
                        }
                        else {
                            debugConfig[ac.arguments[i]] = defaultValue;
                        }
                    }
                    result.push(debugConfig);
                }
            }
            return result;
        });
    }
}
class NetBeansConfigurationResolver {
    resolveDebugConfiguration(_folder, config, _token) {
        if (!config.type) {
            config.type = exports.COMMAND_PREFIX;
        }
        if (!config.request) {
            config.request = 'launch';
        }
        if (vscode.window.activeTextEditor) {
            config.file = '${file}';
        }
        if (!config.classPaths) {
            config.classPaths = ['any'];
        }
        if (!config.console) {
            config.console = 'internalConsole';
        }
        return config;
    }
}
function onDidTerminateSession(session) {
    const config = session.configuration;
    if (config.env) {
        const file = config.env["MICRONAUT_CONFIG_FILES"];
        if (file) {
            vscode.workspace.fs.delete(vscode.Uri.file(file));
        }
    }
}
//# sourceMappingURL=extension.js.map