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
function showCommandsPick(commands) {
    return __awaiter(this, void 0, void 0, function* () {
        const grouplessCommands = getGroupless(commands);
        const groups = getGroups(commands);
        const pickItems = getPickItems(grouplessCommands, groups);
        if (pickItems.length === 0) {
            return;
        }
        let picked = yield vscode.window.showQuickPick(pickItems, { matchOnDescription: true });
        if (!picked) {
            return;
        }
        if (picked.type === 'group' && picked.group) {
            picked = yield vscode.window.showQuickPick(getPickItems(getFromGroup(commands, picked.group)), { matchOnDescription: true });
        }
        if (!picked || picked.type !== 'command' || !picked.command) {
            return;
        }
        return picked.command;
    });
}
exports.showCommandsPick = showCommandsPick;
function getGroupless(commands) {
    return commands.filter(c => !c.group);
}
function getGroups(commands) {
    return distinct(commands
        .filter(c => !!c.group)
        .map(c => c.group));
}
function getFromGroup(commands, group) {
    return commands.filter(c => c.group === group);
}
function distinct(values) {
    return [...new Set(values)];
}
function getPickItems(commands, groups = []) {
    return [
        ...commands.map(c => {
            return {
                type: 'command',
                command: c,
                label: c.name || removeVariables(c.command).trim(),
                description: 'Command' + (c.name ? ` (${removeVariables(c.command).trim()})` : '')
            };
        }),
        ...groups.map(g => {
            return {
                type: 'group',
                group: g,
                label: g,
                description: 'Group'
            };
        })
    ];
}
function removeVariables(command) {
    return command.replace(/{\w+}/g, '');
}
//# sourceMappingURL=pick.js.map