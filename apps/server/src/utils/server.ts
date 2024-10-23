import { Response } from "express";

export function sendFile(response: Response, filePath: string) {
  return new Promise<void>((resolve) => {
    response.sendFile(filePath, () => {
      resolve();
    });
  });
}
