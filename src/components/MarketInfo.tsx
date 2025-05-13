
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tokens } from '@/utils/ethereumUtils';

const MarketInfo: React.FC = () => {
  // Calculate totals
  const totalDeposited = tokens.reduce((acc, token) => acc + token.totalDeposited * token.price, 0);
  const totalBorrowed = tokens.reduce((acc, token) => acc + token.totalBorrowed * token.price, 0);
  const utilizationRate = (totalBorrowed / totalDeposited) * 100;
  
  return (
    <div className="space-y-6">
      <Card className="bg-defi-secondary border-gray-800 shadow-md overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-defi-primary to-defi-accent"></div>
        <CardHeader className="pb-2">
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <StatCard 
              title="Total Supply" 
              value={`$${totalDeposited.toLocaleString()}`} 
              footer="Assets supplied to the protocol"
              className="bg-gradient-to-br from-defi-secondary to-defi-secondary/80" 
            />
            <StatCard 
              title="Total Borrowed" 
              value={`$${totalBorrowed.toLocaleString()}`} 
              footer="Assets borrowed from the protocol"
              className="bg-gradient-to-br from-defi-secondary to-defi-secondary/80" 
            />
            <StatCard 
              title="Utilization Rate" 
              value={`${utilizationRate.toFixed(2)}%`} 
              footer="Percentage of supplied assets being borrowed"
              className="bg-gradient-to-br from-defi-secondary to-defi-secondary/80" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  footer: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, footer, className }) => (
  <div className={`rounded-lg p-4 ${className}`}>
    <h3 className="text-sm font-medium text-gray-400">{title}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{footer}</p>
  </div>
);

export default MarketInfo;
