import React, { useEffect, useState, useMemo } from 'react';
import { Box, Text, useInput } from 'ink';
import { getStatus, stage, unstage, commit, getLastCommitMessage } from '../git.js';
import ScrollableList from './ScrollableList.js';
import TextInput from 'ink-text-input';
import { StatusResult } from 'simple-git';
import { useWindowSize } from '../hooks/useWindowSize.js';

interface StatusViewProps {
    isActive: boolean;
    onSelectFile: (file: string) => void;
    onInputModeChange?: (isInput: boolean) => void;
}

interface StatusItem {
    label: string;
    value: string;
    type: 'header' | 'file';
}

const StatusView: React.FC<StatusViewProps> = ({ isActive, onSelectFile, onInputModeChange }) => {
    const [status, setStatus] = useState<StatusResult | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [highlightedItem, setHighlightedItem] = useState<StatusItem | null>(null);
    const [commitMessage, setCommitMessage] = useState('');
    const [focusInput, setFocusInput] = useState(false);
    const { rows } = useWindowSize();

    useEffect(() => {
        const fetchStatus = async () => {
            const s = await getStatus();
            setStatus(s);
        };
        fetchStatus();
    }, [refreshKey, isActive]);

    const [amend, setAmend] = useState(false);

    useInput(async (input, key) => {
        if (!isActive) return;

        if (focusInput) {
            if (key.escape) {
                setFocusInput(false);
                if (onInputModeChange) onInputModeChange(false);
            }
            if (key.return) {
                if (commitMessage.trim()) {
                    await commit(commitMessage, { amend });
                    setCommitMessage('');
                    setAmend(false);
                    setFocusInput(false);
                    if (onInputModeChange) onInputModeChange(false);
                    setRefreshKey(prev => prev + 1);
                }
            }
            return;
        }

        if (input === 'c') {
            setFocusInput(true);
            if (onInputModeChange) onInputModeChange(true);
        }

        if (input === 'a') {
            const newAmend = !amend;
            setAmend(newAmend);
            if (newAmend) {
                const msg = await getLastCommitMessage();
                setCommitMessage(msg);
            } else {
                setCommitMessage('');
            }
        }

        if (highlightedItem && highlightedItem.type === 'file') {
            const filePath = highlightedItem.value;
            if (input === 's') {
                await stage(filePath);
                setRefreshKey(prev => prev + 1);
            }
            if (input === 'u') {
                await unstage(filePath);
                setRefreshKey(prev => prev + 1);
            }
        }
    });

    const items: StatusItem[] = useMemo(() => {
        if (!status) return [];
        const stagedFiles = status.files.filter(f => f.index !== '?' && f.index !== ' ');
        const unstagedFiles = status.files.filter(f => f.index === '?' || f.working_dir !== ' ');

        return [
            ...(stagedFiles.length > 0 ? [{ label: '--- Staged ---', value: 'header_staged', type: 'header' as const }] : []),
            ...stagedFiles.map(file => ({
                label: `  ${file.path}`,
                value: file.path,
                type: 'file' as const
            })),
            ...(unstagedFiles.length > 0 ? [{ label: '--- Unstaged ---', value: 'header_unstaged', type: 'header' as const }] : []),
            ...unstagedFiles.map(file => ({
                label: `  ${file.path}`,
                value: file.path,
                type: 'file' as const
            }))
        ];
    }, [status]);

    if (!status) return <Text>Loading status...</Text>;



    return (
        <Box flexDirection="column" borderStyle="single" borderColor={isActive ? "green" : "white"} width="30%">
            <Text bold>Changes {amend ? '[AMEND]' : ''}</Text>
            <Text color="gray">s: stage, u: unstage, c: commit, a: amend</Text>

            <Box flexGrow={1}>
                {items.length === 0 ? (
                    <Text>No changes</Text>
                ) : (
                    <ScrollableList<StatusItem>
                        items={items}
                        isActive={isActive && !focusInput}
                        onHighlight={setHighlightedItem}
                        onSelect={(item) => {
                            if (item.type === 'header') return;
                            onSelectFile(item.value);
                        }}
                        height={rows ? Math.max(2, rows - 17) : 10}
                        renderItem={(item, isSelected) => {
                            const isHeader = item.type === 'header';
                            return (
                                <Text
                                    color={isSelected ? 'green' : (isHeader ? 'yellow' : undefined)}
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

            <Box borderStyle="single" borderColor={focusInput ? "blue" : "gray"} flexDirection="column">
                <Text>Commit Message:</Text>
                <TextInput
                    value={commitMessage}
                    onChange={setCommitMessage}
                    focus={isActive && focusInput}
                    onSubmit={() => { }}
                />
            </Box>
        </Box>
    );
};

export default StatusView;
