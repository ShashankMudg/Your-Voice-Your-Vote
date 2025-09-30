import Header from '@/components/header';
import Footer from '@/components/footer';
import AuthForm from '@/components/auth-form';
import VotingInstructions from '@/components/voting-instructions';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
            Voter Authentication
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Please verify your identity using your Aadhar number to proceed.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <AuthForm />
          </div>
          <div className="md:col-span-1">
            <VotingInstructions />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
