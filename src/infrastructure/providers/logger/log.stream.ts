import { createStream } from "rotating-file-stream";
import path from "path";  

const logDirectory = path.join(process.cwd(), "logs");

export const combinedStream = createStream("combined.log", {
  interval: "1d",
  path: logDirectory,
  maxFiles: 7,
});

export const errorStream = createStream("error.log", {
  interval: "1d",
  path: logDirectory,
  maxFiles: 7,
});