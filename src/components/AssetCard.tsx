
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercentage } from "@/utils/ethereumUtils";

interface AssetCardProps {
  token: {
    symbol: string;
    name: string;
    icon: string;
    price: number;
    depositRate: number;
    borrowRate: number;
    totalDeposited: number;
    totalBorrowed: number;
    liquidityAvailable: number;
    collateralFactor: number;
  };
  onDeposit: () => void;
  onBorrow: () => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ token, onDeposit, onBorrow }) => {
  return (
    <Card className="bg-defi-secondary border-gray-800 shadow-md card-hover overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-defi-primary to-defi-accent"></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-2xl">{token.icon}</span>
            <span>{token.symbol}</span>
          </CardTitle>
          <div className="text-xs text-gray-400">{token.name}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Supply APY</span>
            <span className="text-defi-primary font-semibold">
              {formatPercentage(token.depositRate)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Borrow APY</span>
            <span className="text-defi-accent font-semibold">
              {formatPercentage(token.borrowRate)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Total Supply</span>
            <span className="font-semibold">
              {formatCurrency(token.totalDeposited, token.symbol)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Total Borrowed</span>
            <span className="font-semibold">
              {formatCurrency(token.totalBorrowed, token.symbol)}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between space-x-2">
          <Button 
            variant="outline" 
            className="w-1/2 border-defi-primary text-defi-primary hover:bg-defi-primary/10"
            onClick={onDeposit}
          >
            Supply
          </Button>
          <Button 
            variant="outline" 
            className="w-1/2 border-defi-accent text-defi-accent hover:bg-defi-accent/10"
            onClick={onBorrow}
          >
            Borrow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetCard;
