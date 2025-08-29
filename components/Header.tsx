
import React from 'react';
import type { Theme } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
    theme: Theme;
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    return (
        <header className="py-4 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-primary-500 to-fuchsia-500 bg-clip-text text-transparent">
                        BanaO
                    </span>
                </h1>
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
        </header>
    );
}
