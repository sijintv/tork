import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { getGraphLog } from '../git.js';
import ScrollableList from './ScrollableList.js';
import { useWindowSize } from '../hooks/useWindowSize.js';
const CommitList = ({ isActive, onSelectCommit }) => {
    const [lines, setLines] = useState([]);
    const { rows } = useWindowSize();
    useEffect(() => {
        const fetchLog = async () => {
            const log = await getGraphLog();
            setLines(log.split('\n'));
        };
        fetchLog();
    }, []);
    const handleSelect = (line, index) => {
        // Parse hash if needed
    };
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "single", borderColor: isActive ? "green" : "white", flexGrow: 1, children: [_jsx(Text, { bold: true, children: "Commit History (Graph)" }), _jsx(ScrollableList, { items: lines, isActive: isActive, onSelect: handleSelect, height: rows ? Math.max(2, rows - 9) : 10, renderItem: (item, isSelected) => (_jsx(Text, { backgroundColor: isSelected ? 'blue' : undefined, wrap: "truncate", children: item })) })] }));
};
export default CommitList;
