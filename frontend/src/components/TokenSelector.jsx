import { useState } from "react";
import mon_logo from '@/assets/mon_logo.png';

const TokenSelector = ({ token, onSelectToken }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const tokenClasses = token.symbol === "ETH" 
    ? "bg-blue-100 text-blue-500" 
    : "bg-purple-100 text-purple-500";
  
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <div className="flex flex-col items-start">
          {/* <span className="text-xs text-gray-500 uppercase">TOKEN</span> */}
          <button 
            onClick={toggleDropdown}
            className="flex items-center gap-2 text-gray-800 mt-1"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tokenClasses}`}>
              {token.symbol === "ETH" ? (
                <svg className="w-5 h-5 text-blue-500" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#627EEA"/>
                  <path d="M16.498 4V12.87L23.995 16.22L16.498 4Z" fill="white" fillOpacity="0.6"/>
                  <path d="M16.498 4L9 16.22L16.498 12.87V4Z" fill="white"/>
                  <path d="M16.498 21.968V27.995L24 17.616L16.498 21.968Z" fill="white" fillOpacity="0.6"/>
                  <path d="M16.498 27.995V21.967L9 17.616L16.498 27.995Z" fill="white"/>
                  <path d="M16.498 20.5731L23.995 16.2201L16.498 12.8721V20.5731Z" fill="white" fillOpacity="0.2"/>
                  <path d="M9 16.2201L16.498 20.5731V12.8721L9 16.2201Z" fill="white" fillOpacity="0.6"/>
                </svg>
              ) : (
                <img src={mon_logo} alt="Mon Logo" width={100} height={50} />
              )}
            </div>
            <span className="font-semibold">{token.symbol}</span>
          </button>
        </div>
        
        <div className="ml-auto text-right">
          <span className="text-xs text-gray-500 uppercase">
            {token.network}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenSelector;