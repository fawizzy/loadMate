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
const axios_1 = require("axios");
const worker_threads_1 = require("worker_threads");
// Listen for messages from the parent thread
worker_threads_1.parentPort.on("message", ({ url, method, data, server }) => __awaiter(void 0, void 0, void 0, function* () {
    // Perform the request operation and send the response back to the parent thread
    const response = yield requestOperation(url, method, data, server);
    worker_threads_1.parentPort.postMessage(response["data"]);
}));
// Function to perform the request operation using axios
const requestOperation = (url, method, data, server) => {
    // Returning a Promise to handle the asynchronous nature of axios
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        // Make an HTTP request using axios
        const response = yield (0, axios_1.default)({
            method,
            url: server,
            data,
        });
        // Resolve the promise with the entire axios response
        resolve(response);
    }));
};
// Comments:
// 1. The 'parentPort.on' listens for messages from the parent thread.
// 2. The 'requestOperation' function performs the HTTP request using axios.
// 3. The response data is extracted and sent back to the parent thread using 'parentPort.postMessage'.
// 4. Note: The 'resolve' parameter of the Promise in 'requestOperation' is not explicitly used here but can be utilized if needed.
//# sourceMappingURL=worker.js.map