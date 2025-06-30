import { useEffect, useContext } from "react";
import { AppContext } from "@/contexts/AppContext";

const useStoredMonSupply=()=>{
  const {setStoredMonSupply}=useContext(AppContext);

  const updateStoredMonSupply = async () => {
    try{
      const res = await fetch(import.meta.env.VITE_API_URL+'/fetchStoredMonSupply');
      const data = await res.json();
      if(data.monSupply || data.monSupply===0){
        setStoredMonSupply(data.monSupply);
      }
      else{
        throw new Error("Failed to fetch stored MON supply");
      }
    }
    catch(err){
      console.error(err)
    }
  };

  useEffect(() => {
    updateStoredMonSupply();
    const intervalId = setInterval(() => {
      updateStoredMonSupply();
    }, 7000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
}

export default useStoredMonSupply;