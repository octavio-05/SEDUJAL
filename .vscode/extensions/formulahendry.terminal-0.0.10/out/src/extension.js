'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var os = require('os');
var path = require('path');
var appInsightsClient_1 = require('./appInsightsClient');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "terminal" is now active!');
    var terminal = new Terminal();
    var run = vscode.commands.registerCommand('terminal.run', function () {
        terminal.run();
    });
    var stop = vscode.commands.registerCommand('terminal.stop', function () {
        terminal.stop();
    });
    var open = vscode.commands.registerCommand('terminal.open', function (fileUri) {
        terminal.open(fileUri);
    });
    var toggle = vscode.commands.registerCommand('terminal.toggle', function () {
        terminal.toggle();
    });
    context.subscriptions.push(run);
    context.subscriptions.push(stop);
    context.subscriptions.push(open);
    context.subscriptions.push(toggle);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
/**
 * Terminal
 */
var Terminal = (function () {
    function Terminal() {
        this._outputChannel = vscode.window.createOutputChannel('Terminal');
        this._outputChannel.appendLine('[Notice] This extension will have limited updates in the future, try Code Runner: https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner with more functions and supports!');
        this._outputChannel.appendLine('');
        this.createStatusBarItem();
        this._appInsightsClient = new appInsightsClient_1.AppInsightsClient();
    }
    Terminal.prototype.run = function () {
        this._appInsightsClient.sendEvent("run");
        if (this._isRunning) {
            vscode.window.showInformationMessage('Command(s) are already running!');
            return;
        }
        var commands = this.getCommands();
        if (commands.length == 0) {
            vscode.window.showInformationMessage('No commands found or selected.');
            return;
        }
        this._isRunning = true;
        this.ExecuteCommands(commands);
    };
    Terminal.prototype.stop = function () {
        this._appInsightsClient.sendEvent("stop");
        if (this._isRunning) {
            this._isRunning = false;
            var kill = require('tree-kill');
            kill(this._process.pid);
            this._outputChannel.appendLine('');
            this._outputChannel.appendLine('Command(s) stopped.');
        }
    };
    Terminal.prototype.open = function (fileUri) {
        var filePath;
        if (!fileUri || typeof fileUri.fsPath !== 'string') {
            var activeEditor = vscode.window.activeTextEditor;
            if (activeEditor && !activeEditor.document.isUntitled) {
                filePath = activeEditor.document.fileName;
            }
        }
        else {
            filePath = fileUri.fsPath;
        }
        this._appInsightsClient.sendEvent("open");
        var terminal = vscode.window.createTerminal();
        terminal.show(false);
        filePath = this.getFilePathForBashOnWindows(filePath);
        if (filePath) {
            terminal.sendText("cd \"" + path.dirname(filePath) + "\"");
        }
    };
    Terminal.prototype.toggle = function () {
        vscode.commands.executeCommand("workbench.action.terminal.toggleTerminal");
        this._appInsightsClient.sendEvent("toggle");
    };
    Terminal.prototype.getCommands = function () {
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return [];
        }
        var selection = editor.selection;
        var text = selection.isEmpty ? editor.document.getText() : editor.document.getText(selection);
        var commands = text.trim().split(/\s*[\r\n]+\s*/g).filter(this.filterEmptyString);
        return commands;
    };
    Terminal.prototype.filterEmptyString = function (value) {
        return value.length > 0;
    };
    Terminal.prototype.ExecuteCommands = function (commands) {
        this._outputChannel.show(true);
        this.ExecuteCommand(commands, 0);
    };
    Terminal.prototype.ExecuteCommand = function (commands, index) {
        var _this = this;
        if (index >= commands.length) {
            this._isRunning = false;
            return;
        }
        if (this._isRunning) {
            var exec = require('child_process').exec;
            this._outputChannel.appendLine('>> ' + commands[index]);
            this._process = exec(commands[index]);
            this._process.stdout.on('data', function (data) {
                _this._outputChannel.append(data);
            });
            this._process.stderr.on('data', function (data) {
                _this._outputChannel.append(data);
            });
            this._process.on('close', function (code) {
                _this._outputChannel.appendLine('');
                _this.ExecuteCommand(commands, index + 1);
            });
        }
    };
    Terminal.prototype.createStatusBarItem = function () {
        var toggleTerminalStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        toggleTerminalStatusBarItem.command = "terminal.toggle";
        toggleTerminalStatusBarItem.text = " $(terminal) ";
        toggleTerminalStatusBarItem.tooltip = "Toggle Integrated Terminal";
        toggleTerminalStatusBarItem.show();
    };
    Terminal.prototype.getFilePathForBashOnWindows = function (filePath) {
        if (os.platform() === 'win32') {
            var windowsShell = vscode.workspace.getConfiguration('terminal').get('integrated.shell.windows');
            if (windowsShell && windowsShell.toLowerCase().indexOf('bash') > -1 && windowsShell.toLowerCase().indexOf('windows') > -1) {
                filePath = filePath.replace(/([A-Za-z]):\\/, this.replacer).replace(/\\/g, '/');
            }
        }
        return filePath;
    };
    Terminal.prototype.replacer = function (match, p1) {
        return "/mnt/" + p1.toLowerCase() + "/";
    };
    return Terminal;
}());
//# sourceMappingURL=extension.js.map