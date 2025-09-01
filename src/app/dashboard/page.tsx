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
    logo: 'https://placehold.co/40x40/FF9933/FFFFFF?text=BJP',
    dataAiHint: 'lotus flower',
  },
  {
    name: 'Indian National Congress',
    candidate: 'Rahul Gandhi',
    logo: 'https://placehold.co/40x40/138808/FFFFFF?text=INC',
    dataAiHint: 'hand symbol',
  },
  {
    name: 'Aam Aadmi Party',
    candidate: 'Arvind Kejriwal',
    logo: 'https://placehold.co/40x40/0072c6/FFFFFF?text=AAP',
    dataAiHint: 'broom icon',
  },
  {
    name: 'Bahujan Samaj Party',
    candidate: 'Mayawati',
    logo: 'https://placehold.co/40x40/224099/FFFFFF?text=BSP',
    dataAiHint: 'elephant silhouette',
  },
  {
    name: 'All India Trinamool Congress',
    candidate: 'Mamata Banerjee',
    logo: 'https://placehold.co/40x40/00B300/FFFFFF?text=AITC',
    dataAiHint: 'twin flowers',
  },
];

export default function DashboardPage() {
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
                    <Avatar className="h-12 w-12 flex items-center justify-center bg-gray-100">
                       <AvatarImage src={party.logo} alt={`${party.name} logo`} data-ai-hint={party.dataAiHint} width={40} height={40} />
                      <AvatarFallback>{party.name.charAt(0)}</AvatarFallback>
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
                        <AlertDialogAction>Confirm Vote</AlertDialogAction>
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
