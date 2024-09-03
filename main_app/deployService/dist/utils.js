"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProject = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
function buildProject(id) {
    // returned a promise which is awaited 
    // the await will be over once this promise is resolved or rejected 
    return new Promise((resolve) => {
        var _a, _b;
        // us path gaye npm install and npm run build
        // exec build one child process
        const child = (0, child_process_1.exec)(`cd ${path_1.default.join(__dirname, `output/${id}`)} && npm install && npm run build`);
        // log us child process ka aa sakta hai
        // logs wahi node install wagera mein jo aata tha logs wahi yaha print
        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on('data', function (data) {
            console.log('stdout: ' + data);
        });
        (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on('data', function (data) {
            console.log('stderr: ' + data);
        });
        // child process work done and when child exited then resolve karo
        child.on('close', function (code) {
            resolve("");
        });
    });
}
exports.buildProject = buildProject;
