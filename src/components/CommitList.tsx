import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { getGraphLog } from '../git.js';
import ScrollableList from './ScrollableList.js';
import { useWindowSize } from '../hooks/useWindowSize.js';

interface CommitListProps {
    isActive: boolean;
    onSelectCommit: (hash: string) => void;
}

const CommitList: React.FC<CommitListProps> = ({ isActive, onSelectCommit }) => {
    const [lines, setLines] = useState<string[]>([]);
    const { rows, columns } = useWindowSize(); // Get columns

    // Sidebar width is 35. Border is 2. Scrollbar might be 1.
    // Let's safe-guard with a bit more padding.
    const availableWidth = Math.max(0, columns - 38);

    useEffect(() => {
        const fetchLog = async () => {
            const log = await getGraphLog();
            setLines(log.split('\n'));
        };
        fetchLog();
    }, []);

    const handleSelect = (line: string, index: number) => {
        // Parse hash if needed
    };

    return (
        <Box flexDirection="column" borderStyle="single" borderColor={isActive ? "green" : "white"} flexGrow={1}>
            <Text bold>Commit History (Graph)</Text>
            <ScrollableList<string>
                items={lines}
                isActive={isActive}
                onSelect={handleSelect}
                height={rows ? Math.max(2, rows - 9) : 10}
                renderItem={(item, isSelected) => (
                    <Box width={availableWidth}>
                        <Text
                            backgroundColor={isSelected ? 'blue' : undefined}
                            wrap="truncate"
                        >
                            {item}
                        </Text>
                    </Box>
                )}
            />
        </Box>
    );
};

export default CommitList;
