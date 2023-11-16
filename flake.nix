{
  description = "Python for MkDocs";

  # Flake inputs
  inputs.nixpkgs.url = "github:NixOS/nixpkgs";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  # Flake outputs
  outputs = {self, ...} @ inputs:
    inputs.flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import inputs.nixpkgs {
        localSystem = {inherit system;};
      };

      poetryBashScript = {
        name,
        poetryCommands,
      }: pkgs.writeShellApplication {
        inherit name;
        runtimeInputs = with pkgs; [
          git # Don't assume users have a good/recent enough version of git
          python3
          poetry
        ];
        text = ''
          repoRoot=$(git rev-parse --show-toplevel)
          cd "''${repoRoot}"
          ${poetryCommands}
        '';
      };

      setupPoetryName = ",setup-mkdocs-poetry";
      setUpPoetry = poetryBashScript {
        name = setupPoetryName;
        poetryCommands = ''
          poetry config virtualenvs.in-project true --local
          poetry config virtualenvs.path ./venv --local
          poetry install --sync --no-interaction --ansi
        '';
      };

      localServeHtmlDocsName = ",serve-mkdocs-livereload";
      localServeHtmlDocs = poetryBashScript {
        name = localServeHtmlDocsName;
        poetryCommands = ''
          poetry run mkdocs serve --clean --watch docs/
        '';
      };

      buildHtmlDocsName = ",build-mkdocs-html";
      buildHtmlDocs = poetryBashScript {
        name = buildHtmlDocsName;
        poetryCommands = ''
          poetry run mkdocs build
        '';
      };

      htmlDocs = pkgs.stdenv.mkDerivation {
        src = ./.;
        name = "nada-docs-html";
        buildInputs = [setUpPoetry buildHtmlDocs];
        buildPhase = ''
          # TODO: Figure out why the below two lines are not executing their respective scripts
          ${setupPoetryName}
          ${buildHtmlDocsName}
          # mkdir -p $out
          mv site $out  # Then this `site` folder should exist and be non-empty
        '';
      };
    in {
      devShells.default = pkgs.mkShell {
        packages = [
          pkgs.python3
          pkgs.poetry

          setUpPoetry
          buildHtmlDocs
          localServeHtmlDocs
        ];
      };

      packages = rec {
        default = html;
        html = htmlDocs;
        ${setupPoetryName} = setUpPoetry;
        ${localServeHtmlDocsName} = localServeHtmlDocs;
        ${buildHtmlDocsName} = buildHtmlDocs;
      };

      apps = {
        serveHtml = {
          type = "app";
          program = "${localServeHtmlDocs}/bin/${localServeHtmlDocsName}";
        };
        installMkdocs = {
          type = "app";
          program = "${setUpPoetry}/bin/${setupPoetryName}";
        };
        buildHtml = {
          type = "app";
          program = "${buildHtmlDocs}/bin/${buildHtmlDocsName}";
        };
      };

      formatter = pkgs.alejandra;
    });
}
