import { useEffect, useContext, useState } from "react";
import { AppContext } from "@/contexts/AppContext";

const useSwapButtonConfig=(fromAmount, toAmount, setInsufficientSupply)=>{
  const { userEthBalance, account, isConnected, chainId, storedMonSupply } = useContext(AppContext);
  const [swapDisabled, setSwapDisabled] = useState(false);
  const [swapBtnText, setSwapBtnText] = useState("SWAP");

  const supportedChainIds=[1];

  useEffect(()=>{
    if(toAmount<=storedMonSupply){
      setInsufficientSupply(false);
    }

    if(!isConnected || !account){
      setSwapDisabled(true);
      setSwapBtnText('Connect Your Wallet');
      return;
    }
    if(!supportedChainIds.includes(Number(chainId))){
      console.log('here chainId',chainId);
      setSwapDisabled(true);
      setSwapBtnText('Switch to Ethereum Mainnet');
      return;
    }

    const ethInput=parseFloat(fromAmount) || 0;
    if(ethInput <= 0){
      setSwapDisabled(true);
      setSwapBtnText('Enter an amount');
      return;
    }

    if(toAmount>storedMonSupply){
      console.log("here1 , ",toAmount, storedMonSupply);
      setInsufficientSupply(true);
      setSwapDisabled(true);
      setSwapBtnText('Insufficient MON supply');
      return;
    }

    const ethBalance=parseFloat(userEthBalance) || 0;
    if(ethBalance < ethInput){
      setSwapDisabled(true);
      setSwapBtnText('Insufficient ETH balance');
      return;
    }

    setSwapDisabled(false);
    setSwapBtnText('SWAP');
  },[fromAmount, isConnected, chainId, userEthBalance, account, toAmount, storedMonSupply]);

  return { swapDisabled, swapBtnText };
}

export default useSwapButtonConfig;