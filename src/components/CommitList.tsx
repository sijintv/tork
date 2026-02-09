import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { getLog } from '../git.js';
import { LogResult, DefaultLogFields } from 'simple-git';

interface CommitListProps {
    isActive: boolean;
    onSelectCommit: (hash: string) => void;
}

const CommitList: React.FC<CommitListProps> = ({ isActive, onSelectCommit }) => {
    const [commits, setCommits] = useState<ReadonlyArray<DefaultLogFields>>([]);

    useEffect(() => {
        const fetchLog = async () => {
            const log = await getLog();
            setCommits(log.all);
        };
        fetchLog();
    }, []);

    // Simple rendering for now
    return (
        <Box flexDirection="column" borderStyle="single" borderColor={isActive ? "green" : "white"} flexGrow={1}>
            <Text bold>Commit History</Text>
            {commits.slice(0, 20).map((commit) => (
                <Box key={commit.hash}>
                    <Text color="yellow">{commit.hash.substring(0, 7)}</Text>
                    <Text> - </Text>
                    <Text>{commit.message}</Text>
                    <Text color="gray"> ({commit.author_name})</Text>
                </Box>
            ))}
        </Box>
    );
};

export default CommitList;
