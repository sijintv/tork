import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { getDiff } from '../git.js';
import ScrollableList from './ScrollableList.js';
import { useWindowSize } from '../hooks/useWindowSize.js';
import stripAnsi from 'strip-ansi';
const DiffView = ({ file, isActive }) => {
    const [lines, setLines] = useState([]);
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
                }
                catch (e) {
                    setLines([]);
                }
            }
            else {
                setLines([]);
            }
        };
        fetchDiff();
    }, [file]);
    return (_jsxs(Box, { flexDirection: "column", borderStyle: "single", borderColor: isActive ? "blue" : "white", flexGrow: 1, marginLeft: 1, height: height + 2, children: [_jsxs(Text, { bold: true, children: ["Diff: ", file] }), lines.length === 0 ? (_jsx(Box, { height: height, children: _jsx(Text, { color: "gray", children: "No changes or binary file" }) })) : (_jsx(ScrollableList, { items: lines, isActive: isActive, height: height, onSelect: () => { }, renderItem: (item, isSelected) => {
                    const cleanItem = stripAnsi(item);
                    let color = undefined;
                    if (cleanItem.startsWith('+'))
                        color = 'green';
                    else if (cleanItem.startsWith('-'))
                        color = 'red';
                    else if (cleanItem.startsWith('@@'))
                        color = 'cyan';
                    return (_jsx(Text, { color: color, backgroundColor: isSelected ? 'gray' : undefined, wrap: "truncate", children: item }));
                } }))] }));
};
export default DiffView;
