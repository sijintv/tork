import { getDiff } from './git.js';
import { setGitDirectory } from './git.js';
const run = async () => {
    setGitDirectory(process.cwd());
    const file = process.argv[2];
    if (file) {
        console.log(`Diffing ${file}...`);
        const d = await getDiff(file);
        console.log('RAW DIFF START');
        console.log(JSON.stringify(d));
        console.log('RAW DIFF END');
    }
    else {
        console.log('Please provide a file to diff');
    }
};
run();
