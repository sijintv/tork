import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import Sidebar from './Sidebar.js';
import CommitList from './CommitList.js';

type FocusArea = 'sidebar' | 'commitList';

const App = () => {
    const [focusArea, setFocusArea] = useState<FocusArea>('sidebar');
    const [selectedBranch, setSelectedBranch] = useState<string>('');

    useInput((input, key) => {
        if (input === 'q') {
            process.exit(0);
        }
        if (key.tab) {
            setFocusArea(prev => prev === 'sidebar' ? 'commitList' : 'sidebar');
        }
    });

    const handleSidebarSelect = (item: any) => {
        if (item.value.type === 'branch') {
            setSelectedBranch(item.value.name);
            // In a real app, this would trigger a checkout or just filter the commit view
        }
    };

    const handleCommitSelect = (hash: string) => {
        // Show diff?
    };

    return (
        <Box flexDirection="column" height="100%">
            <Box borderStyle="single" borderColor="green">
                <Text>Terminal Fork - Press 'q' to exit, 'Tab' to switch focus</Text>
            </Box>
            <Box flexDirection="row" flexGrow={1}>
                <Sidebar
                    isActive={focusArea === 'sidebar'}
                    onSelect={handleSidebarSelect}
                />
                <CommitList
                    isActive={focusArea === 'commitList'}
                    onSelectCommit={handleCommitSelect}
                />
            </Box>
        </Box>
    );
};

export default App;
