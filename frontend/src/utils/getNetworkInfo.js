export const getNetworkInfo = async (provider, setNetworkName, setChainId, setError) => {
  if (provider) {
    try {
      const network = await provider.getNetwork();
      setNetworkName(network.name.charAt(0).toUpperCase() + network.name.slice(1));
      setChainId(network.chainId);
      if (network.chainId != 1) {
        setError("Please switch to Ethereum Mainnet");
      } else {
        setError('');
      }
    } catch (error) {
      console.error("Network info error:", error);
    }
  }
};