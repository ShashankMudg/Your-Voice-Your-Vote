"use server";

import { z } from "zod";
import { action } from "@/lib/safe-action";
import { personalizedVotingInstructions } from "@/ai/flows/personalized-voting-instructions";
import { getVoterByAadhar, recordVote } from "@/lib/data/voters";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// --- Rate Limiting (In-memory implementation for demonstration) ---
const requestTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_COUNT = 5; // Max 5 requests per window

const rateLimiter = (ip: string | null): { success: boolean; message?: string } => {
    if (!ip) {
      // In a real app, you might want to block requests without an IP
      return { success: false, message: "Could not identify request origin." };
    }
  
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


// Schema for personalized instructions form
const instructionsSchema = z.object({
  age: z.coerce.number().min(18, { message: "You must be at least 18 to vote." }).max(120, { message: "Please enter a valid age." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
});

export const getPersonalizedInstructions = action(
  instructionsSchema,
  async ({ age, location }) => {
    try {
      const result = await personalizedVotingInstructions({ age, location });
      return { instructions: result.instructions };
    } catch (error) {
      console.error(error);
      return { serverError: "An error occurred while fetching instructions." };
    }
  }
);


// --- Authentication and Voting Actions ---

const aadharSchema = z.object({
  aadhar: z.string().length(12, { message: "Aadhar number must be 12 digits." }).regex(/^\d+$/, { message: "Aadhar number must only contain digits." })
});


export const requestOtp = action(
  aadharSchema,
  async ({ aadhar }) => {
      
    const voter = await getVoterByAadhar(aadhar);

    if (!voter) {
      return { serverError: "This Aadhar number is not registered to vote." };
    }
    
    if (voter.hasVoted) {
      return redirect('/already-voted');
    }

    // In a real app, you would generate and send an OTP via SMS here.
    // For this demo, we'll just signal success and move to the OTP step.
    return { success: true, aadhar };
  }
);


const otpSchema = z.object({
  aadhar: z.string().length(12),
  otp: z.string().length(6, { message: "OTP must be 6 digits." }).regex(/^\d+$/)
});

export const verifyOtpAndLogin = action(
  otpSchema,
  async ({ aadhar, otp }) => {
    // For demo purposes, the OTP is always '123456'
    if (otp !== "123456") {
      return { serverError: "Wrong OTP entered. Please try again." };
    }
    
    // OTP is correct. The user is now "authenticated".
    // We redirect to the dashboard, passing the aadhar number.
    redirect(`/dashboard?aadhar=${aadhar}`);
  }
);


const castVoteSchema = z.object({
    aadhar: z.string().length(12, { message: "Invalid Aadhar number." }),
    partyName: z.string().min(1, { message: "Party selection is required." }),
});

export const castVote = action(
    castVoteSchema,
    async ({ aadhar, partyName }) => {
        try {
            const voter = await getVoterByAadhar(aadhar);
            if (!voter) {
                return { serverError: 'Voter not found.' };
            }

            if (voter.hasVoted) {
                // This is a server-side check to prevent re-voting.
                return redirect('/already-voted');
            }

            // Record the vote in our "database"
            await recordVote(aadhar, partyName);
        } catch (error) {
            console.error(error);
            return { serverError: "An unexpected error occurred while casting your vote." };
        }

        // Revalidate path to update UI if needed, and redirect.
        revalidatePath('/dashboard');
        redirect('/thank-you');
    }
);
