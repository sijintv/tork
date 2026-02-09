import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { getBranches, getRemotes, getTags } from '../git.js';

interface SidebarProps {
    onSelect: (item: any) => void;
    isActive: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, isActive }) => {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const branches = await getBranches();
            // Flatten the structure for the list
            const branchItems = branches.all.map(b => ({
                label: b === branches.current ? `* ${b}` : `  ${b}`,
                value: { type: 'branch', name: b }
            }));

            // Simplified for now, just local branches
            setItems([
                { label: '--- Branches ---', value: { type: 'header' } },
                ...branchItems
            ]);
        };

        fetchData();
    }, []);

    return (
        <Box flexDirection="column" borderStyle="single" borderColor={isActive ? "green" : "white"} width="30%">
            <Text bold>Repositories / Refs</Text>
            <SelectInput
                items={items}
                onSelect={onSelect}
                isFocused={isActive}
            />
        </Box>
    );
};

export default Sidebar;
