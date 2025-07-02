import { useState, useEffect, useContext } from "react";
import TokenSelector from "./TokenSelector";
import TokenInput from "./TokenInput";
import { AppContext } from "@/contexts/AppContext";
import { ethers } from "ethers";
import { formatNumber } from "@/utils/formatNumber";
import { IoArrowDown } from "react-icons/io5";
import { FiInfo } from "react-icons/fi";
import TxnStatusModal from "./TxnStatusModal";
import useUpdatedEthPrice from "@/hooks/useUpdatedEthPrice";
import useStoredMonSupply from "../hooks/useStoredMonSupply";
import useSwapButtonConfig from "@/hooks/useSwapButtonConfig";
import useSwapHandler from "@/hooks/useSwapHandler";
import { useIsMobile } from "@/hooks/useMobile";
import AppHeading from "@/components/AppHeading";
import axios from "axios";
import { FaRegStar } from "react-icons/fa";

const SwapCard = () => {
  const [fromToken, setFromToken] = useState({
    symbol: "ETH",
    name: "Ethereum",
    logo: "ethereum",
    network: "ETHEREUM MAINNET"
  });
  
  const [toToken, setToToken] = useState({
    symbol: "MON",
    name: "Monad",
    logo: "monad",
    network: "MONAD TESTNET"
  });
  
  const [fromAmount, setFromAmount] = useState(null);
  const [toAmount, setToAmount] = useState(0);
  const [insufficientSupply, setInsufficientSupply] = useState(false);
  const { ethPriceUsd, setEthPriceUsd, storedMonSupply, userEthBalance, setUserEthBalance, signer, account, UsdMonExchangeRate, isConnected, chainId, ADMIN_ADDRESS } = useContext(AppContext);
  const { swapDisabled, swapBtnText } = useSwapButtonConfig(fromAmount, toAmount, setInsufficientSupply);
  const { initiateSwap, status, setStatus, handleCloseModal } = useSwapHandler(fromAmount, toAmount, setFromAmount);
  const isMobile = useIsMobile();

  useUpdatedEthPrice();  
  useStoredMonSupply();

  const fetchUserBalance=async()=>{
    if (signer && account) {
      try {
        const balance = await signer.provider.getBalance(account);
        setUserEthBalance(ethers.formatEther(balance));
      } catch (err) {
        setUserEthBalance(null);
      }
    }
  }

  useEffect(() => {
    if(ethPriceUsd && fromAmount){
      const eth = parseFloat(fromAmount) || 0;
      const mon = formatNumber(eth * ethPriceUsd * UsdMonExchangeRate,3,false);
      setToAmount(mon);
    }
    else{
      setToAmount(0);
    }
  }, [fromAmount, ethPriceUsd]);

  useEffect(()=>{
    fetchUserBalance();
  },[account, signer])
  
  return (
    <div className="w-full max-w-md">
      <div>
        <AppHeading />
      </div>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* From Token Section */}
        <div className="p-6">
          <TokenSelector 
            token={fromToken} 
            onSelectToken={setFromToken}
          />
          <TokenInput 
            type='from'
            value={fromAmount} 
            onChange={setFromAmount}
            showMax={true}
          />
        </div>
        
        {/* Swap Direction Button */}
        <div className="flex justify-center items-center">
          <div className="h-[1px] bg-gray-200 w-full mr-2 ml-4"></div>
          <div className="bg-gray-100 rounded-full p-2 hover:bg-gray-200">
            <IoArrowDown className="text-[30px]" style={{color:'#386f8c'}}/>
          </div>
          <div className="h-[1px] bg-gray-200 w-full ml-2 mr-4"></div>
        </div>
        
        {/* To Token Section */}
        <div className="p-6">
          <TokenSelector 
            token={toToken} 
            onSelectToken={setToToken}
          />
          <TokenInput 
            type='to'
            value={toAmount} 
            onChange={setToAmount}
            showMax={false}
          />
        </div>
      </div>

      {/* Price Information */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md mt-4 p-4 border border-green-400">
        <div className="flex justify-between items-center text-sm mb-3">
          <span className={`bg-yellow-200 text-yellow-800 font-semibold px-3 py-1 rounded border border-yellow-300 tracking-wide ${isMobile ? 'text-[11px]' : 'text-[13px]'}`}>EXCLUSIVE PRICE</span>
          <span className={`text-gray-700 font-bold ${isMobile?'text-[15px]':'text-[18px]'} `}>{`$1 = ${UsdMonExchangeRate} MON`}</span>
        </div>
        <div className={`flex items-center gap-2 mt-3 justify-between`}>
          <span className={`${isMobile?'text-[16px]':'text-[18px]'} ${insufficientSupply?'text-red-500 font-semibold':'text-gray-500'}`}>Available Supply</span>
          <span className={`font-medium text-[#457780] bg-[#e6eef3] px-2 py-0.5 rounded ${isMobile?'text-[14px]':'text-[16px]'} ${insufficientSupply?'text-red-500 font-semibold bg-[#bb0000]':''}`}>{(storedMonSupply || storedMonSupply===0)?storedMonSupply.toLocaleString():'...'} MON</span> {/* TODO: Replace with dynamic value */}
        </div>
        <div className={`text-[13px] text-gray-500 leading-relaxed mt-0.5 flex items-start gap-1 ${isMobile ? 'mt-3' : ''} ${insufficientSupply?'text-red-500 font-semibold':''}`}>
          <span className={`text-gray-600 text-[17px] mt-1 ${insufficientSupply?'text-red-500':''} `}><FiInfo /></span>
          Need more? Please check back soon - supply is regularly updated
        </div>
      </div>
      
      <button
        className="w-full mt-5 bg-purple-600 text-white py-4 px-4 rounded-xl font-medium cursor-pointer hover:bg-purple-700 disabled:opacity-70 disabled:bg-gray-400 disabled:cursor-auto"
        disabled={swapDisabled}
        onClick={initiateSwap}
      >
        {swapBtnText}
      </button>
      <TxnStatusModal status={status} onClose={handleCloseModal} />
    </div>
  );
};

export default SwapCard;