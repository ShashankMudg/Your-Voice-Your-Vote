import { AshokaChakraIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <div className="flex justify-center items-center gap-2 mb-2">
            <AshokaChakraIcon className="w-5 h-5 text-primary" />
            <p className="text-sm font-semibold text-primary">VoteIndia</p>
        </div>
        <p className="text-xs">
          © {new Date().getFullYear()} Election Commission of India. All rights reserved.
        </p>
        <p className="text-xs mt-1">
            Built for a more democratic tomorrow.
        </p>
      </div>
    </footer>
  );
}
