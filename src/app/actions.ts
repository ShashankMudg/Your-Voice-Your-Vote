"use server";

import { z } from "zod";
import { getVoterByAadhar, recordVote } from "@/lib/data/voters";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// --- Rate Limiting (In-memory implementation for demonstration) ---
const requestTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_COUNT = 5; // Max 5 requests per window

const rateLimiter = (): { success: boolean; message?: string } => {
    const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';
    const now = Date.now();
    const userTimestamps = requestTimestamps.get(ip) || [];

    const recentTimestamps = userTimestamps.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    if (recentTimestamps.length >= RATE_LIMIT_COUNT) {
      return { success: false, message: "Too many requests. Please try again in a minute." };
    }

    recentTimestamps.push(now);
    requestTimestamps.set(ip, recentTimestamps);

    return { success: true };
};


// --- Authentication and Voting Actions ---
const aadharSchema = z.object({
  aadhar: z.string().length(12, { message: "Aadhar number must be 12 digits." }).regex(/^\d+$/, { message: "Aadhar number must only contain digits." })
});

export const requestOtp = async (prevState: any, formData: FormData) => {
    const rateLimit = rateLimiter();
    if (!rateLimit.success) {
      return { serverError: rateLimit.message };
    }

    const aadhar = formData.get('aadhar') as string;
    const parsed = aadharSchema.safeParse({ aadhar });

    if (!parsed.success) {
        return { serverError: "Invalid Aadhar number." };
    }
    
    const voter = await getVoterByAadhar(parsed.data.aadhar);

    if (!voter) {
      return { serverError: "This Aadhar number is not registered to vote." };
    }
    
    if (voter.hasVoted) {
      return redirect('/already-voted');
    }

    // In a real app, you would generate and send an OTP via SMS here.
    return { success: true, aadhar: parsed.data.aadhar };
  }


const otpSchema = z.object({
    aadhar: z.string().length(12),
    otp: z.string().length(6, { message: "OTP must be 6 digits." }).regex(/^\d+$/)
});

export const verifyOtpAndLogin = async (prevState: any, formData: FormData) => {
    const aadhar = formData.get('aadhar') as string;
    const otp = formData.get('otp') as string;
    const parsed = otpSchema.safeParse({ aadhar, otp });

    if (!parsed.success) {
        return { serverError: "Invalid OTP format." };
    }

    // For demo purposes, the OTP is always '123456'
    if (parsed.data.otp !== "123456") {
      return { serverError: "Wrong OTP entered. Please try again." };
    }
    
    // OTP is correct. The user is now "authenticated".
    redirect(`/dashboard?aadhar=${parsed.data.aadhar}`);
  }


const castVoteSchema = z.object({
    aadhar: z.string().length(12, { message: "Invalid Aadhar number." }),
    partyName: z.string().min(1, { message: "Party selection is required." }),
});

export const castVote = async (aadhar: string, partyName: string) => {
    const parsed = castVoteSchema.safeParse({ aadhar, partyName });

    if (!parsed.success) {
        return { serverError: "Invalid vote data." };
    }

    try {
        const voter = await getVoterByAadhar(parsed.data.aadhar);
        if (!voter) {
            return { serverError: 'Voter not found.' };
        }

        if (voter.hasVoted) {
            return redirect('/already-voted');
        }

        await recordVote(parsed.data.aadhar, parsed.data.partyName);
    } catch (error) {
        console.error(error);
        return { serverError: "An unexpected error occurred while casting your vote." };
    }

    revalidatePath('/dashboard');
    redirect('/thank-you');
};
