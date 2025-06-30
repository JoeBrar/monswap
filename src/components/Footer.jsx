import React from 'react';
import { BsTwitterX } from "react-icons/bs";

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-3 pb-2 px-4 text-center text-gray-500 text-sm mt-auto flex flex-col gap-4 items-center">
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 items-center justify-center text-xs">
        <span className='flex items-center gap-1.5'>
          Created by <a href="https://x.com/_DigitalDaku_" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@_DigitalDaku_ </a>
          <a href="https://x.com/_DigitalDaku_" target="_blank" rel="noopener noreferrer">
            <div className=' bg-black rounded-full p-1'>
              <BsTwitterX color='white' size={9}/>
            </div>
          </a>
        </span>
        <span className="hidden sm:inline">|</span>
        <span>Contact: <a href="mailto:support@dakucrypto.com" className="text-blue-600 hover:underline">support@dakucrypto.com</a></span>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        &copy; 2025 DakuCrypto. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer