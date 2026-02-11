#!/usr/bin/env node
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { render, Text, Box } from 'ink';
import App from './components/App.js';
import meow from 'meow';
import { setGitDirectory, checkIsRepo } from './git.js';
import path from 'path';
const cli = meow(`
	Usage
	  $ git-tork [path]

	Examples
	  $ git-tork
	  $ git-tork /path/to/repo
`, {
    importMeta: import.meta,
});
const Init = () => {
    const [error, setError] = useState(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        // Enter alternate screen buffer
        process.stdout.write('\x1b[?1049h');
        return () => {
            // Exit alternate screen buffer
            process.stdout.write('\x1b[?1049l');
        };
    }, []);
    useEffect(() => {
        const init = async () => {
            const targetPath = cli.input[0] ? path.resolve(cli.input[0]) : process.cwd();
            try {
                setGitDirectory(targetPath);
                const isRepo = await checkIsRepo();
                if (!isRepo) {
                    setError(`Error: '${targetPath}' is not a valid git repository.`);
                }
                else {
                    try {
                        process.chdir(targetPath);
                    }
                    catch (err) {
                        // ignore
                    }
                    setReady(true);
                }
            }
            catch (e) {
                setError(`Error initializing: ${e.message}`);
            }
        };
        init();
    }, []);
    if (error) {
        return (_jsx(Box, { borderStyle: "single", borderColor: "red", children: _jsx(Text, { color: "red", children: error }) }));
    }
    if (!ready) {
        return _jsx(Text, { children: "Loading..." });
    }
    return _jsx(App, {});
};
const app = render(_jsx(Init, {}), { exitOnCtrlC: true });
await app.waitUntilExit();
