import { readJsonFileSync, writeJsonFile } from "./handleJSON";

// When a new connection is established
export const handleNewConnection = (connectedserver: any) => {
  const filePath = `${__dirname}` + "/../config.json";
  const config = readJsonFileSync(filePath);
  const serverToUpdate = config.all_servers.find(
    (server: any) => server.url == connectedserver.url
  );
  const healthyserverToUpdate = config.healthy_servers.find(
    (server: any) => server.url == connectedserver.url
  );
  serverToUpdate.connections++;
  healthyserverToUpdate.connections++;
  writeJsonFile(filePath, config);
  // Redirect the request to the chosen server
};

// When a connection is closed
export const handleConnectionClosed = (connectedserver: any) => {
  const filePath = `${__dirname}` + "/../config.json";
  const config = readJsonFileSync(filePath);
  const serverToUpdate = config.all_servers.find(
    (server: any) => server.url == connectedserver.url
  );
  const healthyserverToUpdate = config.healthy_servers.find(
    (server: any) => server.url == connectedserver.url
  );
  serverToUpdate.connections--;
  healthyserverToUpdate.connections--;
  writeJsonFile(filePath, config);
};
