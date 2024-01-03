export class RandomLoadBalancer {
  private servers: string[];
  private currentIndex: number;

  constructor(servers: string[]) {
    if (servers.length === 0) {
      throw new Error("At least one server is required");
    }
    this.servers = servers;
    this.currentIndex = 0;
  }

  getNextServer(): string {
    const nextServer = this.servers[this.currentIndex];
    this.currentIndex = Math.floor(Math.random() * 4) % this.servers.length;
    return nextServer;
  }
}
