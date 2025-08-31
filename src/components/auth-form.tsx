"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, UserPlus } from "lucide-react";

export default function AuthForm() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Portal Access</CardTitle>
        <CardDescription>Log in or register to cast your vote.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="login">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </TabsTrigger>
            <TabsTrigger value="register">
              <UserPlus className="mr-2 h-4 w-4" /> Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadhar-login">Aadhar Number</Label>
                <Input id="aadhar-login" placeholder="xxxx xxxx xxxx" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp-login">One-Time Password (OTP)</Label>
                <Input id="otp-login" type="password" placeholder="Enter OTP" required />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <LogIn className="mr-2 h-4 w-4"/>
                Login
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register" className="mt-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name-register">Full Name</Label>
                <Input id="name-register" placeholder="As per Aadhar" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadhar-register">Aadhar Number</Label>
                <Input id="aadhar-register" placeholder="xxxx xxxx xxxx" required />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <UserPlus className="mr-2 h-4 w-4"/>
                Register & Verify
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
