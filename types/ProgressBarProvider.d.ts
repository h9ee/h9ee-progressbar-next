import React from 'react';
interface ProgressBarProviderProps {
    children: React.ReactNode;
    /** Custom progress bar component to use (if provided). */
    customBar?: React.ComponentType<any> | React.ReactElement;
    /** Color of the default progress bar (ignored if customBar is used). */
    color?: string;
    /** Height of the default progress bar in CSS units (ignored if customBar is used). */
    height?: string;
}
declare const ProgressBarProvider: React.FC<ProgressBarProviderProps>;
export default ProgressBarProvider;
