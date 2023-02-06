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
exports.getReport = exports.createOrUpdateReport = void 0;
function createOrUpdateReport(client, token, reportName, resourceIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const resources = resourceIds.map((resourceId) => {
            return { resourceId: resourceId, tags: {} };
        });
        const params = {
            properties: {
                resources,
                timeZone: "China Standard Time",
                triggerTime: new Date("2022-12-05T18:00:00.000Z")
            }
        };
        const options = {
            requestOptions: {
                customHeaders: {
                    "Authorization": token,
                    "x-ms-aad-user-token": token,
                    "Content-Type": "application/json"
                }
            }
        };
        const req = yield client.report.beginCreateOrUpdate(reportName, params, options);
        yield req.pollUntilDone();
    });
}
exports.createOrUpdateReport = createOrUpdateReport;
function getReport(client, token, reportName) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            requestOptions: {
                customHeaders: {
                    "Authorization": token,
                    "x-ms-aad-user-token": token,
                    "Content-Type": "application/json"
                }
            }
        };
        return yield client.report.get(reportName, options);
    });
}
exports.getReport = getReport;
