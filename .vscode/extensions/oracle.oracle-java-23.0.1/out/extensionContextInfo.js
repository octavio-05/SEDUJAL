"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionContextInfo = void 0;
class ExtensionContextInfo {
    constructor(context) {
        this.context = context;
        this.getGlobalStorage = () => this.context.globalStorageUri;
        this.getWorkspaceStorage = () => this.context.storageUri;
        this.getExtensionStorageUri = () => this.context.extensionUri;
        this.getExtensionContext = () => this.context;
        this.pushSubscription = (listener) => this.context.subscriptions.push(listener);
    }
}
exports.ExtensionContextInfo = ExtensionContextInfo;
//# sourceMappingURL=extensionContextInfo.js.map