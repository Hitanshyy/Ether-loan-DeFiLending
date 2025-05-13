
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from '@/contexts/WalletContext';
import { mockUserPositions } from '@/utils/ethereumUtils';
import PositionCard from '@/components/PositionCard';
import { toast } from '@/components/ui/sonner';
import { Link } from 'react-router-dom';
import { Wallet, Plus } from 'lucide-react';

const Dashboard = () => {
  const { isConnected, account, balance, connectWallet } = useWallet();
  const [positions, setPositions] = useState(mockUserPositions);

  // Sum up the values
  const totalSupplied = positions.deposits.reduce((sum, pos) => sum + pos.value, 0);
  const totalBorrowed = positions.borrows.reduce((sum, pos) => sum + pos.value, 0);
  const netAPY = 0.5; // Mock value - would be calculated from positions

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-8">Connect your wallet to view your dashboard and positions.</p>
          <Button 
            onClick={connectWallet} 
            size="lg"
            className="bg-defi-primary hover:bg-defi-primary/90 text-white"
          >
            <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  const handleWithdraw = (token: string) => {
    toast.info(`Withdraw functionality would be implemented for ${token}`);
    // In a real app, this would open a withdraw modal and handle the transaction
  };

  const handleRepay = (token: string) => {
    toast.info(`Repay functionality would be implemented for ${token}`);
    // In a real app, this would open a repay modal and handle the transaction
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
        <p className="text-gray-400">Manage your supplied and borrowed assets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard 
          title="Total Supplied" 
          value={`$${totalSupplied.toLocaleString()}`}
          className="bg-gradient-to-br from-defi-secondary to-defi-secondary/70 border-l-4 border-defi-primary" 
        />
        <SummaryCard 
          title="Total Borrowed" 
          value={`$${totalBorrowed.toLocaleString()}`}
          className="bg-gradient-to-br from-defi-secondary to-defi-secondary/70 border-l-4 border-defi-accent" 
        />
        <SummaryCard 
          title="Net APY" 
          value={`${netAPY.toFixed(2)}%`}
          className="bg-gradient-to-br from-defi-secondary to-defi-secondary/70 border-l-4 border-green-500" 
        />
      </div>

      {positions.deposits.length === 0 && positions.borrows.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No Positions Yet</h2>
          <p className="text-gray-400 mb-6">Start by supplying assets or taking out a loan.</p>
          <Link to="/markets">
            <Button className="bg-defi-primary hover:bg-defi-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Supply or Borrow
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {positions.deposits.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Your Supplied Assets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {positions.deposits.map((position, index) => (
                  <PositionCard 
                    key={index}
                    type="deposit"
                    position={position}
                    onWithdraw={() => handleWithdraw(position.token)}
                  />
                ))}
              </div>
            </section>
          )}

          {positions.borrows.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">Your Borrowed Assets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {positions.borrows.map((position, index) => (
                  <PositionCard 
                    key={index}
                    type="borrow"
                    position={position}
                    onRepay={() => handleRepay(position.token)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string;
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, className }) => (
  <Card className={`shadow-md ${className}`}>
    <CardContent className="pt-6">
      <h2 className="text-gray-400 text-sm">{title}</h2>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </CardContent>
  </Card>
);

export default Dashboard;
