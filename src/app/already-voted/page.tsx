import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function AlreadyVotedPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <Card className="w-full max-w-md text-center animate-fade-in">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary rounded-full h-16 w-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl text-primary font-headline">Vote Already Cast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our records indicate that a vote has already been submitted using this Aadhar number.
            </p>
            <p className="text-muted-foreground">
              Each citizen is allowed to vote only once. Thank you for your participation in this election.
            </p>
            <Button asChild className="w-full mt-4">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
