import axios from "axios";

export const checkServerHealth = async (
  servers: string[]
): Promise<string[]> => {
  const healthyServers: string[] = [];

  const timeoutMs = 200000;

  await Promise.all(
    servers.map(async (server) => {
      try {
        const response = await axios.get(`${server["url"]}/health`, {
          timeout: timeoutMs,
        });

        if (response.status === 200) {
          healthyServers.push(server);
        }
      } catch (error) {
        console.error(
          `Error checking server ${server["url"]}: ${error.message}`
        );
      }
    })
  );
  return healthyServers;
};
