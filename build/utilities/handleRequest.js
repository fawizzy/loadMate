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
exports.requestAxios = exports.requestOperation = void 0;
const worker_threads_1 = require("worker_threads");
const axios_1 = require("axios");
const requestOperation = (url, method, data, server) => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, axios_1.default)({
            method,
            url: server,
            data,
        });
        resolve(response);
    }));
};
exports.requestOperation = requestOperation;
const requestAxios = ({ url, method, data, server }, concurrentWorkers) => __awaiter(void 0, void 0, void 0, function* () {
    const worker = new worker_threads_1.Worker("./src/worker.ts");
    const dataObj = { url, method, data, server };
    worker.postMessage(dataObj);
    return new Promise((resolve) => {
        worker.on("message", (data) => {
            resolve(data);
        });
    });
});
exports.requestAxios = requestAxios;
//# sourceMappingURL=handleRequest.js.map