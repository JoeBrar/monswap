import { useState, useEffect, useContext } from "react";
import { AppContext } from "@/contexts/AppContext";
import { formatNumber } from "@/utils/formatNumber";

const TokenInput = ({ value, onChange, showMax = false, type }) => {
  const { UsdMonExchangeRate, account, signer, ethPriceUsd, userEthBalance, chainId } = useContext(AppContext);

  const handleChange = (e) => {
    const regex = /^\d*\.?\d*$/;
    if(!regex.test(e.target.value) || Number(e.target.value)<0){
      return;
    }
    onChange(e.target.value);
  };

  const handleMax = () => {
    if(userEthBalance){
      const factor = Math.pow(10, 5);
      const maxValueRounded = Math.floor(userEthBalance * factor) / factor;
      onChange(maxValueRounded);
    }
  };

  return (
    <div className="mt-1">
      {(type === 'from' && userEthBalance && chainId == 1) && (
        <div className="text-xs text-gray-500">
          Available: {userEthBalance !== null ? `${formatNumber(Number(userEthBalance), 5)} ETH` : ''}
        </div>
      )}
      <div className="flex items-stretch gap-1">
        <input
          disabled={type === 'to'}
          type="number"
          inputMode='decimal'
          value={value}
          min={0}
          step={0.01}
          onChange={handleChange}
          className="text-3xl font-semibold outline-none w-full !mb-0"
          placeholder="0.0"
        />
        {showMax && (
          <div className="">
            <button 
              onClick={handleMax}
              className="h-full bg-blue-100 px-4 py-1 rounded-lg text-sm text-blue-800 font-semibold shadow-sm hover:bg-blue-200 transition-colors cursor-pointer"
            >
              MAX
            </button>
          </div>
        )}
      </div>
      {type === 'from' && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">${formatNumber(value * ethPriceUsd)}</span>
        </div>
      )}
      
    </div>
  );
};

export default TokenInput;