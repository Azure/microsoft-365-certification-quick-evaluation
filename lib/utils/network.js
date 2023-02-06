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
exports.pollUntilDone = exports.isResponseOk = void 0;
const axios_1 = __importDefault(require("axios"));
const enum_1 = require("../constants/enum");
function isResponseOk(status) {
    return status >= 200 && status <= 299;
}
exports.isResponseOk = isResponseOk;
const RETRY_AFTER = 2000;
const MAX_RETRY = 30;
function pollUntilDone(token, operationUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        let retryCnt = 0;
        const poll = (resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res = yield axios_1.default.get(operationUrl, {
                headers: {
                    "Authorization": token
                }
            });
            retryCnt++;
            const response = res.data;
            if (response.status === enum_1.AsyncStatus.SUCCEEDED || response.status === enum_1.AsyncStatus.FAILED || response.status === enum_1.AsyncStatus.CANCELED) {
                return resolve(response);
            }
            else if (retryCnt === MAX_RETRY) {
                return reject(response);
            }
            else {
                setTimeout(poll, RETRY_AFTER, resolve, reject);
            }
        });
        return new Promise(poll);
    });
}
exports.pollUntilDone = pollUntilDone;
