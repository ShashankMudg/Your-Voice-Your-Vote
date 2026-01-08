"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import { ethers } from "ethers";

// ✅ Parties (must match Solidity deployment order)
const INITIAL_PARTIES = [
  { id: 0, name: "Bharatiya Janata Party", candidate: "Narendra Modi", initials: "NM" },
  { id: 1, name: "Indian National Congress", candidate: "Rahul Gandhi", initials: "RG" },
  { id: 2, name: "Aam Aadmi Party", candidate: "Arvind Kejriwal", initials: "AK" },
  { id: 3, name: "Bahujan Samaj Party", candidate: "Mayawati", initials: "M" },
  { id: 4, name: "All India Trinamool Congress", candidate: "Mamata Banerjee", initials: "MB" },
  { id: 5, name: "None of the Above", candidate: "NOTA", initials: "N" },
];

// ✅ Minimal ABI (only vote + getVotes needed)
const contractABI = [
  {
    inputs: [{ internalType: "uint256", name: "_partyId", type: "uint256" }],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_partyId", type: "uint256" }],
    name: "getVotes",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // ⚠️ TODO: Update this function name to match your smart contract
  {
    inputs: [],
    name: "getElectionDetails",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "name", type: "string" },
          { name: "candidate", type: "string" },
        ],
        internalType: "struct Election.Party[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// ⚡ Replace with your deployed contract address
const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const aadhar = searchParams.get("aadhar");

  const [parties, setParties] = useState(INITIAL_PARTIES);

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        if (typeof (window as any).ethereum === "undefined") return;
        const provider = new ethers.BrowserProvider((window as any).ethereum);

        // Use a public provider or the user's wallet if connected? 
        // For read-only, we can try to use a default provider if we had an RPC URL, 
        // but here we'll rely on the browser provider if available.

        const targetAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || contractAddress;
        if (targetAddress === "YOUR_CONTRACT_ADDRESS_HERE") return;

        const contract = new ethers.Contract(targetAddress, contractABI, provider);

        // ⚠️ Calls the new function
        const data = await contract.getElectionDetails();

        // Map response to UI format
        const formattedParties = data.map((p: any) => ({
          id: Number(p.id),
          name: p.name,
          candidate: p.candidate,
          initials: (p.candidate && typeof p.candidate === 'string')
            ? p.candidate.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
            : '??',
        }));

        if (formattedParties.length > 0) {
          setParties(formattedParties);
        }

      } catch (error) {
        console.error("Failed to fetch election data:", error);
      }
    };

    fetchElectionData();
  }, []);

  // ✅ Voting logic
  const handleVote = async (partyId: number) => {
    try {
      if (typeof (window as any).ethereum === "undefined") {
        alert("❌ Please install MetaMask!");
        return;
      }

      // Connect wallet when vote button is clicked
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);

      // Check network and switch to Sepolia if needed
      const network = await provider.getNetwork();
      const SEPOLIA_CHAIN_ID = BigInt(11155111); // 0xaa36a7

      if (network.chainId !== SEPOLIA_CHAIN_ID) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              await (window as any).ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0xaa36a7",
                    chainName: "Sepolia Test Network",
                    nativeCurrency: {
                      name: "SepoliaETH",
                      symbol: "ETH",
                      decimals: 18,
                    },
                    rpcUrls: ["https://sepolia.infura.io/v3/"], // Public RPC
                    blockExplorerUrls: ["https://sepolia.etherscan.io"],
                  },
                ],
              });
            } catch (addError) {
              console.error("Failed to add Sepolia:", addError);
              alert("❌ Failed to add Sepolia network.");
              return;
            }
          } else {
            console.error("Failed to switch network:", switchError);
            alert("❌ Please switch to Sepolia network to vote.");
            return;
          }
        }
        // Re-initialize provider/signer after switch might be needed, but usually handled by current provider instance
      }

      const signer = await provider.getSigner();

      const targetAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || contractAddress;
      if (targetAddress === "YOUR_CONTRACT_ADDRESS_HERE") {
        alert("⚠️ Contract address not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS.");
        return;
      }

      // Create contract instance
      const contract = new ethers.Contract(targetAddress, contractABI, signer);

      // Send transaction
      const tx = await contract.vote(partyId);
      await tx.wait();

      // Optional: Save locally to prevent double voting (your Aadhaar logic)
      if (aadhar) {
        localStorage.setItem(`voted_${aadhar}`, "true");
      }

      alert(`✅ You voted for ${parties[partyId].candidate}!`);
      router.push("/thank-you");
    } catch (error) {
      console.error(error);
      alert("❌ Transaction failed (check console for details)");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-primary font-headline">
              Cast Your Vote
            </CardTitle>
            <CardDescription>
              Select a candidate to cast your vote. Your choice is final.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parties.map((party) => (
                <Card
                  key={party.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{party.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{party.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {party.candidate}
                      </p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button>Vote</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
                        <AlertDialogDescription>
                          You are about to cast your vote for{" "}
                          {party.candidate} ({party.name}). This action cannot be
                          undone. Are you sure you want to proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleVote(party.id)}
                        >
                          Confirm Vote
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
