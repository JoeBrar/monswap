import { useEffect, useContext } from "react";
import { AppContext } from "@/contexts/AppContext";

const useUpdatedEthPrice=()=>{
  const {setEthPriceUsd}=useContext(AppContext);

  const updateEthPrice = async () => {
    try{
      const res = await fetch(import.meta.env.VITE_API_URL+'/getEthPrice');
      const data = await res.json();
      if(data.ethPrice){
        setEthPriceUsd(data.ethPrice);
      }
      else{
        throw new Error("Failed to fetch ETH price");
      }
    }
    catch(err){
      console.error(err)
    }
  };

  useEffect(() => {
    updateEthPrice();
    const intervalId = setInterval(() => {
      updateEthPrice();
    }, 15000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
}

export default useUpdatedEthPrice;