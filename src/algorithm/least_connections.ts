import { readJsonFileSync } from "../utilities/handleJSON";

export class LeastConnectionLoadBalancer {
  private currentIndex: number;

  constructor(servers: string[]) {
    if (servers.length === 0) {
      throw new Error("At least one server is required");
    }
    this.currentIndex = 0;
  }

  getserverWithMinConnections(): string {
    try {
      const filePath = __dirname + "/../config.json";
      const config = readJsonFileSync(filePath);
      const servers = config["healthy_servers"];
      const serverWithMinConnections = servers.reduce(
        (minServer: any, currentServer: any) => {
          return currentServer["connections"] < minServer["connections"]
            ? currentServer
            : minServer;
        }
      );
      return serverWithMinConnections;
    } catch (error) {
      throw new Error(error);
    }
  }
}
