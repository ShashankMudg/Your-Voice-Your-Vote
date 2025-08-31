import Header from '@/components/header';
import Footer from '@/components/footer';
import AuthForm from '@/components/auth-form';
import ElectionSchedule from '@/components/election-schedule';
import VotingInstructions from '@/components/voting-instructions';

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
            Securely cast your vote and participate in shaping the future of India. Every vote counts.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-stretch">
          <div className="md:col-span-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <AuthForm />
          </div>
          <div className="md:col-span-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <VotingInstructions />
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <ElectionSchedule />
        </div>
      </main>
      <Footer />
    </div>
  );
}
