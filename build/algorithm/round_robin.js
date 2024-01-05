"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundRobinLoadBalancer = void 0;
class RoundRobinLoadBalancer {
    constructor(servers) {
        if (servers.length === 0) {
            throw new Error("At least one server is required");
        }
        this.servers = servers;
        this.currentIndex = 0;
    }
    getNextServer() {
        const nextServer = this.servers[RoundRobinState.getCurrentIndex()];
        RoundRobinState.incrementIndex(this.servers.length);
        return nextServer;
    }
}
exports.RoundRobinLoadBalancer = RoundRobinLoadBalancer;
class RoundRobinState {
    static getCurrentIndex() {
        return RoundRobinState.currentIndex;
    }
    static incrementIndex(length) {
        RoundRobinState.currentIndex = (RoundRobinState.currentIndex + 1) % length;
    }
}
RoundRobinState.currentIndex = 0;
//# sourceMappingURL=round_robin.js.map