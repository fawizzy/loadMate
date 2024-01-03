import axios from "axios";
import { parentPort } from "worker_threads";

// Listen for messages from the parent thread
parentPort.on("message", async ({ url, method, data, server }) => {
  // Perform the request operation and send the response back to the parent thread
  const response = await requestOperation(url, method, data, server);
  parentPort.postMessage(response["data"]);
});

// Function to perform the request operation using axios
const requestOperation = (
  url: string,
  method: string,
  data: any,
  server: string
) => {
  // Returning a Promise to handle the asynchronous nature of axios
  return new Promise(async (resolve) => {
    // Make an HTTP request using axios
    const response = await axios({
      method,
      url: server, // Use the provided server URL
      data,
    });

    // Resolve the promise with the entire axios response
    resolve(response);
  });
};

// Comments:
// 1. The 'parentPort.on' listens for messages from the parent thread.
// 2. The 'requestOperation' function performs the HTTP request using axios.
// 3. The response data is extracted and sent back to the parent thread using 'parentPort.postMessage'.
// 4. Note: The 'resolve' parameter of the Promise in 'requestOperation' is not explicitly used here but can be utilized if needed.
