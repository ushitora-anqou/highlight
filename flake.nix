{
  description = "Yet another highlight command for source highlighting, created for blog.anqou.net.";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-24.11";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages."${system}";
  in {
    formatter."${system}" = pkgs.alejandra;

    packages."${system}" = rec {
      default = pkgs.callPackage ./default.nix {};
    };
  };
}
