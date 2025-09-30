"use client";

import { AshokaChakraIcon } from '@/components/icons';
import { Button } from './ui/button';
import { useMetaMask } from '@/contexts/MetaMaskProvider';
import { Wallet } from 'lucide-react';

export default function Header() {
  const { account, connectMetaMask, shortAddress } = useMetaMask();

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <AshokaChakraIcon className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-headline text-primary">
                VoteIndia
              </span>
            </div>
            <div className="flex items-center gap-4">
              <p className="hidden md:block text-sm text-muted-foreground font-medium">The Official Portal for Indian Elections</p>
              {account ? (
                <Button variant="outline">
                  <Wallet className="mr-2 h-4 w-4" />
                  {shortAddress}
                </Button>
              ) : (
                <Button onClick={connectMetaMask}>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              )}
            </div>
        </div>
      </div>
      <div className="h-1.5 w-full flex">
         <div className="w-1/3 h-full bg-accent"></div>
         <div className="w-1/3 h-full bg-white"></div>
         <div className="w-1/3 h-full bg-green-600"></div>
      </div>
    </header>
  );
}
