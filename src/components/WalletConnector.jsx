import React from 'react';

function WalletConnector({ connectWallet, account, networkName, isConnected, error }) {
  // Format address for display
  const formatAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-indigo-700 mb-2">Connect Wallet</h2>
      {isConnected && (
        <div className="flex items-center gap-2 mb-2">
          <div className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700 text-sm truncate max-w-[160px]">{formatAddress(account)}</div>
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">{networkName}</div>
        </div>
      )}
      <div className="text-sm font-medium mb-2 text-gray-500">
        {isConnected ? 'Connected' : 'Not connected'}
      </div>
      <button 
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-150 ${isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed`}
        onClick={connectWallet}
        disabled={!window.ethereum}
      >
        {isConnected ? 'Disconnect' : 'Connect Wallet'}
      </button>
      {error && <div className="mt-2 text-red-600 bg-red-50 rounded px-3 py-2 text-sm">{error}</div>}
    </div>
  );
}

export default WalletConnector;