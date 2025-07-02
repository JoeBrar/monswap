import { useState, useEffect, useContext } from "react";
import { ethers } from 'ethers';
import Header from "@/components/Header";
import SwapCard from "@/components/SwapCard";
import { AppContext } from "@/contexts/AppContext";
import { getNetworkInfo } from "@/utils/getNetworkInfo";
import Footer from "@/components/Footer";

const Home = () => {
  const { account, setAccount, provider, setProvider, signer, setSigner, networkName, setNetworkName, isConnected, setIsConnected, error, setError, setChainId } = useContext(AppContext);

  // Initialize provider if ethereum is available
  useEffect(() => {
    if(!window.ethereum) return

    const ethProvider = new ethers.BrowserProvider(window.ethereum);
    setProvider(ethProvider);

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
        setSigner(null);
        setIsConnected(false);
      } else {
        if(typeof accounts[0] === 'string'){
          setAccount(accounts[0]);
        }
        else{
          setAccount(accounts[0].address);
        }
        const curSigner=await ethProvider.getSigner();
        setSigner(curSigner);
        setIsConnected(true);
      }
    }
    
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', () => window.location.reload());
    
    // Check if already connected
    ethProvider.listAccounts().then(accounts => {
      if (accounts.length > 0) {
        handleAccountsChanged(accounts);
      }
    });
    
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  useEffect(() => {
    if (provider) {
      getNetworkInfo(provider, setNetworkName, setChainId, setError);
    }
  }, [provider, account]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto p-8 flex flex-col items-center justify-center">
        <SwapCard />
      </main>
      <div className="max-w-7xl mx-auto mt-16 px-5 text-center">
        {/* <div className="max-w-xl mx-auto text-sm text-gray-600">
          <span>
            Didn't recieve MON? Please contact us. We will verify the transaction and issue a refund.
          </span>
        </div> */}
        <div className="mt-5 mb-15">
          <a
            href="https://faucet.monad.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 text-base border-b-2 border-transparent  hover:border-blue-600 transition"
          >
            MONAD TESTNET FAUCET
          </a>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Home;