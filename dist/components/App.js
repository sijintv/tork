import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import Sidebar from './Sidebar.js';
import CommitList from './CommitList.js';
import StatusView from './StatusView.js';
import DiffView from './DiffView.js';
import { push, pull } from '../git.js';
import { MouseProvider } from '../contexts/MouseContext.js';
import { useClick } from '../hooks/useClick.js';
const AppContent = () => {
    const { exit } = useApp();
    const [focusArea, setFocusArea] = useState('sidebar');
    const [viewType, setViewType] = useState('commits');
    const [selectedFile, setSelectedFile] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [inputMode, setInputMode] = useState(false);
    const sidebarRef = useRef(null);
    const contentRef = useRef(null);
    useClick(sidebarRef, () => setFocusArea('sidebar'));
    useClick(contentRef, () => {
        if (viewType === 'commits') {
            setFocusArea('commitList');
        }
        else {
            // In changes view, content is split. 
            // Ideally we should ref StatusView and DiffView separately.
            // But for now, focusing content area works as a fallback.
            if (focusArea === 'sidebar')
                setFocusArea('status');
        }
    });
    useInput(async (input, key) => {
        if (input === 'q') {
            process.exit(0);
        }
        if (key.leftArrow && !inputMode) {
            setFocusArea(prev => {
                if (viewType === 'commits') {
                    return prev === 'commitList' ? 'sidebar' : prev;
                }
                else {
                    if (prev === 'status')
                        return 'sidebar';
                    if (prev === 'diff')
                        return 'status';
                    return prev;
                }
            });
        }
        if (key.rightArrow && !inputMode) {
            setFocusArea(prev => {
                if (viewType === 'commits') {
                    return prev === 'sidebar' ? 'commitList' : prev;
                }
                else {
                    if (prev === 'sidebar')
                        return 'status';
                    if (prev === 'status')
                        return 'diff';
                    return prev;
                }
            });
        }
        if (input === 'p' && focusArea !== 'status') {
            setStatusMessage('Pushing...');
            try {
                await push();
                setStatusMessage('Push successful');
            }
            catch (e) {
                setStatusMessage(`Push failed: ${e.message}`);
            }
        }
        if (input === 'l' && focusArea !== 'status') {
            setStatusMessage('Pulling...');
            try {
                await pull();
                setStatusMessage('Pull successful');
            }
            catch (e) {
                setStatusMessage(`Pull failed: ${e.message}`);
            }
        }
    });
    const handleSidebarSelect = (item) => {
        if (item.value.type === 'branch' || item.value.type === 'commits') {
            setViewType('commits');
            // Maybe filter commits by branch if 'branch'?
            // Currently getting all log.
            // If branch is selected, simple-git log can take branch name.
            // But for now 'commits' view is generic.
        }
        else if (item.value.type === 'changes') {
            setViewType('changes');
        }
    };
    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };
    return (_jsxs(Box, { flexDirection: "column", height: "100%", children: [_jsxs(Box, { borderStyle: "single", borderColor: "green", flexDirection: "row", justifyContent: "space-between", children: [_jsx(Text, { children: "Terminal Fork - 'q': exit, 'Arrows': nav, 'p': push, 'l': pull" }), _jsx(Text, { children: statusMessage })] }), _jsxs(Box, { flexDirection: "row", flexGrow: 1, children: [_jsx(Box, { ref: sidebarRef, flexDirection: "column", width: 35, minWidth: 35, flexShrink: 0, children: _jsx(Sidebar, { isActive: focusArea === 'sidebar', onSelect: handleSidebarSelect }) }), _jsx(Box, { ref: contentRef, flexGrow: 1, flexDirection: "column", children: viewType === 'commits' ? (_jsx(CommitList, { isActive: focusArea === 'commitList', onSelectCommit: () => { } })) : (_jsxs(Box, { flexDirection: "row", flexGrow: 1, children: [_jsx(StatusView, { isActive: focusArea === 'status', onSelectFile: handleFileSelect, onInputModeChange: setInputMode }), _jsx(DiffView, { isActive: focusArea === 'diff', file: selectedFile })] })) })] })] }));
};
const App = () => (_jsx(MouseProvider, { children: _jsx(AppContent, {}) }));
export default App;
