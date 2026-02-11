import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useMemo } from 'react';
import { Box, Text, useInput } from 'ink';
import { getStatus, stage, unstage, commit, getLastCommitMessage } from '../git.js';
import ScrollableList from './ScrollableList.js';
import TextInput from 'ink-text-input';
import { useWindowSize } from '../hooks/useWindowSize.js';
const StatusView = ({ isActive, onSelectFile, onInputModeChange }) => {
    const [status, setStatus] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [highlightedItem, setHighlightedItem] = useState(null);
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
        if (!isActive)
            return;
        if (focusInput) {
            if (key.escape) {
                setFocusInput(false);
                if (onInputModeChange)
                    onInputModeChange(false);
            }
            if (key.return) {
                if (commitMessage.trim()) {
                    await commit(commitMessage, { amend });
                    setCommitMessage('');
                    setAmend(false);
                    setFocusInput(false);
                    if (onInputModeChange)
                        onInputModeChange(false);
                    setRefreshKey(prev => prev + 1);
                }
            }
            return;
        }
        if (input === 'c') {
            setFocusInput(true);
            if (onInputModeChange)
                onInputModeChange(true);
        }
        if (input === 'a') {
            const newAmend = !amend;
            setAmend(newAmend);
            if (newAmend) {
                const msg = await getLastCommitMessage();
                setCommitMessage(msg);
            }
            else {
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
    const items = useMemo(() => {
        if (!status)
            return [];
        const stagedFiles = status.files.filter(f => f.index !== '?' && f.index !== ' ');
        const unstagedFiles = status.files.filter(f => f.index === '?' || f.working_dir !== ' ');
        return [
            ...(stagedFiles.length > 0 ? [{ label: '--- Staged ---', value: 'header_staged', type: 'header' }] : []),
            ...stagedFiles.map(file => ({
                label: `  ${file.path}`,
                value: file.path,
                type: 'file'
            })),
            ...(unstagedFiles.length > 0 ? [{ label: '--- Unstaged ---', value: 'header_unstaged', type: 'header' }] : []),
            ...unstagedFiles.map(file => ({
                label: `  ${file.path}`,
                value: file.path,
                type: 'file'
            }))
        ];
    }, [status]);
    if (!status)
        return _jsx(Text, { children: "Loading status..." });
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "single", borderColor: isActive ? "green" : "white", width: "30%", children: [_jsxs(Text, { bold: true, children: ["Changes ", amend ? '[AMEND]' : ''] }), _jsx(Text, { color: "gray", children: "s: stage, u: unstage, c: commit, a: amend" }), _jsx(Box, { flexGrow: 1, children: items.length === 0 ? (_jsx(Text, { children: "No changes" })) : (_jsx(ScrollableList, { items: items, isActive: isActive && !focusInput, onHighlight: setHighlightedItem, onSelect: (item) => {
                        if (item.type === 'header')
                            return;
                        onSelectFile(item.value);
                    }, height: rows ? Math.max(2, rows - 17) : 10, renderItem: (item, isSelected) => {
                        const isHeader = item.type === 'header';
                        return (_jsx(Text, { color: isSelected ? 'green' : (isHeader ? 'yellow' : undefined), backgroundColor: isSelected ? 'blue' : undefined, bold: isHeader, wrap: "truncate", children: item.label }));
                    } })) }), _jsxs(Box, { borderStyle: "single", borderColor: focusInput ? "blue" : "gray", flexDirection: "column", children: [_jsx(Text, { children: "Commit Message:" }), _jsx(TextInput, { value: commitMessage, onChange: setCommitMessage, focus: isActive && focusInput, onSubmit: () => { } })] })] }));
};
export default StatusView;
