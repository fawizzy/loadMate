import * as cluster from "cluster";
import * as express from "express";
import * as dotenv from "dotenv";
import { cpus } from "os";

import { RoundRobinLoadBalancer } from "./algorithm/round_robin";
import { RandomLoadBalancer } from "./algorithm/random";
import { LeastConnectionLoadBalancer } from "./algorithm/least_connections";
import { checkServerHealth } from "./utilities/healthcheck";
import { readJsonFileSync, writeJsonFile } from "./utilities/handleJSON";
import { requestAxios } from "./utilities/handleRequest";
import {
  handleConnectionClosed,
  handleNewConnection,
} from "./utilities/countConnections";

// Type assertion for cluster
const thisCluster = cluster as any as cluster.Cluster;

// Master process - Fork worker processes
if (thisCluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    thisCluster.fork();
  }
} else {
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
        let server: any;

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

        // Handle connection
        handleNewConnection(server);

        // Extract request details
        const { originalUrl: url, method, body: data } = req;

        // Make request to chosen server
        const response = await requestAxios(
          { url, method, data, server: server.url },
          cpus().length
        );

        // Send response to client
        res.send(response);

        // Handle connection closure
        handleConnectionClosed(server);
      } catch (error) {
        if (error) {
          res.status(500);
        }
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

      // Check server health
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

      // Update configuration file
      writeJsonFile(filePath, config);
    } catch (error) {
      console.error(
        "Error during health check and load balancer update:",
        error
      );
    }
  }

  /**
   * Sort servers by ID
   * @param servers Array of servers
   * @returns Sorted array of servers
   */
  function sortServersById(servers: any) {
    return servers.slice().sort((a: any, b: any) => a.id - b.id);
  }
}
