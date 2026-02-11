## Quick Start

Run instantly with npx:

```bash
npx git-tork
```

Or install globally:

```bash
npm install -g git-tork
git-tork
```

## Overview

A keyboard-first Git client for your terminal.

## Keybindings

| Key | Action |
| --- | --- |
| `Up` / `Down` | Navigate lists |
| `Tab` | Switch focus (Sidebar ↔ Main View) |
| `p` / `l` | Push / Pull |
| `q` | Quit |

**Sidebar**
- `Enter`: Checkout branch
- `Space`: Toggle folder collapse
- `r`: Refresh list
- `n`: New branch

**Changes View**
- `s`: Stage file
- `u`: Unstage file
- `c`: Commit changes
- `a`: Toggle "Amend"

## Development

```bash
git clone https://github.com/sijintv/git-tork.git
cd git-tork
npm install
npm run dev
```

## License

MIT
