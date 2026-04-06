import path from "path";
import { createStream } from "rotating-file-stream";

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
