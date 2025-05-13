
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatHealthFactor, getHealthFactorColor } from "@/utils/ethereumUtils";

interface PositionCardProps {
  type: 'deposit' | 'borrow';
  position: any;
  onWithdraw?: () => void;
  onRepay?: () => void;
}

const PositionCard: React.FC<PositionCardProps> = ({ type, position, onWithdraw, onRepay }) => {
  if (type === 'deposit') {
    // Deposit position
    return (
      <Card className="bg-defi-secondary border-gray-800 shadow-md overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-defi-primary to-defi-primary/70"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Deposited {position.token}</span>
            <span className="text-xs text-gray-400 font-normal">
              Asset Value: ${position.value.toLocaleString()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Amount</span>
              <span className="font-semibold">
                {formatCurrency(position.amount, position.token)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Interest Earned</span>
              <span className="font-semibold text-green-500">
                {formatCurrency(position.interestEarned, position.token)}
              </span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-defi-primary text-defi-primary hover:bg-defi-primary/10"
            onClick={onWithdraw}
          >
            Withdraw
          </Button>
        </CardContent>
      </Card>
    );
  } else {
    // Borrow position
    return (
      <Card className="bg-defi-secondary border-gray-800 shadow-md overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-defi-accent to-defi-accent/70"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Borrowed {position.token}</span>
            <span className="text-xs text-gray-400 font-normal">
              Debt Value: ${position.value.toLocaleString()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Amount</span>
              <span className="font-semibold">
                {formatCurrency(position.amount, position.token)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Interest Accrued</span>
              <span className="font-semibold text-orange-400">
                {formatCurrency(position.interest, position.token)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Collateral</span>
              <span className="font-semibold">
                {formatCurrency(position.collateralAmount, position.collateral)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Health Factor</span>
              <span className={`font-semibold ${getHealthFactorColor(position.healthFactor / 100)}`}>
                {formatHealthFactor(position.healthFactor / 100)}
              </span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full border-defi-accent text-defi-accent hover:bg-defi-accent/10"
            onClick={onRepay}
          >
            Repay
          </Button>
        </CardContent>
      </Card>
    );
  }
};

export default PositionCard;
