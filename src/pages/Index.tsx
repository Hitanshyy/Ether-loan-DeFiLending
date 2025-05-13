
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import MarketInfo from '@/components/MarketInfo';
import { useWallet } from '@/contexts/WalletContext';
import { ArrowRight, Coins, Lock, Wallet } from 'lucide-react';

const Index = () => {
  const { isConnected, connectWallet } = useWallet();

  return (
    <div className="space-y-8">
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-defi-primary to-defi-accent">
          Decentralized Lending Protocol
        </h1>
        <p className="text-lg mb-8 text-gray-300 max-w-3xl mx-auto">
          Deposit assets, earn interest, and borrow against your collateral in a secure, decentralized environment powered by Ethereum.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {!isConnected ? (
            <Button 
              onClick={connectWallet} 
              size="lg"
              className="bg-defi-primary hover:bg-defi-primary/90 text-white"
            >
              <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          ) : (
            <Link to="/markets">
              <Button 
                size="lg"
                className="bg-defi-primary hover:bg-defi-primary/90 text-white"
              >
                <Coins className="mr-2 h-4 w-4" /> View Markets
              </Button>
            </Link>
          )}
          <Link to="/dashboard">
            <Button 
              variant="outline" 
              size="lg"
              className="border-defi-accent text-defi-accent hover:bg-defi-accent/10"
            >
              <Lock className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
        </div>
      </section>

      <div className="mb-8">
        <MarketInfo />
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          title="Supply Assets" 
          description="Deposit your assets to earn interest on your holdings. Interest rates are algorithmically adjusted based on market demand."
          linkTo="/markets"
          linkText="View Supply Rates"
        />
        <FeatureCard 
          title="Borrow Assets" 
          description="Borrow against your deposited collateral. Maintain a healthy collateral ratio to avoid liquidation."
          linkTo="/markets"
          linkText="View Borrow Rates"
        />
        <FeatureCard 
          title="Track Positions" 
          description="Easily track your deposited and borrowed positions. Monitor your health factor to ensure your positions remain safe."
          linkTo="/dashboard"
          linkText="Go to Dashboard"
        />
      </section>
      
      <section className="mt-12 text-center text-gray-400 text-sm">
        <p>
          DeFi Protocol is a sample project running on the Ethereum network.
          <br />
          Always conduct your own research before interacting with DeFi protocols.
        </p>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, linkTo, linkText }) => (
  <Card className="bg-defi-secondary border-gray-800 card-hover shadow-md">
    <CardContent className="pt-6">
      <h2 className="text-xl font-bold mb-3 text-defi-primary">{title}</h2>
      <p className="text-gray-300">{description}</p>
    </CardContent>
    <CardFooter>
      <Link to={linkTo} className="text-defi-accent hover:underline inline-flex items-center">
        {linkText} <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </CardFooter>
  </Card>
);

export default Index;
