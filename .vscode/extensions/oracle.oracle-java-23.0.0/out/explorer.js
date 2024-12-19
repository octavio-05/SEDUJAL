"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTreeViewService = exports.createTreeView = exports.createViewProvider = exports.Visualizer = exports.TreeViewService = void 0;
/*
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
const vscode = require("vscode");
const vscode_1 = require("vscode");
const protocol_1 = require("./protocol");
const localiser_1 = require("./localiser");
const doLog = false;
const EmptyIcon = "EMPTY_ICON";
/**
 * Cached image information.
 */
class CachedImage {
    constructor(
    /**
     * Base URI of the image, if available.
     */
    baseUri, 
    /**
     * Icon URI as sent by the LSP server. Images translated to ThemeIcons have this field undefined.
     */
    iconUri, 
    /**
     * Local resource or theme icon.
     */
    icon, 
    /**
     * Additional matched values
     */
    values) {
        this.baseUri = baseUri;
        this.iconUri = iconUri;
        this.icon = icon;
        this.values = values;
    }
}
class ViewInfo {
    constructor(treeView, visProvider) {
        this.treeView = treeView;
        this.visProvider = visProvider;
    }
}
class TreeViewService extends vscode.Disposable {
    constructor(log, c, dd) {
        super(() => {
            this.disposeAllViews();
            for (const d of dd) {
                d === null || d === void 0 ? void 0 : d.dispose();
            }
        });
        this.trees = new Map();
        this.images = new Map();
        this.providers = new Map();
        this.entries = [];
        this.listeners = new Map();
        this.log = log;
        this.client = c;
        this.refreshImages();
        dd.push(vscode.extensions.onDidChange(() => this.refreshImages()));
    }
    getClient() {
        return this.client;
    }
    disposeAllViews() {
        var _a;
        for (let tree of this.trees.values()) {
            tree.visProvider.dispose();
            tree.treeView.dispose();
        }
        this.trees.clear();
        this.providers.clear();
        (_a = this.handler) === null || _a === void 0 ? void 0 : _a.dispose();
    }
    createView(id, title, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let tv = this.trees.get(id);
            if (tv) {
                return tv.treeView;
            }
            const res = yield createViewProvider(this.client, id);
            this.providers.set(res.getRoot().data.id, res);
            (_a = options === null || options === void 0 ? void 0 : options.providerInitializer) === null || _a === void 0 ? void 0 : _a.call(options, res);
            let opts = {
                treeDataProvider: res,
                canSelectMany: true,
                showCollapseAll: true,
            };
            if ((options === null || options === void 0 ? void 0 : options.canSelectMany) !== undefined) {
                opts.canSelectMany = options.canSelectMany;
            }
            if ((options === null || options === void 0 ? void 0 : options.showCollapseAll) !== undefined) {
                opts.showCollapseAll = options.showCollapseAll;
            }
            let view = vscode.window.createTreeView(id, opts);
            this.trees.set(id, new ViewInfo(view, res));
            // this will replace the handler over and over, but never mind
            this.handler = this.client.onNotification(protocol_1.NodeInfoNotification.type, params => this.nodeChanged(params));
            return view;
        });
    }
    removeListenerRegistration(key, data) {
        let a = this.listeners.get(key);
        if (!a) {
            return;
        }
        let index = a === null || a === void 0 ? void 0 : a.findIndex((x) => x === data);
        if (index !== undefined) {
            a === null || a === void 0 ? void 0 : a.splice(index, 1);
            if (!(a === null || a === void 0 ? void 0 : a.length)) {
                this.listeners.delete(key);
            }
        }
    }
    addNodeChangeListener(node, listener, ...types) {
        const listenerKey = node.rootId + ':' + (node.id || '');
        let a = this.listeners.get(listenerKey);
        if (a === undefined) {
            a = [];
            this.listeners.set(listenerKey, a);
        }
        const data = { types, listener };
        a.push(data);
        let success = false;
        const r = this.client.sendRequest(protocol_1.NodeInfoRequest.changes, { rootId: node.rootId, nodeId: Number(node.id), types });
        r.catch(() => {
            // remove the listener registration
            this.removeListenerRegistration(listenerKey, data);
        });
        return new vscode.Disposable(() => {
            this.removeListenerRegistration(listenerKey, data);
        });
    }
    nodeChanged(params) {
        var _a, _b, _c, _d, _e;
        let p = this.providers.get(params.rootId);
        if (!p) {
            return;
        }
        p.refresh(params);
        const key = params.rootId + ':' + (params.nodeId || '');
        const list = this.listeners.get(key);
        if (!list || !params.nodeId) {
            return;
        }
        const v = p.item(params.nodeId);
        if (!v) {
            return;
        }
        for (let { types, listener } of list) {
            if (!params.types) {
                // unspecified change
                (_a = listener.nodeChanged) === null || _a === void 0 ? void 0 : _a.call(listener, v);
                continue;
            }
            const filtered = params.types.filter((t) => !types || types.indexOf(t) != -1);
            if (filtered.includes(protocol_1.NodeChangeType.CHILDEN)) {
                (_b = listener.nodeChildrenChanged) === null || _b === void 0 ? void 0 : _b.call(listener, v);
            }
            if (filtered.includes(protocol_1.NodeChangeType.SELF)) {
                (_c = listener.nodeChanged) === null || _c === void 0 ? void 0 : _c.call(listener, v);
            }
            if (filtered.includes(protocol_1.NodeChangeType.DESTROY)) {
                (_d = listener.nodeDestroyed) === null || _d === void 0 ? void 0 : _d.call(listener, v);
            }
            if (filtered.includes(protocol_1.NodeChangeType.PROPERTY)) {
                (_e = listener.nodePropertiesChanged) === null || _e === void 0 ? void 0 : _e.call(listener, v, params.properties);
            }
        }
    }
    /**
     * Requests an image data from the LSP server.
     * @param nodeData
     * @returns icon specification or undefined
     */
    fetchImageUri(nodeData) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = this.imageUri(nodeData);
            if (res) {
                return res;
            }
            if (!(nodeData === null || nodeData === void 0 ? void 0 : nodeData.iconDescriptor)) {
                return undefined;
            }
            let ci;
            ci = this.images.get(nodeData.iconDescriptor.baseUri);
            if (ci != null) {
                return ci === null || ci === void 0 ? void 0 : ci.iconUri;
            }
            const p = {
                acceptEncoding: ['base64'],
                uri: nodeData.iconDescriptor.baseUri
            };
            let iconData = yield this.client.sendRequest(protocol_1.NodeInfoRequest.getresource, p);
            if (!(iconData === null || iconData === void 0 ? void 0 : iconData.content)) {
                return undefined;
            }
            let iconString = `data: ${iconData.contentType || 'image/png'};${iconData.encoding || 'base64'},${iconData.content}`;
            ci = new CachedImage(nodeData.iconDescriptor.baseUri, vscode.Uri.parse(iconString), undefined);
            this.images.set(nodeData.iconDescriptor.baseUri, ci);
            return ci.iconUri;
        });
    }
    imageUri(nodeData) {
        var _a;
        if (nodeData.id < 0) {
            return undefined;
        }
        let ci;
        if ((_a = nodeData.iconDescriptor) === null || _a === void 0 ? void 0 : _a.baseUri) {
            const r = this.findProductIcon(nodeData.iconDescriptor.baseUri, nodeData.name, nodeData.contextValue);
            // override the icon with local.
            if (r) {
                if (r === EmptyIcon) {
                    ci = new CachedImage(nodeData.iconDescriptor.baseUri, undefined, undefined, [nodeData.name, nodeData.contextValue]);
                }
                ci = new CachedImage(nodeData.iconDescriptor.baseUri, undefined, r, [nodeData.name, nodeData.contextValue]);
                this.images.set(nodeData.iconIndex, ci);
            }
        }
        if (!ci) {
            // hardcode visual vscode's File icons for regular files:
            if (nodeData.resourceUri && nodeData.contextValue.includes('is:file')) {
                const uri = nodeData.iconUri ? vscode.Uri.parse(nodeData.iconUri) : undefined;
                // do not cache
                return vscode_1.ThemeIcon.File;
            }
        }
        return (ci === null || ci === void 0 ? void 0 : ci.icon) ? ci.icon : ci === null || ci === void 0 ? void 0 : ci.iconUri;
    }
    setTranslations(entries) {
        this.entries = entries;
    }
    findProductIcon(res, ...values) {
        const s = res.toString();
        outer: for (let e of this.entries) {
            if (e.uriRegexp.test(s)) {
                if (e.valueRegexps) {
                    let s = " " + values.join(" ") + " ";
                    for (let vr of e.valueRegexps) {
                        if (!vr.test(s)) {
                            continue outer;
                        }
                    }
                }
                if (e.codeicon === '*file') {
                    return vscode_1.ThemeIcon.File;
                }
                else if (e.codeicon == '*folder') {
                    return vscode_1.ThemeIcon.Folder;
                }
                else if (e.codeicon == '') {
                    return EmptyIcon;
                }
                else if (e.iconPath) {
                    return e.iconPath;
                }
                let resultIcon;
                if (e.color) {
                    resultIcon = new vscode_1.ThemeIcon(e.codeicon, new vscode.ThemeColor(e.color));
                }
                else {
                    resultIcon = new vscode_1.ThemeIcon(e.codeicon);
                }
                return resultIcon;
            }
        }
        return undefined;
    }
    refreshImages() {
        var _a, _b;
        let newEntries = [];
        for (const ext of vscode.extensions.all) {
            const iconMapping = ((_a = ext.packageJSON) === null || _a === void 0 ? void 0 : _a.contributes) && ((_b = ext.packageJSON) === null || _b === void 0 ? void 0 : _b.contributes['netbeans.iconMapping']);
            if (Array.isArray(iconMapping)) {
                for (const m of iconMapping) {
                    const reString = m === null || m === void 0 ? void 0 : m.uriExpression;
                    if (reString) {
                        try {
                            let re = new RegExp(reString);
                            let vals = [];
                            if (m === null || m === void 0 ? void 0 : m.valueMatch) {
                                for (const vm of m.valueMatch) {
                                    const re = new RegExp(vm);
                                    vals.push(re);
                                }
                            }
                            newEntries.push(new ImageEntry(re, m === null || m === void 0 ? void 0 : m.codeicon, m === null || m === void 0 ? void 0 : m.iconPath, vals, m === null || m === void 0 ? void 0 : m.color));
                        }
                        catch (e) {
                            console.log("Invalid icon mapping in extension %s: %s -> %s", ext.id, reString, m === null || m === void 0 ? void 0 : m.codicon);
                        }
                    }
                }
            }
        }
        this.setTranslations(newEntries);
    }
    findPath(tree, selectData) {
        return __awaiter(this, void 0, void 0, function* () {
            let selected;
            for (let vinfo of this.trees.values()) {
                if (vinfo.treeView === tree) {
                    selected = vinfo;
                }
            }
            if (!selected) {
                return undefined;
            }
            return selected.visProvider.findTreeItem(selectData);
        });
    }
}
exports.TreeViewService = TreeViewService;
class VisualizerProvider extends vscode.Disposable {
    constructor(client, ts, log, id, rootData, uri) {
        super(() => this.disconnect());
        this.client = client;
        this.ts = ts;
        this.log = log;
        this.id = id;
        this.treeData = new Map();
        this.decorators = [];
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.delayedFire = new Set();
        this.root = new Visualizer(rootData.id, rootData.id, rootData, uri);
        this.treeData.set(rootData.id, this.root);
    }
    disconnect() {
        // nothing at the moment.
        for (let deco of this.decorators) {
            deco.dispose();
        }
    }
    item(id) {
        return this.treeData.get(id);
    }
    fireItemChange(item) {
        if (doLog) {
            this.log.appendLine(`Firing change on ${item === null || item === void 0 ? void 0 : item.idstring()}`);
        }
        if (!item || item == this.root) {
            this._onDidChangeTreeData.fire();
        }
        else {
            this._onDidChangeTreeData.fire(item);
        }
    }
    addItemDecorator(decoInstance) {
        this.decorators.push(decoInstance);
        const self = this;
        return new vscode.Disposable(() => {
            const idx = this.decorators.indexOf(decoInstance);
            if (idx > 0) {
                this.decorators.splice(idx, 1);
                decoInstance.dispose();
            }
        });
    }
    refresh(params) {
        if (this.root.data.id === params.rootId) {
            let v;
            if (this.root.data.id == params.nodeId || !params.nodeId) {
                v = this.root;
            }
            else {
                v = this.treeData.get(params.nodeId);
            }
            if (v) {
                if (this.delayedFire.has(v)) {
                    if (doLog) {
                        this.log.appendLine(`Delaying change on ${v.idstring()}`);
                    }
                    v.pendingChange = true;
                }
                else {
                    this.fireItemChange(v);
                }
            }
        }
    }
    findTreeItem(toSelect) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = yield this.client.sendRequest(protocol_1.NodeInfoRequest.findparams, {
                selectData: toSelect,
                rootNodeId: Number(this.root.id)
            });
            if (!path) {
                return;
            }
            let current = this.root;
            if (path.length > 1 && path[0] == Number(this.root.id)) {
                path.shift();
            }
            for (let nodeId of path) {
                let children;
                if (current.children) {
                    children = Array.from(current.children.values());
                }
                else {
                    children = yield this.getChildren(current);
                }
                if (!children) {
                    return undefined;
                }
                let selected = null;
                for (let c of children) {
                    if (c.id == String(nodeId)) {
                        selected = c;
                        break;
                    }
                }
                if (!selected) {
                    return undefined;
                }
                current = selected;
            }
            return current;
        });
    }
    getRoot() {
        return this.root.copy();
    }
    getParent(element) {
        // rely on that children was called first
        return element.parent;
    }
    getTreeItem(element) {
        const n = Number(element.id);
        const self = this;
        if (doLog) {
            this.log.appendLine(`Doing getTreeItem on ${element.idstring()}`);
        }
        return this.wrap((arr) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const pn = Number((_a = element.parent) === null || _a === void 0 ? void 0 : _a.id) || -1;
            let fetched = yield this.queryVisualizer(element, arr, () => this.fetchItem(pn, n));
            let origin;
            if (fetched) {
                element.update(fetched);
                origin = yield self.getTreeItem2(fetched);
            }
            else {
                // fire a change, this was unexpected
                const pn = Number((_b = element.parent) === null || _b === void 0 ? void 0 : _b.id) || -1;
                let pv = this.treeData.get(pn);
                if (pv) {
                    this.fireItemChange(pv);
                }
                origin = element;
            }
            let ti = new vscode.TreeItem(origin.label || "", origin.collapsibleState);
            // See #4113 -- vscode broke icons display, if resourceUri is defined in TreeItem. We're OK with files,
            // but folders can have a semantic icon, so let hide resourceUri from vscode for folders.
            ti.command = origin.command;
            ti.contextValue = origin.contextValue;
            ti.description = origin.description;
            ti.iconPath = origin.iconPath;
            ti.id = origin.id;
            ti.label = origin.label;
            ti.tooltip = origin.tooltip;
            ti.accessibilityInformation = origin.accessibilityInformation;
            if (origin.resourceUri) {
                if (!origin.resourceUri.toString().endsWith("/")) {
                    ti.resourceUri = origin.resourceUri;
                }
            }
            return ti;
        }));
    }
    /**
     * Wraps code that queries individual Visualizers so that blocked changes are fired after
     * the code terminated.
     *
     * Usage:
     * wrap(() => { ... code ... ; queryVisualizer(vis, () => { ... })});
     * @param fn the code to execute
     * @returns value of the code function
     */
    wrap(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            let arr = [];
            try {
                return yield fn(arr);
            }
            finally {
                this.releaseVisualizersAndFire(arr);
            }
        });
    }
    /**
     * Just creates a string list from visualizer IDs. Diagnostics only.
     */
    visualizerList(arr) {
        let s = "";
        for (let v of arr) {
            s += v.idstring() + " ";
        }
        return s;
    }
    /**
     * Do not use directly, use wrap(). Fires delayed events for visualizers that have no pending queries.
     */
    releaseVisualizersAndFire(list) {
        var _a;
        if (!list) {
            list = Array.from(this.delayedFire);
        }
        if (doLog) {
            this.log.appendLine(`Done with ${this.visualizerList(list)}`);
        }
        // v can be in list several times, each push increased its counter, so we need to decrease it.
        for (let v of list) {
            if (((_a = this.treeData) === null || _a === void 0 ? void 0 : _a.get(Number(v.id || -1))) === v) {
                if (--v.pendingQueries) {
                    if (doLog) {
                        this.log.appendLine(`${v.idstring()} has pending ${v.pendingQueries} queries`);
                    }
                    continue;
                }
                if (v.pendingChange) {
                    if (doLog) {
                        this.log.appendLine(`Fire delayed change on ${v.idstring()}`);
                    }
                    this.fireItemChange(v);
                    v.pendingChange = false;
                }
            }
            this.delayedFire.delete(v);
        }
        if (doLog) {
            this.log.appendLine("Pending queue: " + this.visualizerList(Array.from(this.delayedFire)));
            this.log.appendLine("---------------");
        }
    }
    /**
     * Should wrap calls to NBLS for individual visualizers (info, children). Puts visualizer on the delayed fire list.
     * Must be itself wrapped in wrap() -- wrap(... queryVisualizer()).
     * @param element visualizer to be queried, possibly undefined (new item is expected)
     * @param fn code to execute
     * @returns code's result
     */
    queryVisualizer(element, pending, fn) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!element) {
                return fn();
            }
            this.delayedFire.add(element);
            pending.push(element);
            element.pendingQueries++;
            if (doLog) {
                this.log.appendLine(`Delaying visualizer ${element.idstring()}, queries = ${element.pendingQueries}`);
            }
            return fn();
        });
    }
    getTreeItem2(element) {
        return __awaiter(this, void 0, void 0, function* () {
            const n = Number(element.id);
            if (this.decorators.length == 0) {
                return element;
            }
            let list = [...this.decorators];
            function f(item) {
                return __awaiter(this, void 0, void 0, function* () {
                    const deco = list.shift();
                    if (!deco) {
                        return item;
                    }
                    const decorated = deco.decorateTreeItem(element, item);
                    if (decorated instanceof vscode.TreeItem) {
                        return f(decorated);
                    }
                    else {
                        return decorated.then(f);
                    }
                });
            }
            return f(element.copy());
        });
    }
    fetchItem(parent, n) {
        return __awaiter(this, void 0, void 0, function* () {
            let d = yield this.client.sendRequest(protocol_1.NodeInfoRequest.info, { nodeId: n });
            if (!d || (d === null || d === void 0 ? void 0 : d.id) < 0) {
                return undefined;
            }
            let iconUri = yield this.ts.fetchImageUri(d);
            let v = new Visualizer(this.root.data.id, n, d, iconUri);
            if (d.command) {
                // PENDING: provide an API to register command (+ parameters) -> command translators.
                if (d.command === 'vscode.open') {
                    v.command = { command: d.command, title: '', arguments: [v.resourceUri] };
                }
                else {
                    v.command = { command: d.command, title: '', arguments: [v] };
                }
            }
            return v;
        });
    }
    getChildren(e) {
        const self = this;
        if (doLog) {
            this.log.appendLine(`Doing getChildren on ${e === null || e === void 0 ? void 0 : e.idstring()}`);
        }
        let decos = [...this.decorators];
        const parent = e || this.root;
        function collectResults(list, arr, element) {
            return __awaiter(this, void 0, void 0, function* () {
                let res = [];
                let now;
                const pn = Number(element.id) || -1;
                for (let i = 0; i < arr.length; i++) {
                    const old = self.treeData.get(arr[i]);
                    let v = yield self.queryVisualizer(old, list, () => self.fetchItem(pn, arr[i]));
                    if (v) {
                        res.push(v);
                    }
                }
                if (decos.length > 0) {
                    function f(orig) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const deco = decos.shift();
                            if (!deco) {
                                return orig;
                            }
                            // decorateChildren(element: T, item : Visualizer, children: Visualizer[]): Visualizer[] | Thenable<Visualizer[]>;
                            const decorated = deco.decorateChildren(parent, orig);
                            if (Array.isArray(decorated)) {
                                return f(decorated);
                            }
                            else {
                                return decorated.then(f);
                            }
                        });
                    }
                    res = yield f(res);
                }
                now = element.updateChildren(res, self);
                for (let i = 0; i < now.length; i++) {
                    const v = now[i];
                    const n = Number(v.id || -1);
                    self.treeData.set(n, v);
                    v.parent = element;
                }
                return now || [];
            });
        }
        return self.wrap((list) => self.queryVisualizer(e, list, () => {
            return this.client.sendRequest(protocol_1.NodeInfoRequest.children, { nodeId: parent.data.id }).then((arr) => __awaiter(this, void 0, void 0, function* () {
                return collectResults(list, arr, parent);
            }));
        }));
    }
    removeVisualizers(vis) {
        let ch = [];
        vis.forEach(a => {
            let v = this.treeData.get(a);
            if (v && v.children) {
                ch.push(...v.children.keys());
                this.treeData.delete(a);
            }
        });
        // cascade
        if (ch.length > 0) {
            this.removeVisualizers(ch);
        }
    }
}
let visualizerSerial = 1;
class Visualizer extends vscode.TreeItem {
    constructor(rootId, explicitId, data, image) {
        super(data.id < 0 ? "< obsolete >" : data.label, data.collapsibleState);
        this.rootId = rootId;
        this.data = data;
        this.image = image;
        this.pendingQueries = 0;
        this.pendingChange = false;
        this.parent = null;
        this.children = null;
        this.visId = visualizerSerial++;
        this.id = "" + explicitId;
        this.label = data.label;
        this.description = data.description;
        this.tooltip = data.tooltip;
        this.collapsibleState = data.collapsibleState;
        this.iconPath = image;
        if (data.resourceUri) {
            this.resourceUri = vscode.Uri.parse(data.resourceUri);
        }
        this.contextValue = data.contextValue;
    }
    copy() {
        let v = new Visualizer(this.rootId, Number(this.id), this.data, this.image);
        v.id = this.id;
        v.label = this.label;
        v.description = this.description;
        v.tooltip = this.tooltip;
        v.iconPath = this.iconPath;
        v.resourceUri = this.resourceUri;
        v.contextValue = this.contextValue;
        return v;
    }
    idstring() {
        return `[${this.id} : ${this.visId} - "${this.label}"]`;
    }
    update(other) {
        this.label = other.label;
        this.description = other.description;
        this.tooltip = other.tooltip;
        this.collapsibleState = other.collapsibleState;
        this.iconPath = other.iconPath;
        this.resourceUri = other.resourceUri;
        this.contextValue = other.contextValue;
        this.data = other.data;
        this.image = other.image;
        this.collapsibleState = other.collapsibleState;
        this.command = other.command;
        return this;
    }
    updateChildren(newChildren, provider) {
        var _a;
        let toRemove = [];
        let ch = new Map();
        for (let i = 0; i < newChildren.length; i++) {
            let c = newChildren[i];
            const n = Number(c.id || -1);
            const v = (_a = this.children) === null || _a === void 0 ? void 0 : _a.get(n);
            if (v) {
                v.update(c);
                newChildren[i] = c = v;
            }
            ch.set(n, c);
        }
        if (this.children) {
            for (let k of this.children.keys()) {
                if (!ch.get(k)) {
                    toRemove.push(k);
                }
            }
        }
        this.children = ch;
        if (toRemove.length) {
            provider.removeVisualizers(toRemove);
        }
        return newChildren;
    }
}
exports.Visualizer = Visualizer;
class ImageEntry {
    constructor(uriRegexp, codeicon, iconPath, valueRegexps, color) {
        this.uriRegexp = uriRegexp;
        this.codeicon = codeicon;
        this.iconPath = iconPath;
        this.valueRegexps = valueRegexps;
        this.color = color;
    }
}
class ImageTranslator {
    constructor() {
        this.entries = [];
    }
    setTranslations(entries) {
        this.entries = entries;
    }
    findProductIcon(res) {
        for (let e of this.entries) {
            if (e.uriRegexp.exec(res)) {
                return e.codeicon;
            }
        }
        return undefined;
    }
}
function createViewProvider(c, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const ts = c.findTreeViewService();
        const client = ts.getClient();
        const res = client.sendRequest(protocol_1.NodeInfoRequest.explorermanager, { explorerId: id }).then((node) => __awaiter(this, void 0, void 0, function* () {
            if (!node) {
                throw "Unsupported view: " + id;
            }
            return new VisualizerProvider(client, ts, ts.log, id, node, yield ts.fetchImageUri(node));
        }));
        if (!res) {
            throw "Unsupported view: " + id;
        }
        return res;
    });
}
exports.createViewProvider = createViewProvider;
/**
 * Creates a view of the specified type or returns an existing one. The View has to be registered in package.json in
 * some workspace position. Waits until the view service initializes.
 *
 * @param id view ID, consistent with package.json registration
 * @param viewTitle title for the new view, optional.
 * @returns promise of the tree view instance.
 */
function createTreeView(c, viewId, viewTitle, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let ts = c.findTreeViewService();
        return ts.createView(viewId, viewTitle, options);
    });
}
exports.createTreeView = createTreeView;
/**
 * Registers the treeview service with the language server.
 */
function createTreeViewService(log, c) {
    const d = vscode.commands.registerCommand("javals.foundProjects.deleteEntry", function (args) {
        return __awaiter(this, void 0, void 0, function* () {
            let v = args;
            let ok = yield c.sendRequest(protocol_1.NodeInfoRequest.destroy, { nodeId: v.data.id });
            if (!ok) {
                vscode.window.showErrorMessage(localiser_1.l10n.value("jdk.explorer.error_message.cannotDeleteNode", {
                    label: v.label
                }));
            }
        });
    });
    const ts = new TreeViewService(log, c, [d]);
    return ts;
}
exports.createTreeViewService = createTreeViewService;
//# sourceMappingURL=explorer.js.map