import { useState, useContext } from "react";
import { AppContext } from "@/contexts/AppContext";
import { connectWallet } from "@/utils/connectWallet";
import { disconnectWallet } from "@/utils/disconnectWallet";
import { formatAddress } from "@/utils/formatAddress";
import { FaChevronDown } from "react-icons/fa";
import { useIsMobile } from "@/hooks/useMobile";
import Logo from "@/assets/monswap.png";

const Header = () => {
  const { account, setAccount, setSigner, networkName, isConnected, setIsConnected, setError } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isMobile = useIsMobile();

  const disconnectHandle=()=>{
    disconnectWallet(setAccount,setSigner,setIsConnected);
    setDropdownOpen(false);
  }

  return (
    <header className="bg-white shadow-sm py-0 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="https://www.monswap.pro">
            <img src={Logo} alt="Logo" className="w-25 h-20" />
          </a>
        </div>

        <div className={`flex items-center ${isMobile ? 'flex-col items-end gap-1' : 'gap-3'}`}>
          {isConnected ? (
            <>
              <div>
                <button className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  {networkName}
                </button>
              </div>
              <div className="relative">
                <button
                  className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm font-mono transition-colors flex items-center gap-1 cursor-pointer hover:bg-gray-200"
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  {formatAddress(account)}
                  <span className="ml-1 text-xs"><FaChevronDown /></span>
                </button>
                {dropdownOpen && (
                  <>
                    {/* Overlay to close dropdown on click */}
                    <div
                      className="fixed inset-0 z-10 bg-transparent"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-red-700 rounded-lg shadow-lg z-20">
                      <button
                        onClick={disconnectHandle}
                        className="w-full text-left px-3 py-2 text-md text-red-700 cursor-pointer bg-red-50 hover:bg-red-200 rounded-lg"
                      >
                        Disconnect
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <button 
              onClick={()=>{connectWallet(setError)}}
              className={`bg-blue-500 text-white rounded-full text-md font-medium transition-colors hover:bg-blue-700 cursor-pointer ${isMobile ? 'py-1 px-2' : 'py-2 px-4'}`}
            >
              Connect Wallet
            </button >
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;