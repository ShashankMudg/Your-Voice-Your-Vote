import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <Card className="w-full max-w-md text-center animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl text-primary">
              <CheckCircle className="h-8 w-8 text-green-500" />
              Login Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">
              Welcome to your voter dashboard.
            </p>
            <p className="mt-4">
                You can now proceed to cast your vote or view election details.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
