export const connectWallet= async (setError)=>{
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask or compatible wallet not detected");
    }
    const requestedAccounts = await window.ethereum.request({ 
      method: 'wallet_requestPermissions',
      params: [
        {
          eth_accounts: {}
        }
      ]
    });
    // handleAccountsChanged will be triggered by the event listener
  } catch (error) {
    console.error("Connection error:", error);
    setError(error.message);
    setTimeout(() => setError(''), 5000);
  }
}
