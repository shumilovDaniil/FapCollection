

import React from 'react';
import { Page } from '../types';
import { FapCoinIcon, LustGemIcon } from './IconComponents';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  fapCoins: number;
  lustGems: number;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, fapCoins, lustGems }) => {
  const navItems = Object.values(Page);

  return (
    <header className="bg-gray-900/70 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-black/30 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-2 sm:mb-0">
          <img src="./logo.png" alt="XCollection Logo" className="h-12 mr-3" />
          <h1 className="text-3xl font-heading text-[color:var(--brand-orange)]">XCollection</h1>
        </div>
        <nav className="flex-grow sm:flex sm:justify-center mb-2 sm:mb-0">
          <ul className="flex items-center space-x-1 sm:space-x-2 bg-gray-800/50 rounded-full p-1.5 flex-wrap justify-center border border-gray-700">
            {navItems.map((page) => (
              <li key={page}>
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base font-bold rounded-full transition-all duration-300 relative transform hover:scale-105 active:scale-95 ${
                    currentPage === page
                      ? 'bg-[color:var(--brand-orange)] text-gray-900 shadow-md shadow-[color:var(--brand-orange)]/30'
                      : 'text-gray-300 hover:bg-gray-700/70'
                  }`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <div className="flex items-center bg-gray-800/50 rounded-full px-4 py-2 border border-gray-700 shadow-inner">
            <FapCoinIcon className="w-6 h-6 mr-2 text-[color:var(--brand-orange)]" />
            <span className="font-bold text-[color:var(--brand-orange)] text-lg">{fapCoins.toLocaleString()}</span>
          </div>
          <div className="flex items-center bg-gray-800/50 rounded-full px-4 py-2 border border-gray-700 shadow-inner">
            <LustGemIcon className="w-6 h-6 mr-2 text-purple-400" />
            <span className="font-bold text-purple-300 text-lg">{lustGems.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;