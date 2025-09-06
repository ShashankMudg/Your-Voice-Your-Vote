import Header from '@/components/header';
import Footer from '@/components/footer';
import ElectionList from '@/components/election-list';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <section className="text-center mb-12 md:mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-4">
            Your Voice, Your Vote
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Welcome to the official portal for Indian Elections. Browse the elections below and cast your vote securely.
          </p>
        </section>

        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ElectionList />
        </div>
      </main>
      <Footer />
    </div>
  );
}
