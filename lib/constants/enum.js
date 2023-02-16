"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceStatus = exports.AsyncStatus = void 0;
var AsyncStatus;
(function (AsyncStatus) {
    AsyncStatus["SUCCEEDED"] = "Succeeded";
    AsyncStatus["FAILED"] = "Failed";
    AsyncStatus["CANCELED"] = "Canceled";
    AsyncStatus["RUNNING"] = "Running";
})(AsyncStatus = exports.AsyncStatus || (exports.AsyncStatus = {}));
var ResourceStatus;
(function (ResourceStatus) {
    ResourceStatus["HEALTHY"] = "Healthy";
    ResourceStatus["UNHEALTHY"] = "Unhealthy";
})(ResourceStatus = exports.ResourceStatus || (exports.ResourceStatus = {}));
