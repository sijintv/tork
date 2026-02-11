#!/usr/bin/env node
import React, { useState, useEffect } from 'react';
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

// Check if target is a git repo before starting the UI
const targetPath = cli.input[0] ? path.resolve(cli.input[0]) : process.cwd();

try {
    setGitDirectory(targetPath);
    const isRepo = await checkIsRepo();

    if (!isRepo) {
        console.error(`\x1b[31mError: '${targetPath}' is not a valid git repository.\x1b[0m`);
        console.error('Please run git-tork inside a git repository or provide a path to one.');
        process.exit(1);
    }

    try {
        process.chdir(targetPath);
    } catch (err) {
        // ignore if we can't chdir, usage of setGitDirectory should handle it mostly, 
        // but chdir helps with relative path commands if any
    }

} catch (e: any) {
    console.error(`\x1b[31mError initializing: ${e.message}\x1b[0m`);
    process.exit(1);
}

const Init = () => {
    useEffect(() => {
        // Enter alternate screen buffer
        process.stdout.write('\x1b[?1049h');

        return () => {
            // Exit alternate screen buffer
            process.stdout.write('\x1b[?1049l');
        };
    }, []);

    return <App />;
};

const app = render(<Init />, { exitOnCtrlC: true });
await app.waitUntilExit();
