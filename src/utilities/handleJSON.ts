import * as fs from "fs";

export const readJsonFileSync = (filePath: string): any => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    throw error; // Re-throw the error for the calling code to handle
  }
};

export const writeJsonFile = (filePath: string, data: any): void => {
  try {
    const jsonData = JSON.stringify(data, null, 2);

    fs.writeFileSync(filePath, jsonData, "utf8");
  } catch (error) {
    console.log(error);
  }
};
