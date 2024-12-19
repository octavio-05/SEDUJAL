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
let previousTerminal;
function runCommand(command, cwd, resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const terminal = vscode.window.createTerminal({ cwd: cwd });
        terminal.show();
        ensureDisposed();
        const result = yield insertVariables(command.command, resource);
        terminal.sendText(result.command, command.auto && result.successful);
        if (!command.preserve) {
            previousTerminal = terminal;
        }
    });
}
exports.runCommand = runCommand;
function ensureDisposed() {
    if (previousTerminal) {
        previousTerminal.dispose();
        previousTerminal = undefined;
    }
}
function insertVariables(command, resource) {
    return __awaiter(this, void 0, void 0, function* () {
        const resourceResult = insertVariable(command, 'resource', resource);
        const clipboardResult = insertVariable(resourceResult.command, 'clipboard', yield vscode.env.clipboard.readText());
        return {
            command: clipboardResult.command,
            successful: resourceResult.successful && clipboardResult.successful
        };
    });
}
function insertVariable(command, variable, value) {
    let successful = true;
    const pattern = `{${variable}}`;
    if (new RegExp(pattern, 'i').test(command)) {
        command = command.replace(new RegExp(pattern, 'ig'), value || '');
        if (!value) {
            successful = false;
        }
    }
    return {
        command,
        successful
    };
}
//# sourceMappingURL=terminal.js.map