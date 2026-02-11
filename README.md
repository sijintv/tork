# git-tork

A terminal-based Git client built with React and Ink.

## Features

-   **Interactive Sidebar**: Navigate branches, remotes, and commits.
-   **Branch Management**: Checkout, create, and view branches. Space to toggle sections.
-   **Commit History**: View commit logs graph.
-   **File Staging**: Stage/Unstage files individually.
-   **Diff Viewer**: View diffs of changed files with syntax highlighting.
-   **Commit & Amend**: Commit changes and amend the last commit.
-   **Push/Pull**: Push and pull changes with hotkeys.

## Installation

```bash
npm install -g git-tork
```

## Usage

Run the tool in any git repository:

```bash
git-tork
```

### Keybindings

-   **Navigation**: `Up`/`Down` arrows to navigate lists.
-   **Sidebar**:
    -   `Enter`: Checkout branch / Select item.
    -   `Space`: Toggle section collapse (Branches/Remotes).
    -   `r`: Refresh branch list.
    -   `n`: Create new branch (when "New Branch" selected).
-   **Status View**:
    -   `s`: Stage file.
    -   `u`: Unstage file.
    -   `c`: Enter commit mode.
    -   `a`: Toggle "Amend Last Commit".
-   **General**:
    -   `Tab` / `Shift+Tab`: Switch focus between panels (Sidebar, Status/Diff, etc).
    -   `p`: Push.
    -   `l`: Pull.
    -   `q`: Quit.

## Development

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build and watch:
    ```bash
    npm run dev
    ```
4.  Run locally:
    ```bash
    npm start
    ```

## License

MIT
