"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { getPersonalizedInstructions } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  message: "",
  instructions: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={pending}>
      {pending ? (
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
  );
}

export default function VotingInstructions() {
  const [state, formAction] = useFormState(getPersonalizedInstructions, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message && state.message !== "success") {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
    if (state?.message === "success") {
        formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info /> How to Vote
        </CardTitle>
        <CardDescription>Get personalized voting instructions based on your age and location.</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="age">Your Age</Label>
            <Input id="age" name="age" type="number" placeholder="e.g., 25" required />
            {state.errors?.age && <p className="text-sm font-medium text-destructive mt-1">{state.errors.age[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Your Location (City/State)</Label>
            <Input id="location" name="location" placeholder="e.g., Delhi" required />
            {state.errors?.location && <p className="text-sm font-medium text-destructive mt-1">{state.errors.location[0]}</p>}
          </div>
          <SubmitButton />
        </form>

        {state.instructions && (
          <div className="mt-6 p-4 bg-secondary border border-primary/10 rounded-lg">
            <h4 className="font-bold text-primary mb-2">Your Personalized Instructions:</h4>
            <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {state.instructions}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
