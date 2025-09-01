import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function AlreadyVotedPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <Card className="w-full max-w-2xl text-center animate-fade-in">
          <CardHeader>
            <div className="mx-auto bg-destructive text-destructive-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl text-destructive font-headline">Vote Already Cast</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground mb-6">
              Our records indicate that a vote has already been submitted using this Aadhar number.
            </p>
            <p className="text-md text-muted-foreground mb-8">
              Each citizen is entitled to one vote to ensure a fair election. Thank you for your participation in our democracy.
            </p>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
