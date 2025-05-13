
import React from 'react';
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Wallet } from "lucide-react";

const WalletConnect: React.FC = () => {
  const { account, balance, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium">{shortenAddress(account || '')}</span>
            <span className="text-xs text-gray-400">{balance} ETH</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnectWallet}
            className="border-defi-primary text-defi-primary hover:bg-defi-primary/10"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          onClick={connectWallet} 
          disabled={isConnecting} 
          className="bg-defi-primary hover:bg-defi-primary/90 text-white"
        >
          {isConnecting ? (
            <span className="flex items-center gap-2">
              <span className="animate-pulse">Connecting...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Wallet size={16} />
              Connect Wallet
            </span>
          )}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
