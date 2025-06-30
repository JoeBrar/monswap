export const disconnectWallet=(setAccount,setSigner,setIsConnected)=>{
  //disconnect wallet when 'Disconnect' button is clicked
  setAccount(null);
  setSigner(null);
  setIsConnected(false);
  return;
}