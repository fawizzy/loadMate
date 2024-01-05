export class RoundRobinLoadBalancer {
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
    // console.log(RoundRobinState.getCurrentIndex());
    const nextServer = this.servers[RoundRobinState.getCurrentIndex()];
    RoundRobinState.incrementIndex(this.servers.length);
    return nextServer;
  }
}

class RoundRobinState {
  private static currentIndex: number = 0;

  static getCurrentIndex(): number {
    return RoundRobinState.currentIndex;
  }

  static incrementIndex(length: number): void {
    RoundRobinState.currentIndex = (RoundRobinState.currentIndex + 1) % length;
  }
}
