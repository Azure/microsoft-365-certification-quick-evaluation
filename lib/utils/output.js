"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printAssessments = void 0;
const enum_1 = require("../constants/enum");
function printAssessments(results) {
    if (!results) {
        return;
    }
    for (const assessment of results.quickAssessments) {
        const msg = `Resource Id: ${assessment.resourceId}\tName: ${assessment.displayName}\tDescription: ${assessment.description}\tResponsibility Id: ${assessment.responsibilityId}\t`;
        if (assessment.resourceStatus === enum_1.ResourceStatus.HEALTHY) {
            console.log('\x1b[32m%s\x1b[0m', msg + "Compliant");
        }
        else {
            console.log('\x1b[31m%s\x1b[0m', msg + "Non-compliant");
        }
    }
}
exports.printAssessments = printAssessments;
