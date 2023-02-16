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
exports.getResourceIdsByDeployments = exports.getResourceIdsByDeployment = void 0;
const arm_resources_1 = require("@azure/arm-resources");
const common_1 = require("../utils/common");
function getResourceIdsByDeployment(cred, deploymentId) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        const deploymentMeta = (0, common_1.getDeploymentMeta)(deploymentId);
        const subscriptionId = (_a = deploymentMeta.get("subscriptions")) !== null && _a !== void 0 ? _a : "";
        const resourceGroup = (_b = deploymentMeta.get("resourceGroups")) !== null && _b !== void 0 ? _b : "";
        const deploymentName = (_c = deploymentMeta.get("deployments")) !== null && _c !== void 0 ? _c : "";
        const depclient = new arm_resources_1.ResourceManagementClient(cred, subscriptionId);
        const deployment = yield depclient.deployments.get(resourceGroup, deploymentName);
        return (_f = (_e = (_d = deployment.properties) === null || _d === void 0 ? void 0 : _d.outputResources) === null || _e === void 0 ? void 0 : _e.map((resource) => {
            var _a;
            return (_a = resource.id) !== null && _a !== void 0 ? _a : "null";
        })) !== null && _f !== void 0 ? _f : [];
    });
}
exports.getResourceIdsByDeployment = getResourceIdsByDeployment;
function getResourceIdsByDeployments(cred, deploymentIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = deploymentIds.map((id) => __awaiter(this, void 0, void 0, function* () { return yield getResourceIdsByDeployment(cred, id); }));
        const allResources = yield Promise.all(promises);
        return [...new Set(allResources.flat())];
    });
}
exports.getResourceIdsByDeployments = getResourceIdsByDeployments;
