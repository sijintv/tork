import React, { useEffect, useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { getBranches, getRemotes, checkout, createBranch, getRepoRoot } from '../git.js';
import ScrollableList from './ScrollableList.js';
import { useWindowSize } from '../hooks/useWindowSize.js';
import TextInput from 'ink-text-input';
import path from 'path';
import fs from 'fs';

interface SidebarProps {
    onSelect: (item: any) => void;
    isActive: boolean;
}

type Section = 'local' | 'commits' | 'branches' | 'remotes';

interface SidebarItem {
    label: string;
    value: { type: string; name?: string };
    section: Section | 'header';
    key: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, isActive }) => {
    const [branches, setBranches] = useState<string[]>([]);
    const [remotes, setRemotes] = useState<string[]>([]);
    const [currentBranch, setCurrentBranch] = useState('');
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const { rows } = useWindowSize();

    const [repoPath, setRepoPath] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchData = async () => {
        try {
            const b = await getBranches();
            const r = await getRemotes();
            const root = await getRepoRoot();
            setBranches(b.all);
            setCurrentBranch(b.current);
            setRemotes(r.map(remote => remote.name));
            setRepoPath(path.basename(root));
        } catch (e: any) {
            setError(e.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    useInput((input, key) => {
        if (creatingBranch) {
            if (key.escape) {
                setCreatingBranch(false);
                setNewBranchName('');
            }
        } else if (isActive) {
            if (input === 'r') {
                setRefreshKey(prev => prev + 1);
            }
        }
    });

    const toggleCollapse = (section: string) => {
        setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const allItems: SidebarItem[] = [
        { label: 'Local Changes', value: { type: 'changes' }, section: 'local', key: 'local' },
        { label: 'All Commits', value: { type: 'commits' }, section: 'commits', key: 'commits' },

        { label: `Branches [${collapsed['branches'] ? '+' : '-'}]`, value: { type: 'header', name: 'branches' }, section: 'header', key: 'header-branches' },
        ...(!collapsed['branches'] ? [
            { label: '  + New Branch', value: { type: 'new-branch' }, section: 'branches' as const, key: 'new-branch' },
            ...branches.map(name => ({
                label: name === currentBranch ? `* ${name}` : `  ${name}`,
                value: { type: 'branch', name },
                section: 'branches' as const,
                key: `branch-${name}`
            }))
        ] : []),

        { label: `Remotes ${collapsed['remotes'] ? '[+]' : '[-]'}`, value: { type: 'header', name: 'remotes' }, section: 'header', key: 'header-remotes' },
        ...(!collapsed['remotes'] ? remotes.map(name => ({
            label: `  ${name}`,
            value: { type: 'remote', name },
            section: 'remotes' as const,
            key: `remote-${name}`
        })) : [])
    ];



    const [creatingBranch, setCreatingBranch] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');

    const handleSelect = async (item: SidebarItem) => {
        if (item.value.type === 'header') {
            if (item.value.name) {
                toggleCollapse(item.value.name);
            }
        } else if (item.value.type === 'branch') {
            if (item.value.name) {
                try {
                    await checkout(item.value.name);
                    const b = await getBranches();
                    setBranches(b.all);
                    setCurrentBranch(b.current);
                } catch (e) { }
            }
        } else if (item.value.type === 'remote') {
            if (item.value.name) {
                try {
                    await checkout(item.value.name);
                    const b = await getBranches();
                    setBranches(b.all);
                    setCurrentBranch(b.current);
                } catch (e) { }
            }
        } else if (item.value.type === 'new-branch') {
            setCreatingBranch(true);
        } else {
            onSelect(item);
        }
    };

    const handleToggle = (item: SidebarItem) => {
        if (item.value.type === 'header' && item.value.name) {
            toggleCollapse(item.value.name);
        }
    };



    const [error, setError] = useState<string | null>(null);

    const handleCreateBranch = async () => {
        setError(null);
        if (newBranchName.trim()) {
            try {
                await createBranch(newBranchName.trim());
                // Refresh data immediately
                const b = await getBranches();
                const r = await getRemotes();
                setBranches(b.all);
                setCurrentBranch(b.current);
                setRemotes(r.map(remote => remote.name));
                setCreatingBranch(false);
                setNewBranchName('');
            } catch (e: any) {
                setError(e.message || 'Failed to create branch');
            }
        } else {
            setCreatingBranch(false);
        }
    };

    return (
        <Box flexDirection="column" borderStyle="single" borderColor={isActive ? "green" : "white"} flexGrow={1}>
            <Text bold underline>Sidebar ({repoPath})</Text>
            <Text color="cyan">Current: {currentBranch || 'Detached?'}</Text>
            <Text color="gray">r: refresh</Text>
            {error && <Text color="red">{error}</Text>}
            <Box height={1} />
            {creatingBranch ? (
                <Box flexDirection="column">
                    <Text>New Branch Name (Esc to cancel):</Text>
                    <TextInput
                        value={newBranchName}
                        onChange={setNewBranchName}
                        onSubmit={handleCreateBranch}
                        focus={isActive}
                    />
                </Box>
            ) : (
                <ScrollableList<SidebarItem>
                    items={allItems}
                    isActive={isActive}
                    onSelect={handleSelect}
                    onToggle={handleToggle}
                    height={rows ? Math.max(5, rows - 16) : 10}
                    renderItem={(item, isSelected) => {
                        const isHeader = item.value.type === 'header';
                        return (
                            <Text
                                color={isSelected ? 'white' : (isHeader ? 'yellow' : undefined)}
                                backgroundColor={isSelected ? 'blue' : undefined}
                                bold={isHeader}
                                wrap="truncate"
                            >
                                {item.label}
                            </Text>
                        );
                    }}
                />
            )}
        </Box>
    );
};

export default Sidebar;
