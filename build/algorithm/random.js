"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomLoadBalancer = void 0;
class RandomLoadBalancer {
    constructor(servers) {
        if (servers.length === 0) {
            throw new Error("At least one server is required");
        }
        this.servers = servers;
        this.currentIndex = 0;
    }
    getNextServer() {
        const nextServer = this.servers[this.currentIndex];
        this.currentIndex = Math.floor(Math.random() * 4) % this.servers.length;
        return nextServer;
    }
}
exports.RandomLoadBalancer = RandomLoadBalancer;
//# sourceMappingURL=random.js.map