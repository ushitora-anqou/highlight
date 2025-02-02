# highlight

Yet another `highlight` command for source highlighting. It uses [Shiki](https://shiki.style/). Its command-line options mimic those of [GNU Source-highlighting](https://www.gnu.org/software/src-highlite/) partially so that it can be used with [soupault](https://soupault.app/).

This program is created for [blog.anqou.net](https://blog.anqou.net/).

## Usage

```
$ echo 'console.log("hello");' | nix run . -- -O html --syntax js -f
<span class="line"><span style="color:#0E1116">console.</span><span style="color:#622CBC">log</span><span style="color:#0E1116">(</span><span style="color:#032563">"hello"</span><span style="color:#0E1116">);</span></span>
<span class="line"></span>
```

## Architecture

This program adopts a client-server architecture. When a user runs `highlight`, it acts as a client. If the server isn't already running, the client automatically starts it. The client then connects to the server via a Unix domain socket and sends its input for processing. The server receives the input, applies syntax highlighting using Shiki, and sends the result back to the client. Once the client prints the output and exits, the server remains running, ready to handle the next request.

This approach allows `highlight` to return results faster than simpler architectures where each invocation runs a short-lived process to use Shiki. This is presumably because we can avoid initializing Shiki repeatedly.
