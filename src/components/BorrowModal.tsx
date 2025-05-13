
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { simulateTransaction, tokens, calculateHealthFactor, formatHealthFactor, getHealthFactorColor } from "@/utils/ethereumUtils";
import { toast } from "@/components/ui/sonner";
import { useWallet } from "@/contexts/WalletContext";

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: {
    symbol: string;
    name: string;
    icon: string;
    price: number;
    borrowRate: number;
  };
}

const BorrowModal: React.FC<BorrowModalProps> = ({ isOpen, onClose, token }) => {
  const [borrowAmount, setBorrowAmount] = useState<string>('');
  const [collateralToken, setCollateralToken] = useState<string>('ETH');
  const [collateralAmount, setCollateralAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { isConnected, connectWallet } = useWallet();

  // Get the collateral token details
  const collateral = tokens.find(t => t.symbol === collateralToken);
  
  // Calculate health factor
  const borrowValue = parseFloat(borrowAmount || '0') * token.price;
  const collateralValue = parseFloat(collateralAmount || '0') * (collateral?.price || 0);
  const healthFactor = calculateHealthFactor(
    collateralValue, 
    borrowValue, 
    collateral?.collateralFactor || 0
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      connectWallet();
      return;
    }
    
    if (!borrowAmount || parseFloat(borrowAmount) <= 0) {
      toast.error("Please enter a valid borrow amount");
      return;
    }
    
    if (!collateralAmount || parseFloat(collateralAmount) <= 0) {
      toast.error("Please enter a valid collateral amount");
      return;
    }
    
    if (healthFactor < 1.2) {
      toast.error("Health factor is too low. Increase collateral or decrease borrow amount.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await simulateTransaction('borrow', token.symbol, parseFloat(borrowAmount));
      
      if (success) {
        toast.success(`Successfully borrowed ${borrowAmount} ${token.symbol}`);
        setBorrowAmount('');
        setCollateralAmount('');
        onClose();
      } else {
        toast.error(`Failed to borrow ${token.symbol}`);
      }
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogContent className="bg-defi-secondary border-gray-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span>{token.icon}</span>
            <span>Borrow {token.symbol}</span>
          </DialogTitle>
          <DialogDescription>
            Borrow {token.symbol} from the protocol at {token.borrowRate.toFixed(2)}% APY
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="borrowAmount">Borrow Amount</Label>
              <div className="relative">
                <Input
                  id="borrowAmount"
                  type="number"
                  placeholder="0.0"
                  value={borrowAmount}
                  onChange={e => setBorrowAmount(e.target.value)}
                  className="pr-16 bg-defi-secondary/50 border-gray-700"
                  step="0.01"
                  min="0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  {token.symbol}
                </div>
              </div>
              
              {borrowAmount && (
                <div className="text-sm text-gray-400">
                  Yearly interest: {(parseFloat(borrowAmount || '0') * token.borrowRate / 100).toFixed(4)} {token.symbol}
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="collateralToken">Collateral Token</Label>
              <Select 
                defaultValue={collateralToken} 
                onValueChange={value => setCollateralToken(value)}
              >
                <SelectTrigger className="bg-defi-secondary/50 border-gray-700">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent className="bg-defi-secondary border-gray-700">
                  {tokens.filter(t => t.symbol !== token.symbol).map(token => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center gap-2">
                        <span>{token.icon}</span>
                        <span>{token.symbol}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="collateralAmount">Collateral Amount</Label>
              <div className="relative">
                <Input
                  id="collateralAmount"
                  type="number"
                  placeholder="0.0"
                  value={collateralAmount}
                  onChange={e => setCollateralAmount(e.target.value)}
                  className="pr-16 bg-defi-secondary/50 border-gray-700"
                  step="0.01"
                  min="0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  {collateralToken}
                </div>
              </div>
            </div>
            
            {borrowAmount && collateralAmount && collateral && (
              <div className="p-3 rounded-md bg-defi-secondary/30 border border-gray-700">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Health Factor:</span>
                  <span className={`text-sm font-semibold ${getHealthFactorColor(healthFactor)}`}>
                    {formatHealthFactor(healthFactor)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Max Borrow:</span>
                  <span className="text-sm">
                    {((collateralValue * collateral.collateralFactor / 100) / token.price).toFixed(4)} {token.symbol}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                isSubmitting || 
                !borrowAmount || 
                parseFloat(borrowAmount) <= 0 || 
                !collateralAmount || 
                parseFloat(collateralAmount) <= 0 ||
                healthFactor < 1.2
              }
              className="bg-defi-primary hover:bg-defi-primary/90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">Processing...</span>
                </span>
              ) : (
                "Borrow"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowModal;
