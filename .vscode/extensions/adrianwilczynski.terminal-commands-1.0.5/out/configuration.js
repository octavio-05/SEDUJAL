"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function getCommands() {
    return sanitizeConfiguration(getConfiguration());
}
exports.getCommands = getCommands;
function getConfiguration() {
    return vscode.workspace
        .getConfiguration()
        .get('runTerminalCommand.commands');
}
function sanitizeConfiguration(configuration) {
    if (!Array.isArray(configuration)) {
        return [];
    }
    return configuration
        .filter(c => isNotEmptyString(c.command))
        .map((c) => {
        const maybeCommand = c;
        return {
            command: maybeCommand.command,
            auto: !!maybeCommand.auto,
            preserve: !!maybeCommand.preserve,
            name: notEmptyStringOrUndefined(maybeCommand.name),
            group: notEmptyStringOrUndefined(maybeCommand.group)
        };
    });
}
function isNotEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
function notEmptyStringOrUndefined(value) {
    return isNotEmptyString(value) ? value.trim() : undefined;
}
//# sourceMappingURL=configuration.js.map