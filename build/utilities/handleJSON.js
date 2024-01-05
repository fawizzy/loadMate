"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJsonFile = exports.readJsonFileSync = void 0;
const fs = require("fs");
const readJsonFileSync = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        console.error("Error reading JSON file:", error);
        throw error; // Re-throw the error for the calling code to handle
    }
};
exports.readJsonFileSync = readJsonFileSync;
const writeJsonFile = (filePath, data) => {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData, "utf8");
    }
    catch (error) {
        console.log(error);
    }
};
exports.writeJsonFile = writeJsonFile;
//# sourceMappingURL=handleJSON.js.map