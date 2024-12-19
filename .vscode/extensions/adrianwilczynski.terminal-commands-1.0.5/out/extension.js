"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const configuration_1 = require("./configuration");
const pick_1 = require("./pick");
const env_1 = require("./env");
const terminal_1 = require("./terminal");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.runTerminalCommand', runTerminalCommand));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function runTerminalCommand(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        const commands = configuration_1.getCommands();
        const pickedCommand = yield pick_1.showCommandsPick(commands);
        if (!pickedCommand) {
            return;
        }
        const env = env_1.getEnvironment(uri || getOpenFileUri());
        terminal_1.runCommand(pickedCommand, env.cwd, env.resource);
    });
}
function getOpenFileUri() {
    if (vscode.window.activeTextEditor) {
        return vscode.window.activeTextEditor.document.uri;
    }
}
//# sourceMappingURL=extension.js.map