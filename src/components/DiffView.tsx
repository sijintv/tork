import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { getDiff } from '../git.js';
import ScrollableList from './ScrollableList.js';
import { useWindowSize } from '../hooks/useWindowSize.js';
import stripAnsi from 'strip-ansi';

interface DiffViewProps {
    file: string;
    isActive: boolean;
}

const DiffView: React.FC<DiffViewProps> = ({ file, isActive }) => {
    const [lines, setLines] = useState<string[]>([]);
    const { rows } = useWindowSize();
    // Reduce height to prevent overflow.
    // Body needs to fit in: Header (3) + Body (rows - 4) = rows - 1.
    // Body overhead: Border Top (1) + Title (1) + List + Border Bottom (1) = List + 3.
    // So List + 3 <= rows - 4  =>  List <= rows - 7.
    const height = rows ? Math.max(2, rows - 9) : 10;

    useEffect(() => {
        const fetchDiff = async () => {
            if (file) {
                try {
                    const d = await getDiff(file);
                    setLines(d ? d.split('\n') : []);
                } catch (e) {
                    setLines([]);
                }
            } else {
                setLines([]);
            }
        };
        fetchDiff();
    }, [file]);

    return (
        <Box flexDirection="column" borderStyle="single" borderColor={isActive ? "blue" : "white"} flexGrow={1} marginLeft={1} height={height + 2}>
            <Text bold>Diff: {file}</Text>
            {lines.length === 0 ? (
                <Box height={height}>
                    <Text color="gray">No changes or binary file</Text>
                </Box>
            ) : (
                <ScrollableList<string>
                    items={lines}
                    isActive={isActive}
                    height={height}
                    onSelect={() => { }}
                    renderItem={(item, isSelected) => {
                        const cleanItem = stripAnsi(item);
                        let color = undefined;
                        if (cleanItem.startsWith('+')) color = 'green';
                        else if (cleanItem.startsWith('-')) color = 'red';
                        else if (cleanItem.startsWith('@@')) color = 'cyan';

                        return (
                            <Text
                                color={color}
                                backgroundColor={isSelected ? 'gray' : undefined}
                                wrap="truncate"
                            >
                                {item}
                            </Text>
                        );
                    }}
                />
            )}
        </Box>
    );
};

export default DiffView;
