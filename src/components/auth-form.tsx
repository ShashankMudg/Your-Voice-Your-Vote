"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Send, LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { requestOtp, verifyOtpAndLogin } from "@/app/actions";

const initialRequestState = {
  success: false,
  error: null,
  aadhar: null,
};

const initialVerifyState = {
  success: false,
  error: null,
};

function RequestOtpButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Send OTP
    </Button>
  );
}

function VerifyOtpButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
        Validate
      </Button>
    );
  }

export default function AuthForm() {
  const [requestState, requestOtpAction] = useActionState(requestOtp, initialRequestState);
  const [verifyState, verifyOtpAction] = useActionState(verifyOtpAndLogin, initialVerifyState);
  
  const [isOtpSent, setIsOtpSent] = useState(false);
  const aadharFormRef = useRef<HTMLFormElement>(null);
  const otpFormRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (requestState.success) {
      setIsOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "An OTP has been sent to your registered mobile number. (Hint: use 123456)",
      });
    }
    if (requestState.error) {
      toast({
        title: "Error",
        description: requestState.error,
        variant: "destructive",
      });
    }
  }, [requestState, toast]);

  useEffect(() => {
    // This effect handles the outcome of the OTP verification
    if (verifyState.error) {
      toast({
        title: "Error",
        description: verifyState.error,
        variant: "destructive",
      });
    }
    // A successful verification triggers a redirect in the server action,
    // so we don't need to handle the success case here.
  }, [verifyState, toast]);
  

  const onDialogClose = () => {
    setIsOtpSent(false);
    // Optionally reset form states if dialog is closed
    aadharFormRef.current?.reset();
    otpFormRef.current?.reset();
  }

  return (
    <>
      <Card className="w-full flex flex-col justify-between h-full">
        <CardHeader>
          <CardTitle>Portal Access</CardTitle>
          <CardDescription>Enter your Aadhar number to receive an OTP.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-start pt-8">
          <div className="w-full max-w-sm">
            <form ref={aadharFormRef} action={requestOtpAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadhar-login">Aadhar Number</Label>
                <Input
                  id="aadhar-login"
                  name="aadhar"
                  placeholder="xxxx xxxx xxxx"
                  required
                  type="text"
                  pattern="\d{12}"
                  title="Aadhar number must be 12 digits."
                  maxLength={12}
                />
              </div>
              <RequestOtpButton />
            </form>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOtpSent} onOpenChange={onDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogDescription>
              An OTP has been sent to your registered mobile number. (Hint: use 123456)
            </DialogDescription>
          </DialogHeader>
          <form ref={otpFormRef} action={verifyOtpAction}>
            <input type="hidden" name="aadhar" value={requestState.aadhar ?? ''} />
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="otp" className="text-right">
                  OTP
                </Label>
                <Input
                  id="otp"
                  name="otp"
                  className="col-span-3"
                  placeholder="Enter your 6-digit OTP"
                  required
                  maxLength={6}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <VerifyOtpButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
