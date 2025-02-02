import { parseArgs } from "node:util";
import { readFileSync, existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import { socketPath } from "./common.js";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const { values, positionals } = parseArgs({
  options: {
    "out-format": {
      type: "string",
      short: "O",
    },
    syntax: {
      type: "string",
      short: "S",
    },
    theme: {
      type: "string",
      default: "github-light-high-contrast",
    },
    fragment: {
      type: "boolean",
      short: "f",
    },
  },
});

if (!("out-format" in values) || values["out-format"] != "html") {
  console.error("set --out-format=html");
  process.exit(1);
}
if (!("syntax" in values)) {
  console.error("set --syntax");
  process.exit(1);
}
if (!("fragment" in values)) {
  console.error("set --fragment");
  process.exit(1);
}

let syntax = values.syntax;
if (syntax === "fstar") syntax = "fsharp";

// read from stdin
process.stdin.setEncoding("utf8");
let code = "";
for await (const chunk of process.stdin) code += chunk;

// launch a server if not exists
if (!existsSync(socketPath)) {
  const server = spawn(process.argv[0], [import.meta.dirname + "/server.js"], {
    detached: true,
    stdio: "ignore",
  });
  server.unref();

  for (let i = 0; i < 3; i++) {
    if (existsSync(socketPath)) break;
    await sleep(100);
  }
}

const client = createConnection(socketPath);

client.on("connect", () => {
  client.write(
    JSON.stringify({
      code: code,
      syntax: syntax,
      theme: values.theme,
    })
  );
});
client.on("data", (html) => {
  process.stdout.write(html);
  client.end();
});
client.on("error", (e) => {
  process.stderr.write(`${e}`);
  process.exit(1);
});
