"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeastConnectionLoadBalancer = void 0;
const handleJSON_1 = require("../utilities/handleJSON");
class LeastConnectionLoadBalancer {
    constructor(servers) {
        if (servers.length === 0) {
            throw new Error("At least one server is required");
        }
        this.currentIndex = 0;
    }
    getserverWithMinConnections() {
        try {
            const filePath = __dirname + "/../config.json";
            const config = (0, handleJSON_1.readJsonFileSync)(filePath);
            const servers = config["healthy_servers"];
            const serverWithMinConnections = servers.reduce((minServer, currentServer) => {
                return currentServer["connections"] < minServer["connections"]
                    ? currentServer
                    : minServer;
            });
            return serverWithMinConnections;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.LeastConnectionLoadBalancer = LeastConnectionLoadBalancer;
//# sourceMappingURL=least_connections.js.map