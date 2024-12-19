"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalState = void 0;
class GlobalState {
    constructor() {
        this.initialized = false;
        this.listeners = new Map();
        this.debugPort = -1;
        this.deactivated = true;
        this.nbProcessManager = null;
        this.decorations = new Map();
        this.decorationParamsByUri = new Map();
    }
    initialize(extensionContextInfo, clientPromise) {
        if (this.initialized) {
            throw new Error('GlobalState has already been initialized');
        }
        this.clientPromise = clientPromise;
        this.extensionContextInfo = extensionContextInfo;
        this.initialized = true;
    }
    getListener(key) {
        return this.listeners.get(key);
    }
    getExtensionContextInfo() {
        return this.extensionContextInfo;
    }
    getClientPromise() {
        return this.clientPromise;
    }
    getDebugPort() {
        return this.debugPort;
    }
    getDebugHash() {
        return this.debugHash;
    }
    isDeactivated() {
        return this.deactivated;
    }
    getNbProcessManager() {
        return this.nbProcessManager;
    }
    getTestAdapter() {
        return this.testAdapter;
    }
    getDecoration(key) {
        return this.decorations.get(key);
    }
    getDecorationParamsByUri() {
        return this.decorationParamsByUri;
    }
    getDecorationParamsByUriByKey(key) {
        return this.decorationParamsByUri.get(key);
    }
    addListener(key, value) {
        const existing = this.listeners.get(key) || [];
        existing.push(value);
        this.listeners.set(key, existing);
    }
    setDebugPort(port) {
        this.debugPort = port;
    }
    setDebugHash(hash) {
        this.debugHash = hash;
    }
    setDeactivated(state) {
        this.deactivated = state;
    }
    setNbProcessManager(manager) {
        this.nbProcessManager = manager;
    }
    setTestAdapter(adapter) {
        this.testAdapter = adapter;
    }
    setDecoration(key, decoration) {
        this.decorations.set(key, decoration);
    }
    setDecorationParams(uri, params) {
        this.decorationParamsByUri.set(uri, params);
    }
    removeDecoration(key) {
        this.decorations.delete(key);
    }
    removeDecorationParams(uri) {
        this.decorationParamsByUri.delete(uri);
    }
}
exports.globalState = new GlobalState();
//# sourceMappingURL=globalState.js.map