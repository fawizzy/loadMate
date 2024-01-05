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
const express = require("express");
const dotenv = require("dotenv");
const round_robin_1 = require("./algorithm/round_robin");
const random_1 = require("./algorithm/random");
const healthcheck_1 = require("./utilities/healthcheck");
const handleJSON_1 = require("./utilities/handleJSON");
const least_connections_1 = require("./algorithm/least_connections");
const worker_threads_1 = require("worker_threads");
dotenv.config();
const app = express();
const port = 3000;
const filePath = `${__dirname}/config.json`;
// Load initial server configuration
let config = (0, handleJSON_1.readJsonFileSync)(filePath);
// Initialize load balancers
let roundRobinLoadBalancer;
let randomLoadBalancer;
let leastConnectionLoadBalancer;
// Get initial healthy servers and update load balancers
checkAndInitLoadBalancers();
// Set up periodic health check and load balancer update
setInterval(checkAndInitLoadBalancers, 10000);
app.use(express.json());
// Route handling middleware
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const worker = new worker_threads_1.Worker("./src/worker.ts");
        config = (0, handleJSON_1.readJsonFileSync)(filePath);
        let server;
        // Choose load balancer based on configured algorithm
        switch (config["algorithm"]) {
            case "random":
                server = randomLoadBalancer.getNextServer();
                break;
            case "round_robin":
                server = roundRobinLoadBalancer.getNextServer();
                break;
            case "least_connections":
                server = leastConnectionLoadBalancer.getserverWithMinConnections();
                break;
            default:
                server = config["healthy_servers"][0];
                break;
        }
        // console.log(server);
        //  handleNewConnection(server);
        const { originalUrl: url, method, body: data } = req;
        worker.postMessage({ url, method, data, server: server.url });
        const response = new Promise((resolve) => {
            worker.on("message", (data) => {
                resolve(data);
            });
        });
        // const response = await requestAxios(
        //   { url, method, data, server: server.url },
        //   cpus().length
        // );
        res.send(response);
        // handleConnectionClosed(server);
    }
    catch (error) {
        next(error);
    }
}));
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
/**
 * Perform server health check and update load balancers
 */
function checkAndInitLoadBalancers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            config = (0, handleJSON_1.readJsonFileSync)(filePath);
            const healthyServers = yield (0, healthcheck_1.checkServerHealth)(config["all_servers"]);
            config["healthy_servers"] = sortServersById(healthyServers);
            // Update load balancers
            randomLoadBalancer = new random_1.RandomLoadBalancer(config["healthy_servers"]);
            roundRobinLoadBalancer = new round_robin_1.RoundRobinLoadBalancer(config["healthy_servers"]);
            leastConnectionLoadBalancer = new least_connections_1.LeastConnectionLoadBalancer(config["healthy_servers"]);
            (0, handleJSON_1.writeJsonFile)(filePath, config);
        }
        catch (error) {
            console.error("Error during health check and load balancer update:", error);
        }
    });
}
function sortServersById(servers) {
    return servers.slice().sort((a, b) => a.id - b.id);
}
//# sourceMappingURL=index.js.map