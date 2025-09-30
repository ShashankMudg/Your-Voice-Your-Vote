"use server";

import { z } from "zod";
import { personalizedVotingInstructions } from "@/ai/flows/personalized-voting-instructions";
import { getVoterByAadhar, recordVote } from "@/lib/data/voters";
import { redirect } from "next/navigation";

// Schema for personalized instructions form
const instructionsFormSchema = z.object({
  age: z.coerce.number().min(18, { message: "You must be at least 18 to vote." }).max(120, { message: "Please enter a valid age." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
});

export async function getPersonalizedInstructions(
  prevState: any,
  formData: FormData
) {
  const validatedFields = instructionsFormSchema.safeParse({
    age: formData.get("age"),
    location: formData.get("location"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
      instructions: null,
    };
  }

  try {
    const result = await personalizedVotingInstructions(validatedFields.data);
    return {
      message: "success",
      instructions: result.instructions,
      errors: null,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "An error occurred while fetching instructions. Please try again.",
      instructions: null,
      errors: null,
    };
  }
}

// --- Authentication and Voting Actions ---

const aadharSchema = z.string().length(12, { message: "Aadhar number must be 12 digits." }).regex(/^\d+$/, { message: "Aadhar number must only contain digits." });

export async function requestOtp(prevState: any, formData: FormData) {
  const aadhar = formData.get("aadhar") as string;
  const validation = aadharSchema.safeParse(aadhar);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid Aadhar number. Please enter 12 digits.",
      aadhar: null,
    };
  }

  const voter = await getVoterByAadhar(validation.data);

  if (!voter) {
    return {
      success: false,
      error: "This Aadhar number is not registered to vote.",
      aadhar: null,
    };
  }
  
  if (voter.hasVoted) {
    // Redirect immediately if already voted, no need for OTP.
    return redirect('/already-voted');
  }

  // In a real app, you would generate and send an OTP here.
  // For this demo, we'll just signal success and move to the OTP step.
  return {
    success: true,
    error: null,
    aadhar: validation.data,
  };
}


const otpSchema = z.string().length(6, { message: "OTP must be 6 digits." });

export async function verifyOtpAndLogin(prevState: any, formData: FormData) {
  const aadhar = formData.get("aadhar") as string;
  const otp = formData.get("otp") as string;
  
  const aadharValidation = aadharSchema.safeParse(aadhar);
  if (!aadharValidation.success) {
    // This should ideally not happen if the flow is correct
    return { success: false, error: "Invalid Aadhar number." };
  }

  const otpValidation = otpSchema.safeParse(otp);
    if (!otpValidation.success) {
    return { success: false, error: "Invalid OTP. Please enter 6 digits." };
  }

  // For demo purposes, the OTP is always '123456'
  if (otp === "123456") {
    // OTP is correct. The user is now authenticated.
    // We redirect to the dashboard, passing the aadhar number.
  } else {
    return { success: false, error: "Wrong OTP entered. Please try again." };
  }
  
  redirect(`/dashboard?aadhar=${aadhar}`);
}


export async function castVote(aadhar: string, partyName: string) {
    if (!aadhar || !partyName) {
        throw new Error('Aadhar number and party selection are required.');
    }

    const voter = await getVoterByAadhar(aadhar);
    if (!voter) {
        throw new Error('Voter not found.');
    }

    if (voter.hasVoted) {
        // This is a server-side check to prevent re-voting.
        return redirect('/already-voted');
    }

    // Record the vote in our "database"
    await recordVote(aadhar, partyName);

    // Redirect to thank you page after successful vote
    return redirect('/thank-you');
}
