"use client";

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { getParties } from '@/lib/data/parties';
import { castVote } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMetaMask } from '@/contexts/MetaMaskProvider';

const parties = getParties();

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const aadhar = searchParams.get('aadhar');
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const { account } = useMetaMask();


  const handleVote = async (partyName: string) => {
    if (!account) {
        toast({
            title: "Wallet Not Connected",
            description: "Please connect your MetaMask wallet to cast a vote.",
            variant: "destructive",
        });
        return;
    }

    setIsPending(true);
    // Here you would interact with your smart contract
    console.log(`Casting vote for ${partyName} with wallet ${account}`);
    // For now, we'll still use the server action for demonstration
    const result = await castVote(aadhar!, partyName);
    
    if (result?.serverError) {
        toast({
            title: "Error",
            description: result.serverError,
            variant: "destructive",
        });
    }
    // Success case is a redirect handled by the server action
    setIsPending(false);
  };

  if (!aadhar) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl text-destructive">Authentication Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            No Aadhar number was provided. Please log in to access this page.
                        </p>
                        <Button asChild className="mt-4">
                            <a href="/login">Go to Login</a>
                        </Button>
                    </CardContent>
                </Card>
            </main>
            <Footer />
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-primary font-headline">Cast Your Vote</CardTitle>
            <CardDescription>Select a candidate to cast your vote. Your choice is final and will be recorded on the blockchain.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parties.map((party) => (
                <Card key={party.name} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{party.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{party.name}</h3>
                      <p className="text-sm text-muted-foreground">{party.candidate}</p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={isPending || !account}>
                        { isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null }
                        Vote
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
                        <AlertDialogDescription>
                          You are about to cast your vote for {party.candidate} ({party.name}). This action is irreversible and will be recorded on the blockchain. Are you sure?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleVote(party.name)} disabled={isPending}>
                          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Confirm & Cast Vote
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Card>
              ))}
            </div>
            {!account && (
                 <p className="text-center text-destructive font-semibold mt-6">
                    Please connect your MetaMask wallet to enable voting.
                </p>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
