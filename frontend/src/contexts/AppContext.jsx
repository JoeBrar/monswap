import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [networkName, setNetworkName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const [userEthBalance, setUserEthBalance] = useState(null);
  const [ethPriceUsd, setEthPriceUsd] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [storedMonSupply, setStoredMonSupply] = useState(null);
  const UsdMonExchangeRate = import.meta.env.VITE_MON_EXCHANGE_RATE;
  const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS;

  const contextValue = {
    chainId,
    account,
    provider,
    signer,
    networkName,
    isConnected,
    error,
    UsdMonExchangeRate,
    userEthBalance,
    ethPriceUsd,
    ADMIN_ADDRESS,
    storedMonSupply,
    setChainId,
    setAccount,
    setProvider,
    setSigner,
    setNetworkName,
    setIsConnected,
    setError,
    setUserEthBalance,
    setEthPriceUsd,
    setStoredMonSupply
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}; 