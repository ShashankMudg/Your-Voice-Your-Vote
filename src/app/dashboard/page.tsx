import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { LotusIcon, HandIcon, BroomIcon, ElephantIcon, FlowersIcon } from '@/components/icons';

const parties = [
  {
    name: 'Bharatiya Janata Party',
    candidate: 'Narendra Modi',
    logo: <LotusIcon className="w-10 h-10 text-pink-600" />,
  },
  {
    name: 'Indian National Congress',
    candidate: 'Rahul Gandhi',
    logo: <HandIcon className="w-10 h-10 text-blue-600" />,
  },
  {
    name: 'Aam Aadmi Party',
    candidate: 'Arvind Kejriwal',
    logo: <BroomIcon className="w-10 h-10 text-gray-700" />,
  },
  {
    name: 'Bahujan Samaj Party',
    candidate: 'Mayawati',
    logo: <ElephantIcon className="w-10 h-10 text-blue-800" />,
  },
  {
    name: 'All India Trinamool Congress',
    candidate: 'Mamata Banerjee',
    logo: <FlowersIcon className="w-10 h-10 text-green-500" />,
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
                      {party.logo}
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
