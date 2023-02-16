"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const core = __importStar(require("@actions/core"));
const arm_appcomplianceautomation_1 = require("@azure/arm-appcomplianceautomation");
const identity_1 = require("@azure/identity");
const deployment_1 = require("./data/deployment");
const onboard_1 = require("./data/onboard");
const report_1 = require("./data/report");
const triggerEvaluation_1 = require("./data/triggerEvaluation");
const common_1 = require("./utils/common");
const output_1 = require("./utils/output");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deploymentJson = core.getInput('deployment-ids');
            const reportName = core.getInput('report-name');
            if (!deploymentJson && !reportName) {
                throw new Error("Please configure deployment id or report name");
            }
            const cred = new identity_1.AzureCliCredential();
            const token = yield (0, common_1.getCredToken)(cred);
            const acatClient = new arm_appcomplianceautomation_1.AppComplianceAutomationToolForMicrosoft365(cred);
            let resourceIds = [];
            if (deploymentJson) {
                let deploymentIds = (0, common_1.tryParseJsonArray)(deploymentJson);
                resourceIds = yield (0, deployment_1.getResourceIdsByDeployments)(cred, deploymentIds);
            }
            else {
                const report = yield (0, report_1.getReport)(acatClient, token, reportName);
                resourceIds = report.properties.resources.map(meta => meta.resourceId);
            }
            const subscriptionIds = resourceIds.map(id => (0, common_1.getResourceSubscription)(id));
            yield (0, onboard_1.onboard)(token, subscriptionIds);
            yield (0, common_1.waitOnboardFinish)();
            core.info(`Successfully onboarded subscriptions`);
            if (reportName) {
                yield (0, report_1.createOrUpdateReport)(acatClient, token, reportName, resourceIds);
                core.info(`Successfully created or updated report ${reportName}`);
            }
            core.info("Generating quick assessments for all resources...");
            const results = yield (0, triggerEvaluation_1.triggerEvaluation)(token, resourceIds);
            (0, output_1.printAssessments)(results);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
start();
