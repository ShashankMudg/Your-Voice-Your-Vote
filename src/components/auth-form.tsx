"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

export default function AuthForm() {
  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader>
        <CardTitle>Portal Access</CardTitle>
        <CardDescription>Enter your Aadhar number to receive an OTP.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-sm">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aadhar-login">Aadhar Number</Label>
              <Input id="aadhar-login" placeholder="xxxx xxxx xxxx" required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Send className="mr-2 h-4 w-4"/>
              Send OTP
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
