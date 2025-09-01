"use client";

import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import Image from 'next/image';

const parties = [
  {
    name: 'Bharatiya Janata Party',
    candidate: 'Narendra Modi',
    logo: 'https://picsum.photos/100/100?random=1',
    dataAiHint: 'lotus flower',
  },
  {
    name: 'Indian National Congress',
    candidate: 'Rahul Gandhi',
    logo: 'https://picsum.photos/100/100?random=2',
    dataAiHint: 'hand symbol',
  },
  {
    name: 'Aam Aadmi Party',
    candidate: 'Arvind Kejriwal',
    logo: 'https://picsum.photos/100/100?random=3',
    dataAiHint: 'broom symbol',
  },
  {
    name: 'Bahujan Samaj Party',
    candidate: 'Mayawati',
    logo: 'https://picsum.photos/100/100?random=4',
    dataAiHint: 'elephant symbol',
  },
  {
    name: 'All India Trinamool Congress',
    candidate: 'Mamata Banerjee',
    logo: 'https://picsum.photos/100/100?random=5',
    dataAiHint: 'flowers grass',
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const handleVote = () => {
    // This is a placeholder for a real voting submission.
    // In a real app, this would involve a secure call to a backend service.
    router.push('/');
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
                    <Image src={party.logo} alt={`${party.name} logo`} width={64} height={64} className="h-16 w-16" data-ai-hint={party.dataAiHint} />
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
