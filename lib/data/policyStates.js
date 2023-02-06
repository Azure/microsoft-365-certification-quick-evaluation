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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPolicyStates = void 0;
const core = __importStar(require("@actions/core"));
const arm_policyinsights_1 = require("@azure/arm-policyinsights");
const common_1 = require("../utils/common");
function getPolicyStates(cred, resourceIds) {
    var _a, e_1, _b, _c;
    var _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const subscriptionSet = new Set();
        for (const id of resourceIds) {
            const strs = id.split("/");
            if (strs.length < 3) {
                continue;
            }
            subscriptionSet.add(strs[2]);
        }
        const clients = Array.from(subscriptionSet).map(id => new arm_policyinsights_1.PolicyInsightsClient(cred, id));
        const triggerPromises = [];
        for (const client of clients) {
            const promise = client.policyStates.beginTriggerSubscriptionEvaluationAndWait(client.subscriptionId);
            triggerPromises.push(promise);
        }
        yield Promise.all(triggerPromises);
        core.info("Generating results...");
        const lowerCaseResourceIds = resourceIds.map(id => id.toLocaleLowerCase());
        for (const client of clients) {
            const iter = client.policyStates.listQueryResultsForSubscription("default", client.subscriptionId);
            try {
                for (var _f = true, iter_1 = (e_1 = void 0, __asyncValues(iter)), iter_1_1; iter_1_1 = yield iter_1.next(), _a = iter_1_1.done, !_a;) {
                    _c = iter_1_1.value;
                    _f = false;
                    try {
                        let policyState = _c;
                        const resourceId = (_d = policyState.resourceId) !== null && _d !== void 0 ? _d : "";
                        if ((0, common_1.isRealTimePolicy)((_e = policyState.policyDefinitionId) !== null && _e !== void 0 ? _e : "") &&
                            lowerCaseResourceIds.includes(resourceId.toLocaleLowerCase())) {
                            if (policyState.isCompliant) {
                                core.info(`Resource Id: ${resourceId}\tDefinition Id: ${policyState.policyDefinitionId}\tIs Compliant: ${policyState.isCompliant}`);
                            }
                            else {
                                core.error(`Resource Id: ${resourceId}\tDefinition Id: ${policyState.policyDefinitionId}\tIs Compliant: ${policyState.isCompliant}`);
                            }
                        }
                    }
                    finally {
                        _f = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = iter_1.return)) yield _b.call(iter_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    });
}
exports.getPolicyStates = getPolicyStates;
