"use client";

import React, { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import { useToast } from '@/hooks/use-toast';

interface MetaMaskContextData {
  account: string | null;
  connectMetaMask: () => Promise<void>;
  shortAddress: string | null;
}

const MetaMaskContext = createContext<MetaMaskContextData>({} as MetaMaskContextData);

export const MetaMaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const { toast } = useToast();

  const getProvider = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    return null;
  };

  const connectMetaMask = async () => {
    const provider = getProvider();
    if (!provider) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install the MetaMask extension to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        toast({
            title: "Wallet Connected",
            description: "Your MetaMask wallet has been successfully connected.",
        });
      }
    } catch (error: any) {
        console.error("MetaMask connection error:", error);
        toast({
            title: "Connection Failed",
            description: error.message || "An error occurred while connecting your wallet.",
            variant: "destructive",
        });
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      toast({
          title: "Wallet Disconnected",
          description: "Your MetaMask wallet has been disconnected.",
      });
    } else {
      setAccount(accounts[0]);
    }
  };

  useEffect(() => {
    const ethereum = window.ethereum;
    if (ethereum) {
      ethereum.on('accountsChanged', handleAccountsChanged);

      // Check for already connected accounts on initial load
      const provider = getProvider();
      provider?.send('eth_accounts', []).then((accounts) => {
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });
    }

    return () => {
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const shortAddress = useMemo(() => {
    if (!account) return null;
    return `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
  }, [account]);


  return (
    <MetaMaskContext.Provider value={{ account, connectMetaMask, shortAddress }}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
  }
  return context;
};
