import { simpleGit } from 'simple-git';
let git = simpleGit();
export const setGitDirectory = (path) => {
    git = simpleGit(path);
};
export const checkIsRepo = async () => {
    return git.checkIsRepo();
};
export const getStatus = async () => {
    return git.status();
};
export const getBranches = async () => {
    return git.branchLocal();
};
export const getLog = async () => {
    return git.log();
};
export const getGraphLog = async () => {
    // using raw command for graph
    return git.raw(['log', '--all', '--graph', '--date=short', '--pretty=format:%h %ad %s (%an)', '--color=always', '-n', '1000']);
};
export const getRemotes = async () => {
    return git.getRemotes(true);
};
export const getTags = async () => {
    return git.tags();
};
export const checkout = async (branchOrCommit) => {
    return git.checkout(branchOrCommit);
};
export const getDiff = async (path) => {
    return git.diff([path]);
};
export const stage = async (path) => {
    return git.add([path]);
};
export const unstage = async (path) => {
    return git.reset(['HEAD', path]);
};
export const commit = async (message, options) => {
    const commitOptions = options?.amend ? { '--amend': null } : undefined;
    if (commitOptions) {
        return git.commit(message, commitOptions);
    }
    return git.commit(message);
};
export const push = async () => {
    return git.push();
};
export const pull = async () => {
    return git.pull();
};
export const fetch = async () => {
    return git.fetch();
};
export const createBranch = async (branch) => {
    return git.checkoutLocalBranch(branch);
};
export const getLastCommitMessage = async () => {
    try {
        const log = await git.log(['-1']);
        return log.latest?.message || '';
    }
    catch (e) {
        return '';
    }
};
export const getRepoRoot = async () => {
    return git.revparse(['--show-toplevel']);
};
