"use client";

import { useEffect, useState, useRef, useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Send, LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { requestOtp, verifyOtpAndLogin } from "@/app/actions";
import { useFormStatus } from 'react-dom';

const initialRequestState = {
  success: false,
  aadhar: "",
  serverError: undefined,
};

const initialVerifyState = {
  serverError: undefined,
};

function RequestOtpButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Send OTP
    </Button>
  )
}

function VerifyOtpButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
      Validate
    </Button>
  )
}


export default function AuthForm() {
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const { toast } = useToast();

  const [requestState, requestOtpAction] = useActionState(requestOtp, initialRequestState);
  const [verifyState, verifyOtpAction] = useActionState(verifyOtpAndLogin, initialVerifyState);

  const aadharFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (requestState?.success && requestState.aadhar) {
      setIsOtpDialogOpen(true);
      toast({
        title: "OTP Sent",
        description: "An OTP has been sent to your registered mobile number. (Hint: use 123456)",
      });
    }
    if (requestState?.serverError) {
      toast({
        title: "Error",
        description: requestState.serverError,
        variant: "destructive",
      });
    }
  }, [requestState, toast]);

  useEffect(() => {
    if (verifyState?.serverError) {
      toast({
        title: "Error",
        description: verifyState.serverError,
        variant: "destructive",
      });
    }
  }, [verifyState, toast]);

  const onDialogClose = () => {
    setIsOtpDialogOpen(false);
    aadharFormRef.current?.reset();
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
                  maxLength={12}
                />
              </div>
              <RequestOtpButton />
            </form>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOtpDialogOpen} onOpenChange={onDialogClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogDescription>
              An OTP has been sent to your registered mobile number. (Hint: use 123456)
            </DialogDescription>
          </DialogHeader>
          <form action={verifyOtpAction}>
            <input type="hidden" name="aadhar" value={requestState?.aadhar || ''} />
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
                <Button variant="outline" type="button" onClick={onDialogClose}>Cancel</Button>
              <VerifyOtpButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
