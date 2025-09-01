"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Send, LogIn } from "lucide-react";

export default function AuthForm() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [aadhar, setAadhar] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call an API to send the OTP
    if (aadhar.trim().length >= 12) {
      setIsOtpSent(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would verify the OTP and log the user in
    console.log("Logging in...");
    setIsOtpSent(false); // Close dialog on login
  };

  return (
    <>
      <Card className="w-full flex flex-col h-full">
        <CardHeader>
          <CardTitle>Portal Access</CardTitle>
          <CardDescription>Enter your Aadhar number to receive an OTP.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center">
          <div className="w-full max-w-sm">
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadhar-login">Aadhar Number</Label>
                <Input 
                  id="aadhar-login" 
                  placeholder="xxxx xxxx xxxx" 
                  required 
                  minLength={12}
                  maxLength={12}
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Send className="mr-2 h-4 w-4"/>
                Send OTP
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOtpSent} onOpenChange={setIsOtpSent}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter OTP</DialogTitle>
            <DialogDescription>
              An OTP has been sent to your registered mobile number.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="otp" className="text-right">
                  OTP
                </Label>
                <Input
                  id="otp"
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
              <Button type="submit">
                <LogIn className="mr-2" />
                Replace
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
