"use client";

import { useSearchParams, useRouter } from "next/navigation";
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
const parties = [
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
];

// ⚡ Replace with your deployed contract address
const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const aadhar = searchParams.get("aadhar");

  // ✅ Voting logic
  const handleVote = async (partyId: number) => {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("❌ Please install MetaMask!");
        return;
      }

      // Connect wallet when vote button is clicked
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      // Create contract instance
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

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
      alert("❌ Transaction failed (maybe already voted?)");
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
