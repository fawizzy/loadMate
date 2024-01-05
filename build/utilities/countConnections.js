"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConnectionClosed = exports.handleNewConnection = void 0;
const handleJSON_1 = require("./handleJSON");
// When a new connection is established
const handleNewConnection = (connectedserver) => {
    const filePath = `${__dirname}` + "/../config.json";
    const config = (0, handleJSON_1.readJsonFileSync)(filePath);
    const serverToUpdate = config.all_servers.find((server) => server.url == connectedserver.url);
    const healthyserverToUpdate = config.healthy_servers.find((server) => server.url == connectedserver.url);
    serverToUpdate.connections++;
    healthyserverToUpdate.connections++;
    (0, handleJSON_1.writeJsonFile)(filePath, config);
    // Redirect the request to the chosen server
};
exports.handleNewConnection = handleNewConnection;
// When a connection is closed
const handleConnectionClosed = (connectedserver) => {
    const filePath = `${__dirname}` + "/../config.json";
    const config = (0, handleJSON_1.readJsonFileSync)(filePath);
    const serverToUpdate = config.all_servers.find((server) => server.url == connectedserver.url);
    const healthyserverToUpdate = config.healthy_servers.find((server) => server.url == connectedserver.url);
    serverToUpdate.connections--;
    healthyserverToUpdate.connections--;
    (0, handleJSON_1.writeJsonFile)(filePath, config);
};
exports.handleConnectionClosed = handleConnectionClosed;
//# sourceMappingURL=countConnections.js.map