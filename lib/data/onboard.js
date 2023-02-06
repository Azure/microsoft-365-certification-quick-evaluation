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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboard = void 0;
const axios_1 = __importDefault(require("axios"));
const endpoints_1 = require("../constants/endpoints");
const enum_1 = require("../constants/enum");
const network_1 = require("../utils/network");
function onboard(token, tenantId, subscriptionIds) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.post(endpoints_1.Endpoints.onboard, {
            subscriptionIds
        }, {
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
                "x-ms-client-tenant-id": tenantId,
                "x-ms-aad-user-token": token
            }
        });
        if (!(0, network_1.isResponseOk)(response.status)) {
            throw new Error(`onboard subscriptions request failed`);
        }
        const operationUrl = response.headers["azure-asyncoperation"];
        const operationRes = yield (0, network_1.pollUntilDone)(token, operationUrl);
        if (operationRes.status !== enum_1.AsyncStatus.SUCCEEDED) {
            throw new Error(`onboard failed, code: ${(_a = operationRes.error) === null || _a === void 0 ? void 0 : _a.code}, message: ${(_b = operationRes.error) === null || _b === void 0 ? void 0 : _b.message}`);
        }
    });
}
exports.onboard = onboard;
