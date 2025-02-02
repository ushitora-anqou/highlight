# highlight

Yet another `highlight` command for source highlighting. It uses [Shiki](https://shiki.style/). Its command-line options mimic those of [GNU Source-highlighting](https://www.gnu.org/software/src-highlite/) partially so that it can be used with [soupault](https://soupault.app/).

This program is created for [blog.anqou.net](https://blog.anqou.net/).

## Usage

```
$ echo 'console.log("hello");' | nix run . -- -O html --syntax js -f
<span class="line"><span style="color:#0E1116">console.</span><span style="color:#622CBC">log</span><span style="color:#0E1116">(</span><span style="color:#032563">"hello"</span><span style="color:#0E1116">);</span></span>
<span class="line"></span>
```
