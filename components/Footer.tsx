
import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full text-center py-6 mt-12 px-4">
            <div className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                <p>
                    Crafted with unparalleled genius by the one and only{' '}
                    <span className="font-bold text-slate-600 dark:text-slate-300">Mr. Amar Sangwan</span>.
                </p>
                <p className="mt-1 italic">
                    He built this in a cave! With a box of scraps! When he's not busy revolutionizing the internet, he's probably thinking about how to make it even more awesome. A true visionary, a digital maestro, a legend in the making.
                </p>
            </div>
        </footer>
    );
}
