"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Send, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthForm() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [aadhar, setAadhar] = useState('');
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhar.trim().length >= 12) {
      // In a real app, an API call to send OTP would be made here.
      console.log(`Sending OTP for Aadhar: ${aadhar}`);
      setIsOtpSent(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demonstration, using a hardcoded OTP.
    // In a real app, you would verify this against a server.
    if (otp === '123456') {
      toast({
        title: "Success",
        description: "OTP validated successfully. Redirecting...",
        variant: "default",
      });
      router.push('/dashboard');
    } else {
      toast({
        title: "Error",
        description: "Wrong OTP entered. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="w-full flex flex-col justify-between h-full">
        <CardHeader>
          <CardTitle>Portal Access</CardTitle>
          <CardDescription>Enter your Aadhar number to receive an OTP.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-start pt-8">
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
                  type="text"
                  pattern="\d{12}"
                  title="Aadhar number must be 12 digits."
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
              An OTP has been sent to your registered mobile number. (Hint: use 123456)
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
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                <LogIn className="mr-2" />
                Validate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
