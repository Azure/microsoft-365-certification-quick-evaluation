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
exports.waitOnboardFinish = exports.tryParseJsonArray = exports.getDeploymentMeta = exports.getResourceSubscription = exports.getCredToken = void 0;
const promises_1 = require("timers/promises");
function getCredToken(cred) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = yield cred.getToken("https://management.azure.com//.default");
        return `Bearer ${token.token}`;
    });
}
exports.getCredToken = getCredToken;
function getResourceSubscription(resourceId) {
    const subStr = resourceId.split("/");
    return subStr.length >= 3 ? subStr[2] : "";
}
exports.getResourceSubscription = getResourceSubscription;
function getDeploymentMeta(deploymentId) {
    const tokens = deploymentId.split("/");
    const deploymentMeta = new Map();
    for (let i = 1; i < tokens.length - 1; i = i + 2) {
        deploymentMeta.set(tokens[i], tokens[i + 1]);
    }
    return deploymentMeta;
}
exports.getDeploymentMeta = getDeploymentMeta;
function tryParseJsonArray(jsonStr) {
    let jsonObj;
    //make sure input is valid json
    try {
        jsonObj = JSON.parse(jsonStr);
    }
    catch (error) {
        throw new Error(`Invalid json string in deployment ids "${jsonStr}", error message:${error.message}`);
    }
    if (!Array.isArray(jsonObj)) {
        throw new Error("Deployment ids should be an array");
    }
    if (jsonObj.length === 0) {
        throw new Error("Deployment ids should not be empty");
    }
    if (typeof jsonObj[0] !== "string") {
        throw new Error("Deployment ids should be an array of string");
    }
    return jsonObj;
}
exports.tryParseJsonArray = tryParseJsonArray;
function waitOnboardFinish() {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: replace with check dependency successfully created
        // wait for 30 seconds temporarily
        yield (0, promises_1.setTimeout)(30 * 1000);
    });
}
exports.waitOnboardFinish = waitOnboardFinish;
