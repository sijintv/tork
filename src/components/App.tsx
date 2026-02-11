import React, { useState, useRef } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import Sidebar from './Sidebar.js';
import CommitList from './CommitList.js';
import StatusView from './StatusView.js';
import DiffView from './DiffView.js';
import { push, pull } from '../git.js';
import { MouseProvider } from '../contexts/MouseContext.js';
import { useClick } from '../hooks/useClick.js';
import { DOMElement } from 'ink';

type FocusArea = 'sidebar' | 'status' | 'diff' | 'commitList';
type ViewType = 'commits' | 'changes';

const AppContent = () => {
    const { exit } = useApp();
    const [focusArea, setFocusArea] = useState<FocusArea>('sidebar');
    const [viewType, setViewType] = useState<ViewType>('commits');
    const [selectedFile, setSelectedFile] = useState<string>('');
    const [statusMessage, setStatusMessage] = useState('');
    const [inputMode, setInputMode] = useState(false);

    const sidebarRef = useRef<DOMElement>(null);
    const contentRef = useRef<DOMElement>(null);

    useClick(sidebarRef, () => setFocusArea('sidebar'));
    useClick(contentRef, () => {
        if (viewType === 'commits') {
            setFocusArea('commitList');
        } else {
            // In changes view, content is split. 
            // Ideally we should ref StatusView and DiffView separately.
            // But for now, focusing content area works as a fallback.
            if (focusArea === 'sidebar') setFocusArea('status');
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
                } else {
                    if (prev === 'status') return 'sidebar';
                    if (prev === 'diff') return 'status';
                    return prev;
                }
            });
        }

        if (key.rightArrow && !inputMode) {
            setFocusArea(prev => {
                if (viewType === 'commits') {
                    return prev === 'sidebar' ? 'commitList' : prev;
                } else {
                    if (prev === 'sidebar') return 'status';
                    if (prev === 'status') return 'diff';
                    return prev;
                }
            });
        }

        if (input === 'p' && focusArea !== 'status') {
            setStatusMessage('Pushing...');
            try {
                await push();
                setStatusMessage('Push successful');
            } catch (e: any) {
                setStatusMessage(`Push failed: ${e.message}`);
            }
        }
        if (input === 'l' && focusArea !== 'status') {
            setStatusMessage('Pulling...');
            try {
                await pull();
                setStatusMessage('Pull successful');
            } catch (e: any) {
                setStatusMessage(`Pull failed: ${e.message}`);
            }
        }
    });

    const handleSidebarSelect = (item: any) => {
        if (item.value.type === 'branch' || item.value.type === 'commits') {
            setViewType('commits');
            // Maybe filter commits by branch if 'branch'?
            // Currently getting all log.
            // If branch is selected, simple-git log can take branch name.
            // But for now 'commits' view is generic.
        } else if (item.value.type === 'changes') {
            setViewType('changes');
        }
    };

    const handleFileSelect = (file: string) => {
        setSelectedFile(file);
    };

    return (
        <Box flexDirection="column" height="100%">
            <Box borderStyle="single" borderColor="green" flexDirection="row" justifyContent="space-between">
                <Text>Terminal Fork - 'q': exit, 'Arrows': nav, 'p': push, 'l': pull</Text>
                <Text>{statusMessage}</Text>
            </Box>
            <Box flexDirection="row" flexGrow={1}>
                <Box ref={sidebarRef} flexDirection="column" width={35} minWidth={35} flexShrink={0}>
                    <Sidebar
                        isActive={focusArea === 'sidebar'}
                        onSelect={handleSidebarSelect}
                    />
                </Box>

                <Box ref={contentRef} flexGrow={1} flexDirection="column">
                    {viewType === 'commits' ? (
                        <CommitList
                            isActive={focusArea === 'commitList'}
                            onSelectCommit={() => { }}
                        />
                    ) : (
                        <Box flexDirection="row" flexGrow={1}>
                            <StatusView
                                isActive={focusArea === 'status'}
                                onSelectFile={handleFileSelect}
                                onInputModeChange={setInputMode}
                            />
                            <DiffView
                                isActive={focusArea === 'diff'}
                                file={selectedFile}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

const App = () => (
    <MouseProvider>
        <AppContent />
    </MouseProvider>
);

export default App;
