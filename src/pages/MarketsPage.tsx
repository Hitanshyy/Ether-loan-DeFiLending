
import React, { useState } from 'react';
import { tokens } from '@/utils/ethereumUtils';
import AssetCard from '@/components/AssetCard';
import DepositModal from '@/components/DepositModal';
import BorrowModal from '@/components/BorrowModal';
import MarketInfo from '@/components/MarketInfo';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/sonner';

const MarketsPage = () => {
  const { isConnected } = useWallet();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(tokens[0]);

  const handleDeposit = (token: any) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    setSelectedToken(token);
    setDepositModalOpen(true);
  };

  const handleBorrow = (token: any) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    setSelectedToken(token);
    setBorrowModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Markets</h1>
        <p className="text-gray-400">View all available assets, supply and borrow rates.</p>
      </div>

      <MarketInfo />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokens.map((token) => (
          <AssetCard 
            key={token.symbol}
            token={token}
            onDeposit={() => handleDeposit(token)}
            onBorrow={() => handleBorrow(token)}
          />
        ))}
      </div>

      {depositModalOpen && (
        <DepositModal 
          isOpen={depositModalOpen}
          onClose={() => setDepositModalOpen(false)}
          token={selectedToken}
        />
      )}

      {borrowModalOpen && (
        <BorrowModal 
          isOpen={borrowModalOpen}
          onClose={() => setBorrowModalOpen(false)}
          token={selectedToken}
        />
      )}
    </div>
  );
};

export default MarketsPage;
