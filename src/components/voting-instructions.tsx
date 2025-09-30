"use client";

import { useRef } from "react";
import { getPersonalizedInstructions } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAction } from "next-safe-action/react";

export default function VotingInstructions() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const { execute, result, status } = useAction(getPersonalizedInstructions, {
    onSuccess: (data) => {
      if (data?.instructions) {
        formRef.current?.reset();
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.serverError || "Could not fetch instructions.",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const age = formData.get("age") as string;
    const location = formData.get("location") as string;
    execute({ age: Number(age), location });
  }

  const isExecuting = status === 'executing';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info /> How to Vote
        </CardTitle>
        <CardDescription>Get personalized voting instructions based on your age and location.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="age">Your Age</Label>
            <Input id="age" name="age" type="number" placeholder="e.g., 25" required />
            {result.validationErrors?.age && <p className="text-sm font-medium text-destructive mt-1">{result.validationErrors.age[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Your Location (City/State)</Label>
            <Input id="location" name="location" placeholder="e.g., Delhi" required />
            {result.validationErrors?.location && <p className="text-sm font-medium text-destructive mt-1">{result.validationErrors.location[0]}</p>}
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isExecuting}>
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Get Instructions
              </>
            )}
          </Button>
        </form>

        {result.data?.instructions && (
          <div className="mt-6 p-4 bg-secondary border border-primary/10 rounded-lg">
            <h4 className="font-bold text-primary mb-2">Your Personalized Instructions:</h4>
            <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {result.data.instructions}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
