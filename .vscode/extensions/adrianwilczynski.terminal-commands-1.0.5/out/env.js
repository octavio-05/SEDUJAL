"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
function getEnvironment(uri) {
    let cwd, resource;
    if (uri && uri.scheme === 'file') {
        const status = fs.lstatSync(uri.fsPath);
        if (status.isDirectory()) {
            cwd = uri.fsPath;
            resource = '.';
        }
        else if (status.isFile()) {
            cwd = path.dirname(uri.fsPath);
            resource = path.basename(uri.fsPath);
        }
    }
    return {
        cwd,
        resource
    };
}
exports.getEnvironment = getEnvironment;
//# sourceMappingURL=env.js.map