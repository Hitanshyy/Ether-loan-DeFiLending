
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { simulateTransaction } from "@/utils/ethereumUtils";
import { toast } from "@/components/ui/sonner";
import { useWallet } from "@/contexts/WalletContext";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: {
    symbol: string;
    name: string;
    icon: string;
    price: number;
    depositRate: number;
  };
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, token }) => {
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { isConnected, connectWallet } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      connectWallet();
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await simulateTransaction('deposit', token.symbol, parseFloat(amount));
      
      if (success) {
        toast.success(`Successfully deposited ${amount} ${token.symbol}`);
        setAmount('');
        onClose();
      } else {
        toast.error(`Failed to deposit ${token.symbol}`);
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
            <span>Deposit {token.symbol}</span>
          </DialogTitle>
          <DialogDescription>
            Supply {token.symbol} to the protocol and earn {token.depositRate.toFixed(2)}% APY
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="pr-16 bg-defi-secondary/50 border-gray-700"
                  step="0.01"
                  min="0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  {token.symbol}
                </div>
              </div>
              
              {amount && (
                <div className="text-sm text-gray-400">
                  Estimated yearly earnings: {(parseFloat(amount || '0') * token.depositRate / 100).toFixed(4)} {token.symbol}
                </div>
              )}
            </div>
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
              disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
              className="bg-defi-primary hover:bg-defi-primary/90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse">Processing...</span>
                </span>
              ) : (
                "Deposit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
