'use strict';
var vscode = require('vscode');
var appInsights = require("applicationinsights");
var AppInsightsClient = (function () {
    function AppInsightsClient() {
        this._client = appInsights.getClient("ee8f29f9-bc83-42d1-ab28-2762fe50dd31");
        var config = vscode.workspace.getConfiguration('terminal');
        this._enableAppInsights = config.get('enableAppInsights');
    }
    AppInsightsClient.prototype.sendEvent = function (eventName) {
        if (this._enableAppInsights) {
            this._client.trackEvent(eventName);
        }
    };
    return AppInsightsClient;
}());
exports.AppInsightsClient = AppInsightsClient;
//# sourceMappingURL=appInsightsClient.js.map