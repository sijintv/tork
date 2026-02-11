import { simpleGit, SimpleGit, StatusResult, BranchSummary, LogResult } from 'simple-git';

let git: SimpleGit = simpleGit();

export const setGitDirectory = (path: string) => {
    git = simpleGit(path);
};

export const checkIsRepo = async (): Promise<boolean> => {
    return git.checkIsRepo();
};

export const getStatus = async (): Promise<StatusResult> => {
    return git.status();
};

export const getBranches = async (): Promise<BranchSummary> => {
    return git.branchLocal();
};

export const getLog = async (): Promise<LogResult> => {
    return git.log();
};

export const getGraphLog = async (): Promise<string> => {
    // using raw command for graph
    return git.raw(['log', '--all', '--graph', '--date=short', '--pretty=format:%h %ad %s (%an)', '--color=always', '-n', '1000']);
};

export const getRemotes = async () => {
    return git.getRemotes(true);
};

export const getTags = async () => {
    return git.tags();
};

export const checkout = async (branchOrCommit: string) => {
    return git.checkout(branchOrCommit);
};

export const getDiff = async (path: string) => {
    return git.diff([path]);
};

export const stage = async (path: string) => {
    return git.add([path]);
};

export const unstage = async (path: string) => {
    return git.reset(['HEAD', path]);
};

export const commit = async (message: string, options?: CommitOptions) => {
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

export const createBranch = async (branch: string) => {
    return git.checkoutLocalBranch(branch);
};

export const getLastCommitMessage = async () => {
    try {
        const log = await git.log(['-1']);
        return log.latest?.message || '';
    } catch (e) {
        return '';
    }
};

export const getRepoRoot = async () => {
    return git.revparse(['--show-toplevel']);
};

interface CommitOptions {
    amend?: boolean;
}


