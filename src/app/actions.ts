"use server";

import { z } from "zod";
import { getVoterByAadhar, recordVote } from "@/lib/data/voters";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

//import { Wallet, utils } from "ethers";
import { Wallet, keccak256, toUtf8Bytes } from "ethers";
import fs from "fs";
import path from "path";

// ----------------- EC Key + Config -----------------
const ecPrivateKeyPath = path.join(process.cwd(), "ec-keys", "ec-private-key.pem");
const ecPrivateKey = fs.readFileSync(ecPrivateKeyPath, "utf8").trim();
const ecWallet = new Wallet(ecPrivateKey);

const AADHAAR_SALT = process.env.AADHAAR_SALT || "demo_salt";

// --- Rate Limiting (In-memory implementation for demonstration) ---
const requestTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_COUNT = 5; // Max 5 requests per window

const rateLimiter = (): { success: boolean; message?: string } => {
  const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
  const now = Date.now();
  const userTimestamps = requestTimestamps.get(ip) || [];

  const recentTimestamps = userTimestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recentTimestamps.length >= RATE_LIMIT_COUNT) {
    return {
      success: false,
      message: "Too many requests. Please try again in a minute.",
    };
  }

  recentTimestamps.push(now);
  requestTimestamps.set(ip, recentTimestamps);

  return { success: true };
};

// --- Authentication and Voting Actions ---
const aadharSchema = z.object({
  aadhar: z
    .string()
    .length(12, { message: "Aadhar number must be 12 digits." })
    .regex(/^\d+$/, { message: "Aadhar number must only contain digits." }),
});

export const requestOtp = async (prevState: any, formData: FormData) => {
  const rateLimit = rateLimiter();
  if (!rateLimit.success) {
    return { serverError: rateLimit.message };
  }

  const aadhar = formData.get("aadhar") as string;
  const parsed = aadharSchema.safeParse({ aadhar });

  if (!parsed.success) {
    return { serverError: "Invalid Aadhar number." };
  }

  const voter = await getVoterByAadhar(parsed.data.aadhar);

  if (!voter) {
    return { serverError: "This Aadhar number is not registered to vote." };
  }

  if (voter.hasVoted) {
    return redirect("/already-voted");
  }

  // In a real app, you would generate and send an OTP via SMS here.
  return { success: true, aadhar: parsed.data.aadhar };
};

const otpSchema = z.object({
  aadhar: z.string().length(12),
  otp: z
    .string()
    .length(6, { message: "OTP must be 6 digits." })
    .regex(/^\d+$/),
});

export const verifyOtpAndLogin = async (prevState: any, formData: FormData) => {
  const aadhar = formData.get("aadhar") as string;
  const otp = formData.get("otp") as string;
  const parsed = otpSchema.safeParse({ aadhar, otp });

  if (!parsed.success) {
    return { serverError: "Invalid OTP format." };
  }

  // For demo purposes, the OTP is always '123456'
  if (parsed.data.otp !== "123456") {
    return { serverError: "Wrong OTP entered. Please try again." };
  }

  // ✅ Aadhaar hash (with salt so raw number isn't exposed)
  const aadhaarHash = keccak256(
    toUtf8Bytes(aadhar + AADHAAR_SALT)
  );


  // ✅ Election ID + expiry
  const electionId = 1; // Demo, can come from DB
  const expiry = Math.floor(Date.now() / 1000) + 300; // 5 minutes

  // ✅ EIP-712 domain
  const domain = {
    name: "IndiaElection2025",
    version: "1",
    chainId: parseInt(process.env.CHAIN_ID || "11155111"), // Default to Sepolia
    verifyingContract: process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
  };

  const types = {
    Vote: [
      { name: "aadhaarHash", type: "bytes32" },
      { name: "electionId", type: "uint256" },
      { name: "expiry", type: "uint256" },
    ],
  };

  const value = { aadhaarHash, electionId, expiry };

  // ✅ Sign with EC private key
  const signature = await ecWallet.signTypedData(domain, types, value);

  // ✅ Return data package to frontend
  return {
    success: true,
    aadhaarHash,
    electionId,
    expiry,
    signature,
  };
};

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
      return { serverError: "Voter not found." };
    }

    if (voter.hasVoted) {
      return redirect("/already-voted");
    }

    // ⚠️ Currently records in DB, not blockchain
    // Later you’ll replace this with smart contract call using aadhaarHash + signature
    await recordVote(parsed.data.aadhar, parsed.data.partyName);
  } catch (error) {
    console.error(error);
    return {
      serverError: "An unexpected error occurred while casting your vote.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/thank-you");
};
