"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const navigation_1 = require("next/navigation");
const ProgressBar_1 = __importDefault(require("./ProgressBar"));
const ProgressBarProvider = ({ children, customBar, color, height }) => {
    // Track loading state and progress percentage
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [progress, setProgress] = (0, react_1.useState)(0);
    const [barVisible, setBarVisible] = (0, react_1.useState)(false);
    const intervalRef = (0, react_1.useRef)(null);
    // Get current route pathname (and search params) to detect changes
    const pathname = (0, navigation_1.usePathname)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const prevPath = (0, react_1.useRef)(null);
    // Effect: detect route changes via pathname changes (App Router):contentReference[oaicite:3]{index=3}
    (0, react_1.useEffect)(() => {
        if (prevPath.current !== null && prevPath.current !== pathname) {
            // Pathname changed, meaning navigation is complete
            setIsLoading(false);
        }
        prevPath.current = pathname;
    }, [pathname, searchParams]);
    // Effect: global click handler to catch navigation link clicks and start the bar
    (0, react_1.useEffect)(() => {
        const handleLinkClick = (event) => {
            const target = event.target;
            const anchor = target.closest('a');
            if (!anchor)
                return;
            // Only trigger for internal navigation links
            const href = anchor.getAttribute('href');
            if (!href)
                return;
            if (anchor.target && anchor.target !== '_self')
                return; // ignore new tab/window
            if (href.startsWith('#'))
                return; // ignore same-page anchors
            // Create a URL to check origin and path
            let url;
            try {
                url = new URL(href, window.location.href);
            }
            catch (_a) {
                return;
            }
            if (url.origin !== window.location.origin)
                return; // ignore external links
            const currentPath = window.location.pathname + window.location.search;
            if (url.pathname + url.search === currentPath)
                return; // ignore links to the current page
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
                return; // ignore modified clicks
            // If we reach here, it's an internal client-side navigation
            setIsLoading(true);
        };
        document.addEventListener('click', handleLinkClick);
        return () => {
            document.removeEventListener('click', handleLinkClick);
        };
    }, []);
    // Effect: manage progress bar appearance based on isLoading state
    (0, react_1.useEffect)(() => {
        if (isLoading) {
            // Navigation started: show the bar and begin progress animation
            setBarVisible(true);
            setProgress(10); // start at 10%
            // Gradually increase progress until ~90%
            intervalRef.current = setInterval(() => {
                setProgress(prev => {
                    // Increase by a random step to simulate progress, up to a cap
                    const nextProgress = prev + Math.random() * 10;
                    return nextProgress < 90 ? nextProgress : 90;
                });
            }, 200);
        }
        else {
            // Navigation completed: finish progress and hide the bar
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setProgress(100); // fill the bar to 100%
            // After a short delay, hide the bar (allows the 100% width to be seen)
            const timeout = setTimeout(() => {
                setBarVisible(false);
                setProgress(0); // reset for next navigation
            }, 300);
            return () => {
                clearTimeout(timeout);
            };
        }
        // Clean up on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLoading]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [children, barVisible && (
            // Render custom bar if provided, otherwise the default bar
            customBar
                ? (react_1.default.isValidElement(customBar)
                    ? customBar
                    : react_1.default.createElement(customBar))
                : (0, jsx_runtime_1.jsx)(ProgressBar_1.default, { progress: progress, color: color, height: height }))] }));
};
exports.default = ProgressBarProvider;
