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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JdkDownloaderAction = void 0;
const vscode_1 = require("vscode");
const view_1 = require("./view");
const constants_1 = require("../../constants");
const path = require("path");
const fs = require("fs");
const utils_1 = require("../../utils");
const cp = require("child_process");
const util_1 = require("util");
const localiser_1 = require("../../localiser");
const logger_1 = require("../../logger");
const handlers_1 = require("../../configurations/handlers");
const configuration_1 = require("../../configurations/configuration");
class JdkDownloaderAction {
    constructor(downloaderView) {
        this.downloaderView = downloaderView;
        this.DOWNLOAD_DIR = path.join(__dirname, 'jdk_downloads');
        this.attachListener = (message) => __awaiter(this, void 0, void 0, function* () {
            const { command, id, jdkVersion, jdkOS, jdkArch, installType } = message;
            if (command === view_1.JdkDownloaderView.DOWNLOAD_CMD_LABEL) {
                logger_1.LOGGER.log(`Request received for downloading ${id} version ${jdkVersion}`);
                this.jdkType = id;
                this.jdkVersion = jdkVersion;
                this.osType = jdkOS;
                this.machineArch = jdkArch;
                this.installType = installType;
                this.installationPath = yield this.getInstallationPathFromUser();
                logger_1.LOGGER.log(`Parameters set in JDK Downloader: 
                JDK Type: ${this.jdkType}, 
                JDK Version: ${this.jdkVersion}, 
                OS Type: ${this.osType}, 
                Machine Architecture: ${this.machineArch}, 
                Install Type: ${this.installType}, 
                Installation Path: ${this.installationPath}`);
                if (this.installationPath != null) {
                    this.startInstallation();
                }
                else {
                    vscode_1.window.showInformationMessage(localiser_1.l10n.value("jdk.downloader.message.noLocationSelected"));
                }
            }
        });
        this.getInstallationPathFromUser = () => __awaiter(this, void 0, void 0, function* () {
            const options = {
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: this.installType === JdkDownloaderAction.MANUAL_INSTALLATION_TYPE ?
                    localiser_1.l10n.value('jdk.downloader.label.selectJdk') :
                    localiser_1.l10n.value("jdk.downloader.label.installJdk")
            };
            const selectedFolders = yield vscode_1.window.showOpenDialog(options);
            if (selectedFolders && selectedFolders.length > 0) {
                return selectedFolders[0].fsPath;
            }
            return null;
        });
        this.startInstallation = () => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.installType === JdkDownloaderAction.MANUAL_INSTALLATION_TYPE) {
                    (0, handlers_1.updateConfigurationValue)(configuration_1.configKeys.jdkHome, this.installationPath, true);
                    yield this.installationCompletion();
                    logger_1.LOGGER.log(`manual JDK installation completed successfully`);
                    return;
                }
                yield this.jdkInstallationManager();
            }
            catch (err) {
                vscode_1.window.showErrorMessage(localiser_1.l10n.value("jdk.downloader.error_message.installingJDK", { error: err }));
                logger_1.LOGGER.error((err === null || err === void 0 ? void 0 : err.message) || "No Error message received");
            }
        });
        this.installationCompletion = () => __awaiter(this, void 0, void 0, function* () {
            let dialogBoxMessage;
            if (this.installType === JdkDownloaderAction.MANUAL_INSTALLATION_TYPE) {
                dialogBoxMessage = localiser_1.l10n.value("jdk.downloader.message.addedJdkPath");
            }
            else {
                dialogBoxMessage = localiser_1.l10n.value("jdk.downloader.message.completedInstallingJdk");
            }
            logger_1.LOGGER.log(`JDK installation completed successfully`);
            const reloadNow = localiser_1.l10n.value("jdk.downloader.message.reload");
            const selected = yield vscode_1.window.showInformationMessage(dialogBoxMessage, reloadNow);
            if (selected === reloadNow) {
                yield this.downloaderView.disposeView();
                yield vscode_1.commands.executeCommand('workbench.action.reloadWindow');
            }
        });
        this.jdkInstallationManager = () => __awaiter(this, void 0, void 0, function* () {
            const startingInstallationMessage = localiser_1.l10n.value("jdk.downloader.message.downloadingAndCompletingSetup", {
                jdkType: this.jdkType,
                jdkVersion: this.jdkVersion
            });
            vscode_1.window.showInformationMessage(startingInstallationMessage);
            this.downloadUrl = this.generateDownloadUrl();
            this.downloadFilePath = this.getDownloadLocation();
            if (!this.downloadUrl || !this.downloadFilePath) {
                throw new Error(localiser_1.l10n.value("jdk.downloader.error_message.generateDownloadUrl"));
            }
            yield this.downloadAndVerify();
            const downloadSuccessLabel = localiser_1.l10n.value("jdk.downloader.message.downloadCompleted", {
                jdkType: this.jdkType,
                jdkVersion: this.jdkVersion,
                osType: this.osType
            });
            vscode_1.window.showInformationMessage(downloadSuccessLabel);
            logger_1.LOGGER.log(`JDK downloaded successfully`);
            logger_1.LOGGER.log(`JDK installation starting...`);
            yield this.rmPreviousMatchingDownloads();
            yield this.extractJDK();
        });
        this.generateDownloadUrl = () => {
            let baseDownloadUrl = '';
            if (this.jdkType === view_1.JdkDownloaderView.OPEN_JDK_LABEL) {
                baseDownloadUrl = `${constants_1.jdkDownloaderConstants.OPEN_JDK_VERSION_DOWNLOAD_LINKS[`${this.jdkVersion}`]}_${this.osType.toLowerCase()}-${this.machineArch}_bin`;
            }
            else if (this.jdkType === view_1.JdkDownloaderView.ORACLE_JDK_LABEL) {
                baseDownloadUrl = `${constants_1.jdkDownloaderConstants.ORACLE_JDK_BASE_DOWNLOAD_URL}/${this.jdkVersion}/latest/jdk-${this.jdkVersion}_${this.osType.toLowerCase()}-${this.machineArch}_bin`;
            }
            const downloadUrl = this.osType === 'windows' ? `${baseDownloadUrl}.zip` : `${baseDownloadUrl}.tar.gz`;
            logger_1.LOGGER.log(`Downloading JDK from ${downloadUrl}`);
            return downloadUrl;
        };
        this.getDownloadLocation = () => {
            const baseFileName = `${this.jdkType}-${this.jdkVersion}_${this.osType}-${this.machineArch}_bin`;
            const newFileName = this.osType === 'windows' ? `${baseFileName}.zip` : `${baseFileName}.tar.gz`;
            if (!fs.existsSync(this.DOWNLOAD_DIR)) {
                fs.mkdirSync(this.DOWNLOAD_DIR);
            }
            const downloadLocation = path.join(this.DOWNLOAD_DIR, newFileName);
            logger_1.LOGGER.log(`Downloading JDK at ${downloadLocation}`);
            return downloadLocation;
        };
        this.downloadAndVerify = () => __awaiter(this, void 0, void 0, function* () {
            const message = localiser_1.l10n.value("jdk.downloader.message.downloadProgressBar", {
                jdkType: this.jdkType,
                jdkVersion: this.jdkVersion
            });
            yield (0, utils_1.downloadFileWithProgressBar)(this.downloadUrl, this.downloadFilePath, message);
            logger_1.LOGGER.log(`JDK downloaded successfully`);
            const doesMatch = yield this.checksumMatch();
            if (!doesMatch) {
                const checksumMatchFailedLabel = localiser_1.l10n.value("jdk.downloader.message.downloadFailed", {
                    jdkType: this.jdkType,
                    jdkVersion: this.jdkVersion,
                    osType: this.osType
                });
                throw new Error(checksumMatchFailedLabel);
            }
            logger_1.LOGGER.log(`Checksum match successful`);
        });
        this.checksumMatch = () => __awaiter(this, void 0, void 0, function* () {
            const checkSumObtained = yield (0, utils_1.calculateChecksum)(this.downloadFilePath);
            const checkSumExpected = yield (0, utils_1.httpsGet)(`${this.downloadUrl}.sha256`);
            return checkSumExpected === checkSumObtained;
        });
        this.rmPreviousMatchingDownloads = () => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            const matchingOldDirs = yield this.getMatchingDirs(this.jdkVersion);
            try {
                for (var matchingOldDirs_1 = __asyncValues(matchingOldDirs), matchingOldDirs_1_1; matchingOldDirs_1_1 = yield matchingOldDirs_1.next(), !matchingOldDirs_1_1.done;) {
                    const oldDirName = matchingOldDirs_1_1.value;
                    yield fs.promises.rmdir(path.join(this.DOWNLOAD_DIR, oldDirName), { recursive: true });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (matchingOldDirs_1_1 && !matchingOldDirs_1_1.done && (_a = matchingOldDirs_1.return)) yield _a.call(matchingOldDirs_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
        this.extractJDK = () => __awaiter(this, void 0, void 0, function* () {
            logger_1.LOGGER.log(`Extracting JDK...`);
            const extractCommand = `tar -xzf "${this.downloadFilePath}" -C "${this.DOWNLOAD_DIR}"`;
            const exec = (0, util_1.promisify)(cp.exec);
            try {
                yield exec(extractCommand);
                logger_1.LOGGER.log(`Extracting JDK successful`);
            }
            catch (err) {
                logger_1.LOGGER.error(`Error while extracting JDK: ${err.message}`);
                throw new Error(localiser_1.l10n.value("jdk.downloader.error_message.extractionError", {
                    jdkType: this.jdkType,
                    jdkVersion: this.jdkVersion
                }));
            }
            logger_1.LOGGER.log(`Copying JDK to installation path...`);
            yield this.copyJdkAndFinishInstallation();
            logger_1.LOGGER.log(`Copying JDK to installation path successful`);
        });
        this.copyJdkAndFinishInstallation = () => __awaiter(this, void 0, void 0, function* () {
            const matchingJdkDir = yield this.getMatchingDirs(this.jdkVersion);
            if (!(matchingJdkDir === null || matchingJdkDir === void 0 ? void 0 : matchingJdkDir.length)) {
                throw new Error(localiser_1.l10n.value("jdk.downloader.error_message.findDownloadedJDK", {
                    jdkVersion: this.jdkVersion
                }));
            }
            const tempDirectoryPath = path.join(this.DOWNLOAD_DIR, matchingJdkDir[0]);
            // If directory with same name is present in the user selected download location then ask user if they want to delete it or not? 
            const newDirName = `${this.jdkType.split(' ').join('_')}-${this.jdkVersion}`;
            const newDirectoryPath = yield this.handleJdkPaths(newDirName, this.installationPath, this.osType);
            if (newDirectoryPath === null) {
                throw new Error(localiser_1.l10n.value('jdk.downloader.error_message.jdkNewDirectoryIssueCannotInstall', {
                    jdkType: this.jdkType,
                    jdkVersion: this.jdkVersion,
                    newDirName
                }));
            }
            // If user agrees for deleting the directory then delete it and move the temp directory to the user selected location
            yield fs.promises.rename(tempDirectoryPath, newDirectoryPath);
            logger_1.LOGGER.log(`Copying extracted JDK at the installation path...`);
            logger_1.LOGGER.log(`Updating jdk.jdkhome settings...`);
            let binPath = newDirectoryPath;
            if (this.osType === 'macOS') {
                binPath = path.join(newDirectoryPath, 'Contents', 'Home');
            }
            (0, handlers_1.updateConfigurationValue)(configuration_1.configKeys.jdkHome, binPath, true);
            logger_1.LOGGER.log(`Finishing up installation...`);
            this.installationCleanup(tempDirectoryPath, newDirectoryPath);
        });
        this.installationCleanup = (tempDirPath, newDirPath) => {
            fs.unlink(this.downloadFilePath, (err) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    logger_1.LOGGER.error(`Error while installation cleanup: ${err.message}`);
                    vscode_1.window.showErrorMessage(localiser_1.l10n.value("jdk.downloader.error_message.installationCleanup"));
                }
                else {
                    if (tempDirPath && fs.existsSync(tempDirPath)) {
                        yield fs.promises.rmdir(tempDirPath, { recursive: true });
                    }
                    if (newDirPath !== null) {
                        yield this.installationCompletion();
                    }
                }
            }));
        };
        this.handleJdkPaths = (directoryName, parentPath, osType) => __awaiter(this, void 0, void 0, function* () {
            let name = directoryName;
            if (osType === 'macOS') {
                name = `${directoryName}.jdk`;
            }
            const directoryPath = path.join(parentPath, name);
            if (fs.existsSync(directoryPath)) {
                const CONFIRMATION_MESSAGE = localiser_1.l10n.value("jdk.downloader.message.confirmation.directoryExistsStillWantToDelete", {
                    name
                });
                const yesLabel = localiser_1.l10n.value("jdk.downloader.message.confirmation.yes");
                const noLabel = localiser_1.l10n.value("jdk.downloader.message.confirmation.no");
                const selected = yield vscode_1.window.showInformationMessage(CONFIRMATION_MESSAGE, yesLabel, noLabel);
                if (selected === yesLabel) {
                    yield fs.promises.rmdir(directoryPath, { recursive: true });
                }
                else if (selected === noLabel) {
                    return null;
                }
            }
            return directoryPath;
        });
        this.getMatchingDirs = (jdkVersion) => __awaiter(this, void 0, void 0, function* () {
            const dirs = yield fs.promises.readdir(this.DOWNLOAD_DIR);
            const matchingDirs = dirs.filter(file => file.startsWith(`jdk-${jdkVersion}`));
            return matchingDirs;
        });
    }
}
exports.JdkDownloaderAction = JdkDownloaderAction;
JdkDownloaderAction.MANUAL_INSTALLATION_TYPE = "manual";
JdkDownloaderAction.AUTO_INSTALLATION_TYPE = "automatic";
//# sourceMappingURL=action.js.map