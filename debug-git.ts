import { simpleGit } from 'simple-git';
import path from 'path';

const targetPath = process.argv[2] || process.cwd();
console.log(`Debugging git in: ${targetPath}`);

const git = simpleGit(targetPath);

const run = async () => {
    try {
        const isRepo = await git.checkIsRepo();
        console.log(`Is Repo: ${isRepo}`);

        if (!isRepo) return;

        const branches = await git.branchLocal();
        console.log('--- Initial Branches ---');
        console.log(`Current: ${branches.current}`);
        console.log(`All: ${branches.all.join(', ')}`);

        // Test creating a temp branch
        const testBranch = 'test-debug-' + Date.now();
        console.log(`\nCreating branch: ${testBranch}`);
        await git.checkoutLocalBranch(testBranch);

        const branchesAfter = await git.branchLocal();
        console.log('--- After Creation ---');
        console.log(`Current: ${branchesAfter.current}`);
        console.log(`All: ${branchesAfter.all.join(', ')}`);

        console.log(`Found changes? ${branchesAfter.all.includes(testBranch)}`);

        // Cleanup
        console.log(`\nSwitching back to ${branches.current}`);
        await git.checkout(branches.current);
        await git.deleteLocalBranch(testBranch);

    } catch (e) {
        console.error('Error:', e);
    }
};

run();
