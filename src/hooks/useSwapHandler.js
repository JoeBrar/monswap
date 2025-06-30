import { useState, useContext } from "react";
import { AppContext } from "@/contexts/AppContext";
import { ethers } from "ethers";
import axios from "axios";

const useSwapHandler=(fromAmount, toAmount, setFromAmount)=>{
  const { signer, ADMIN_ADDRESS } = useContext(AppContext);
  const [status, setStatus] = useState({ show: false, isError: false });
  
  const handleCloseModal = () => {
    setStatus({ ...status, show: false, isError: false });
  };

  const sendSwapRequest=async (txHash)=>{
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/swap`, {txHash: txHash});
      setStatus({
        show: true,
        stage: "monTxSuccess",
        txHash: response.data.monadTxHash,
        monAmount: response.data.monAmount,
        isError: false
      });
    } catch (error) {
      console.error('error - ',error.response.data);
      setStatus({
        show: true,
        stage:'userTxFailed',
        error:error.message,
        isError: true
      });
    }
  }

  const initiateSwap = async () => {
    try {
      const eth = parseFloat(fromAmount);
      
      if (!eth || eth <= 0 || typeof eth !== 'number') {
        throw new Error("Please enter a valid ETH amount");
      }

      //fetch the latest mon supply and check if it is sufficient for the swap
      const res = await fetch(import.meta.env.VITE_API_URL+'/fetchLatestMonSupply');
      const data = await res.json();
      if(data.monSupply){
        if(data.monSupply<toAmount){
          setStatus({
            show: true,
            stage:'insufficientMonSupply',
            error:"Timeout - Please wait 15 seconds and refresh the page.",
            isError: true
          });
          return;
        }
      }
      else{
        setStatus({
          show: true,
          stage:'userTxFailed',
          error:"Internal error. Please try again later.",
          isError: true
        });
      }

      setStatus({
        show: true,
        stage: "initiating",
        isError: false
      });

      const ethAmountWei = ethers.parseEther(eth.toString());
      
      const tx = await signer.sendTransaction({
        to: ADMIN_ADDRESS,
        value: ethAmountWei,
        gasLimit: 21000
      });
      
      setStatus({
        show: true,
        stage: "awaitingConfirmation",
        isError: false
      });
      
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setStatus({
          show: true,
          stage:'userTxSuccess',
          txHash:tx.hash,
          isError: false
        });
        
        sendSwapRequest(tx.hash);
        setFromAmount(null);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      setStatus({
        show: true,
        stage:'userTxFailed',
        error:error.message,
        isError: true
      });
    }
  };

  return { initiateSwap, status, setStatus, handleCloseModal };

}

export default useSwapHandler;