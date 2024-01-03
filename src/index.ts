import * as express from "express";
import * as dotenv from "dotenv";
import { RoundRobinLoadBalancer } from "./algorithm/round_robin";
import { RandomLoadBalancer } from "./algorithm/random";
import { checkServerHealth } from "./utilities/healthcheck";
import { readJsonFileSync, writeJsonFile } from "./utilities/handleJSON";
import { requestAxios } from "./utilities/handleRequest";
import { cpus } from "os";
import { LeastConnectionLoadBalancer } from "./algorithm/least_connections";
import {
  handleConnectionClosed,
  handleNewConnection,
} from "./utilities/countConnections";

dotenv.config();

const app = express();
const port = 3000;
const filePath = `${__dirname}/config.json`;

// Load initial server configuration
let config = readJsonFileSync(filePath);

// Initialize load balancers
let roundRobinLoadBalancer: RoundRobinLoadBalancer;
let randomLoadBalancer: RandomLoadBalancer;
let leastConnectionLoadBalancer: LeastConnectionLoadBalancer;

// Get initial healthy servers and update load balancers
checkAndInitLoadBalancers();

// Set up periodic health check and load balancer update
setInterval(checkAndInitLoadBalancers, 10000);

app.use(express.json());

// Route handling middleware
app.use(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      // config = readJsonFileSync(filePath);
      // let server: any;
      // // Choose load balancer based on configured algorithm
      // switch (config["algorithm"]) {
      //   case "random":
      //     server = randomLoadBalancer.getNextServer();
      //     break;
      //   case "round_robin":
      //     server = roundRobinLoadBalancer.getNextServer();
      //     break;
      //   case "least_connections":
      //     server = leastConnectionLoadBalancer.getserverWithMinConnections();
      //     break;
      //   default:
      //     server = config["healthy_servers"][0];
      //     break;
      // }
      // console.log(server);
      // handleNewConnection(server);
      const { originalUrl: url, method, body: data } = req;
      // const response = await requestAxios(
      //   { url, method, data, server: "http://localhost:8000" },
      //   cpus().length
      // );
      res.send("response");
      // handleConnectionClosed(server);
    } catch (error) {
      next(error);
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

/**
 * Perform server health check and update load balancers
 */
async function checkAndInitLoadBalancers() {
  try {
    config = readJsonFileSync(filePath);
    const healthyServers = await checkServerHealth(config["all_servers"]);
    config["healthy_servers"] = sortServersById(healthyServers);

    // Update load balancers
    randomLoadBalancer = new RandomLoadBalancer(config["healthy_servers"]);
    roundRobinLoadBalancer = new RoundRobinLoadBalancer(
      config["healthy_servers"]
    );
    leastConnectionLoadBalancer = new LeastConnectionLoadBalancer(
      config["healthy_servers"]
    );
    writeJsonFile(filePath, config);
  } catch (error) {
    console.error("Error during health check and load balancer update:", error);
  }
}

function sortServersById(servers: any) {
  return servers.slice().sort((a: any, b: any) => a.id - b.id);
}
