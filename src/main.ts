import path from 'node:path';
import { FileHandle, open } from 'node:fs/promises';
import zlib from 'node:zlib';
import parseArgs from 'minimist';
import { parseDemo } from './parser.js';

async function main() {
  try {
    const argv = parseArgs(process.argv.slice(2));
    const filePath = argv._[0];
    let filehandle: FileHandle | void;
    try {
      filehandle = await open(path.normalize(filePath), 'r');
      const compressedBuff = await filehandle.readFile();
      const buff = zlib.gunzipSync(compressedBuff);
      parseDemo(buff);
    } finally {
      await filehandle?.close();
    }
  } catch(e) {
    console.error(e);
    process.exit(-1);
  }
  process.exit(0);
}

main();
