const { createWriteStream } = require("fs");
const { createLoggingWritable } = require("./logging-writable");

const writable = createWriteStream("test.txt");
const writableProxy = createLoggingWritable(writable);

writableProxy.write("First chunk");
writableProxy.write("Second Chunk chunk");
writable.write("This is not logged");
writableProxy.end();
