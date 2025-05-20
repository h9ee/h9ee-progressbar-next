"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const DefaultBar = ({ progress, color = '#2299DD', // default color (sky blue)
height = '3px' // default height (3px)
 }) => {
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: progress + '%',
            height: height,
            backgroundColor: color,
            transition: 'width 0.2s ease, opacity 0.3s ease',
            opacity: progress < 100 ? 1 : 0,
            zIndex: 9999
        } }));
};
exports.default = DefaultBar;
