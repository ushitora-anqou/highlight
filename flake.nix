{
  description = "Yet another highlight command for source highlighting, created for blog.anqou.net.";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages."${system}";
    main = pkgs.callPackage ./default.nix {};
  in {
    formatter."${system}" = pkgs.alejandra;

    packages."${system}" = rec {
      default = pkgs.callPackage ./default.nix {};
    };

    apps."${system}".default = {
      type = "app";
      program = "${main}/bin/highlight";
    };
  };
}
