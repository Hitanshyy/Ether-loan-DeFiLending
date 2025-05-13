
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import WalletConnect from './WalletConnect';
import { Home, LayoutDashboard, List } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="sticky top-0 z-10 backdrop-blur-md bg-defi-secondary/90 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-defi-primary text-white p-1 rounded font-bold text-xl">DP</div>
              <span className="text-xl font-bold text-white">DeFi Protocol</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" active={isActive('/')}>
              <Home size={16} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/markets" active={isActive('/markets')}>
              <List size={16} />
              <span>Markets</span>
            </NavLink>
            <NavLink to="/dashboard" active={isActive('/dashboard')}>
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </NavLink>
          </div>
          
          <WalletConnect />
        </div>
      </div>
      
      <div className="md:hidden flex justify-around py-2 bg-defi-secondary border-t border-gray-800">
        <MobileNavLink to="/" active={isActive('/')}>
          <Home size={20} />
          <span>Home</span>
        </MobileNavLink>
        <MobileNavLink to="/markets" active={isActive('/markets')}>
          <List size={20} />
          <span>Markets</span>
        </MobileNavLink>
        <MobileNavLink to="/dashboard" active={isActive('/dashboard')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </MobileNavLink>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
        active
          ? "text-defi-primary"
          : "text-gray-300 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink: React.FC<NavLinkProps> = ({ to, active, children }) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center space-y-1 px-3 py-1 text-xs font-medium transition ${
        active
          ? "text-defi-primary"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
