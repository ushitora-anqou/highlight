import { codeToHtml } from "shiki";
import { createServer } from "node:net";
import { socketPath } from "./common.js";

const server = createServer((conn) => {
  conn.on("close", () => {});

  conn.on("error", (err) => {});

  conn.on("data", (data) => {
    const q = JSON.parse(data);

    const options = {
      lang: q.syntax,
      theme: q.theme,
      transformers: [
        {
          root(node) {
            // remove <pre> and <code>.
            const pre = node.children[0];
            if (pre !== undefined && pre.tagName == "pre") {
              const code = pre.children[0];
              if (code !== undefined && code.tagName == "code") {
                node.children = code.children;
              }
            }
          },
        },
      ],
    };

    codeToHtml(q.code, options).then((html) => conn.write(html));
  });
});

server.listen(socketPath);
