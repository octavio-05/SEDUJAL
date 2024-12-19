"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientInit = void 0;
const launchOptions_1 = require("./launchOptions");
const logger_1 = require("../logger");
const configuration_1 = require("../configurations/configuration");
const utils_1 = require("./utils");
const net = require("net");
const handlers_1 = require("../configurations/handlers");
const nbcode_1 = require("./nbcode");
const nbLanguageClient_1 = require("./nbLanguageClient");
const listener_1 = require("../views/listener");
const register_1 = require("./listeners/notifications/register");
const register_2 = require("./listeners/requests/register");
const initializer_1 = require("../views/initializer");
const globalState_1 = require("../globalState");
const establishConnection = () => new Promise((resolve, reject) => {
    var _a;
    const nbProcessManager = globalState_1.globalState.getNbProcessManager();
    const nbProcess = nbProcessManager === null || nbProcessManager === void 0 ? void 0 : nbProcessManager.getProcess();
    if (!nbProcessManager || !nbProcess) {
        reject();
        return;
    }
    logger_1.LOGGER.log(`LSP server launching: ${nbProcessManager.getProcessId()}`);
    logger_1.LOGGER.log(`LSP server user directory: ${(0, launchOptions_1.getUserConfigLaunchOptionsDefaults)()[configuration_1.configKeys.userdir].value}`);
    try {
        (0, nbcode_1.attachNbProcessListeners)(nbProcessManager);
        connectToServer(nbProcess).then(server => resolve({
            reader: server,
            writer: server
        })).catch(err => { throw err; });
    }
    catch (err) {
        reject(err);
        (_a = globalState_1.globalState.getNbProcessManager()) === null || _a === void 0 ? void 0 : _a.disconnect();
        return;
    }
});
const connectToServer = (nbProcess) => {
    return new Promise((resolve, reject) => {
        if (!nbProcess.stdout) {
            reject('No stdout to parse!');
            return;
        }
        globalState_1.globalState.setDebugPort(-1);
        let lspServerStarted = false;
        nbProcess.stdout.on("data", (chunk) => {
            if (globalState_1.globalState.getDebugPort() < 0) {
                const info = chunk.toString().match(/Debug Server Adapter listening at port (\d*) with hash (.*)\n/);
                if (info) {
                    globalState_1.globalState.setDebugPort(info[1]);
                    globalState_1.globalState.setDebugHash(info[2]);
                }
            }
            if (!lspServerStarted) {
                const info = chunk.toString().match(/Java Language Server listening at port (\d*) with hash (.*)\n/);
                if (info) {
                    const port = info[1];
                    const server = net.connect(port, "127.0.0.1", () => {
                        server.write(info[2]);
                        resolve(server);
                    });
                    lspServerStarted = true;
                }
            }
        });
        nbProcess.once("error", (err) => {
            reject(err);
        });
    });
};
const enableDisableNbjavacModule = () => {
    const userdirPath = (0, launchOptions_1.getUserConfigLaunchOptionsDefaults)()[configuration_1.configKeys.userdir].value;
    const nbjavacValue = (0, handlers_1.isNbJavacDisabledHandler)();
    const extensionPath = globalState_1.globalState.getExtensionContextInfo().getExtensionStorageUri().fsPath;
    (0, utils_1.enableDisableModules)(extensionPath, userdirPath, ['org.netbeans.libs.nbjavacapi'], !nbjavacValue);
};
const serverBuilder = () => {
    enableDisableNbjavacModule();
    (0, nbcode_1.launchNbcode)();
    return establishConnection;
};
const clientInit = () => {
    globalState_1.globalState.setDeactivated(false);
    const connection = serverBuilder();
    const client = nbLanguageClient_1.NbLanguageClient.build(connection, logger_1.LOGGER);
    logger_1.LOGGER.log('Language Client: Starting');
    client.start().then(() => {
        (0, listener_1.registerListenersAfterClientInit)();
        (0, register_1.registerNotificationListeners)(client);
        (0, register_2.registerRequestListeners)(client);
        (0, initializer_1.createViews)();
        logger_1.LOGGER.log('Language Client: Ready');
        globalState_1.globalState.getClientPromise().initializedSuccessfully(client);
    }).catch(globalState_1.globalState.getClientPromise().setClient[1]);
};
exports.clientInit = clientInit;
//# sourceMappingURL=initializer.js.map