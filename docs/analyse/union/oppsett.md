---
title: Flyte
---

# Union autentisering fra lokal maskin
Opprett en fil `~/.flyte/config.yaml` (MAC, Linux) eller `C:\Users\<nav_ident>\.flyte\config.yaml` (Windows) med følgende innhold:

```yaml
union:
  connection:
    host: dns:///nav.eu-central-1.unionai.cloud
    insecure: false
  auth:
    type: Pkce
admin:
  endpoint: dns:///nav.eu-central-1.unionai.cloud
  insecure: false
  authType: Pkce
```

# Nødvendige verktøy

## Union CLI
Union CLIet kan installeres som en vanlig python pakke, men Union [oppfordrer brukere](https://www.union.ai/docs/v1/byoc/user-guide/getting-started/local-setup/) til å installere [uv](https://docs.astral.sh/uv/) og deretter union CLI som et uv verktøy. For å installere uv se [følgende doc](https://docs.astral.sh/uv/). Med uv installert kan union CLI installeres som følger:

```bash
uv tool install union
```

For enkelhets skyld bør du da også utvide path variablen til inkludere binærmappen til uv verktøy

```bash
export PATH="${PATH}:${HOME}/.local/share/uv/tools/union/bin"
```

## uctl

### MAC

```bash
brew tap unionai/homebrew-tap
brew install uctl
```

### Linux

```bash
curl -sL https://raw.githubusercontent.com/unionai/uctl/main/install.sh | bash
```

```bash
export PATH="${PATH}:${HOME}/bin"
```

### Eksempler
Se [navikt/union-demo](https://github.com/navikt/union-demo) for eksempler på workflows og tasks med både [v1](https://www.union.ai/docs/v1/flyte/user-guide/introduction/) og [v2](https://www.union.ai/docs/v2/flyte/user-guide/flyte-2/) versjonene av Flyte.
