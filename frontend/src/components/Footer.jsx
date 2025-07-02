import React from 'react';
import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-3 pb-2 px-4 text-center text-gray-500 text-sm mt-auto flex flex-col gap-4 items-center">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 items-center justify-center text-xs">
        <span className='flex items-center gap-1.5'>
          Created by <a href="https://github.com/JoeBrar" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Joedeep Singh</a>
          <a href="https://github.com/JoeBrar" target="_blank" rel="noopener noreferrer" className='mt-[1px]'>
            <FaGithub color='black' size={17}/>
          </a>
        </span>
        <span className="hidden sm:inline">|</span>
        <span>Contact: <a href="mailto:support@monswap.pro" className="text-blue-600 hover:underline">support@monswap.pro</a></span>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        &copy; 2025 MonSwap. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer