"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';

const parties = [
  { name: 'Bharatiya Janata Party', candidate: 'Narendra Modi', initials: 'NM' },
  { name: 'Indian National Congress', candidate: 'Rahul Gandhi', initials: 'RG' },
  { name: 'Aam Aadmi Party', candidate: 'Arvind Kejriwal', initials: 'AK' },
  { name: 'Bahujan Samaj Party', candidate: 'Mayawati', initials: 'M' },
  { name: 'All India Trinamool Congress', candidate: 'Mamata Banerjee', initials: 'MB' },
  { name: 'None of the Above', candidate: 'NOTA', initials: 'N' },
];

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const aadhar = searchParams.get('aadhar');

  const handleVote = () => {
    if (aadhar) {
      localStorage.setItem(`voted_${aadhar}`, 'true');
    }
    router.push('/thank-you');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-primary font-headline">Cast Your Vote</CardTitle>
            <CardDescription>Select a candidate to cast your vote. Your choice is final.</CardDescription>
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
                      <Button>Vote</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
                        <AlertDialogDescription>
                          You are about to cast your vote for {party.candidate} ({party.name}). This action cannot be undone. Are you sure you want to proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleVote}>Confirm Vote</AlertDialogAction>
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
