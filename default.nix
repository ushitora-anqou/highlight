{
  pkgs,
  lib,
}: let
  nodejs = pkgs.nodejs_24;
  pnpm = pkgs.pnpm_10;
in
  pkgs.stdenv.mkDerivation (finalAttrs: {
    # cf. https://nixos.org/manual/nixpkgs/stable/#javascript-pnpm
    pname = "highlight";
    version = "0.1.0";
    src = ./.;
    nativeBuildInputs = [nodejs pnpm.configHook];
    pnpmDeps = pnpm.fetchDeps {
      inherit (finalAttrs) pname version src;
      hash = "sha256-jSGMwMgFA9/zkI8p5nsuh8nXP3u5oj/RhIvKfHtFKqg=";
    };
    buildPhase = ''
      runHook preBuild
      runHook postBuild
    '';
    installPhase = ''
      runHook preInstall
      mkdir -p $out/{lib,bin}
      cp -r {node_modules,*.js} $out/lib
      echo "#!${pkgs.bash}/bin/bash" > $out/bin/highlight
      echo "${nodejs}/bin/node $out/lib/index.js \"\$@\"" >> $out/bin/highlight
      chmod +x $out/bin/highlight
      runHook postInstall
    '';
  })
