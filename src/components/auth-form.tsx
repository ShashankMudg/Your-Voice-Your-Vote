"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Send, LogIn, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { requestOtp, verifyOtpAndLogin } from "@/app/actions";
import { useAction } from "next-safe-action/react";

export default function AuthForm() {
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [aadharValue, setAadharValue] = useState("");
  const aadharFormRef = useRef<HTMLFormElement>(null);
  const otpFormRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const {
    execute: executeRequestOtp,
    status: requestStatus,
    result: requestResult,
  } = useAction(requestOtp, {
    onSuccess: (data) => {
      if (data?.success && data.aadhar) {
        setAadharValue(data.aadhar);
        setIsOtpDialogOpen(true);
        toast({
          title: "OTP Sent",
          description: "An OTP has been sent to your registered mobile number. (Hint: use 123456)",
        });
      }
    },
    onError: (error) => {
      const message = error.serverError || "An unexpected error occurred.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const {
    execute: executeVerifyOtp,
    status: verifyStatus,
  } = useAction(verifyOtpAndLogin, {
    onError: (error) => {
        const message = error.serverError || "Failed to verify OTP.";
        toast({
            title: "Error",
            description: message,
            variant: "destructive",
        });
    }
    // Success case is a redirect, so no handler needed here.
  });

  const handleAadharSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const aadhar = formData.get("aadhar") as string;
    executeRequestOtp({ aadhar });
  };

  const handleOtpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const otp = formData.get("otp") as string;
    if (aadharValue) {
        executeVerifyOtp({ aadhar: aadharValue, otp });
    }
  };

  const onDialogClose = () => {
    setIsOtpDialogOpen(false);
    aadharFormRef.current?.reset();
    otpFormRef.current?.reset();
    setAadharValue("");
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
            <form ref={aadharFormRef} onSubmit={handleAadharSubmit} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={requestStatus === 'executing'}>
                {requestStatus === 'executing' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send OTP
              </Button>
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
          <form ref={otpFormRef} onSubmit={handleOtpSubmit}>
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
              <Button type="submit" disabled={verifyStatus === 'executing'}>
                {verifyStatus === 'executing' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                Validate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
