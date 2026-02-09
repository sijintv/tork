import simpleGit, { SimpleGit, StatusResult, BranchSummary, LogResult } from 'simple-git';

const git: SimpleGit = simpleGit();

export const getStatus = async (): Promise<StatusResult> => {
    return git.status();
};

export const getBranches = async (): Promise<BranchSummary> => {
    return git.branchLocal();
};

export const getLog = async (): Promise<LogResult> => {
    return git.log();
};

export const getRemotes = async () => {
    return git.getRemotes(true);
};

export const getTags = async () => {
    return git.tags();
};

export const checkout = async (branchOrCommit: string) => {
    return git.checkout(branchOrCommit);
}
