import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HandHeart } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <Card className="w-full max-w-lg text-center animate-fade-in">
          <CardHeader>
            <div className="mx-auto bg-accent/10 text-accent rounded-full h-20 w-20 flex items-center justify-center mb-4">
              <HandHeart className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl text-primary font-headline">Thank You for Voting!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Your vote has been successfully cast. You have played a vital role in shaping the future of our nation.
            </p>
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
              "The ballot is stronger than the bullet." - Abraham Lincoln
            </blockquote>
            <p className="font-semibold text-primary">Jai Hind! 🇮🇳</p>
            <Button asChild className="w-full mt-6">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
