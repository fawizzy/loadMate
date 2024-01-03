import { Worker } from "worker_threads";

import axios from "axios";
import { Request, Response } from "express";

export const requestOperation = (
  url: string,
  method: string,
  data: any,
  server: string
) => {
  return new Promise(async (resolve) => {
    const response = await axios({
      method,
      url: server,
      data,
    });
    resolve(response);
  });
};

export const requestAxios = async (
  { url, method, data, server },
  concurrentWorkers
) => {
  const worker = new Worker("./src/worker.ts");
  const dataObj = { url, method, data, server };
  worker.postMessage(dataObj);
  return new Promise((resolve) => {
    worker.on("message", (data) => {
      resolve(data);
    });
  });
};
