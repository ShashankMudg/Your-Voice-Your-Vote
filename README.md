# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

# Secure Blockchain-Based Indian Election System (Design & Architecture)

**Status:** Currently in the design and architecture phase. The Solidity smart contract implementation is under development.

This repository demonstrates the security design, authentication flow, and cryptographic verification model for a decentralized and privacy-preserving Indian election system.

---

## Overview

This project proposes a blockchain-based electronic voting system for Indian elections that combines:

- **Off-chain identity verification** (via Aadhaar-linked OTP)  
- **On-chain cryptographic validation** (via ECDSA signatures)  
- **Immutable vote storage** on Ethereum  

The aim is to create a trustless, verifiable, and tamper-resistant voting process where:

- Only verified citizens can vote.  
- Each citizen votes exactly once.  
- Voter privacy is protected (Aadhaar never exposed).  
- The Election Commission’s authorization is cryptographically provable on-chain.

---

## Core Idea

1. Voter verification happens **off-chain** via an OTP linked to Aadhaar.  
2. Once verified, the Election Commission (EC) digitally signs the voter’s eligibility using its private key.  
3. The voter’s actual vote (party selection) is submitted **on-chain** with the signed authorization.  

The smart contract uses **ECDSA** to verify the signature and ensure:

- The vote came from an EC-approved voter.  
- The voter hasn’t already voted.  
- The signature hasn’t expired.

---

## System Flow

### Step-by-Step Process

1. **User Login & OTP Verification (Off-Chain)**
    - The voter enters their Aadhaar number.  
    - An OTP is sent to the mobile number linked to Aadhaar.  
    - Upon successful OTP verification, the backend generates:  
      ```text
      aadhaarHash = keccak256(aadhaarNumber + secretSalt)
      ```  
      This ensures the voter’s identity is confirmed **without revealing Aadhaar**.

2. **Election Commission Authorization**
    - The EC’s secure wallet signs the tuple:  
      ```text
      (aadhaarHash, electionId, expiry)
      ```  
    - This signature acts as an **eligibility proof** that the EC has approved this voter for the current election.  
    - **Output:** `signature`

3. **Vote Casting (Frontend)**
    - The user selects their preferred party (e.g., BJP, Congress, AAP, etc.).  
    - The frontend calls:
      ```text
      vote(partyId, aadhaarHash, electionId, expiry, signature)
      ```
    - **Parameters:**

      | Field       | Description                     |
      |------------|---------------------------------|
      | partyId    | Chosen political party ID       |
      | aadhaarHash | Hashed voter ID (privacy-preserving) |
      | electionId | Unique election identifier      |
      | expiry     | Time limit for signature validity |
      | signature  | EC’s signed authorization       |

4. **On-Chain Verification (Smart Contract)**
    - The contract recomputes the signed message hash.  
    - Uses `ECDSA.recover(digest, signature)` to extract the signer’s address.  
    - Validates:
      ```solidity
      require(recovered == ecSigner, "Invalid EC signature");
      require(!hasVoted[aadhaarHash], "Already voted");
      require(block.timestamp <= expiry, "Signature expired");
      ```
    - If all checks pass → vote is stored **immutably**.

5. **Vote Storage**
    - The contract updates:
      ```solidity
      hasVoted[aadhaarHash] = true;
      votes[electionId][partyId]++;
      ```
    - This ensures:
      - The same Aadhaar cannot vote twice.  
      - Votes are transparently recorded on-chain.

---

## Security Highlights

| Concern             | Mitigation |
|--------------------|------------|
| Double Voting       | `hasVoted[aadhaarHash]` prevents multiple submissions. |
| Fake Authorization  | On-chain verification via `ECDSA.recover` ensures signature authenticity. |
| Replay Attacks      | `electionId` and `expiry` fields ensure old or cross-election signatures are invalid. |
| Privacy Leakage     | Contract never stores raw Aadhaar; only a hash (`aadhaarHash`). |
| Signature Expiry    | Short-lived validity prevents reuse of old EC-signed proofs. |

---

## Key Advantages

- **Trustless verification:** Anyone can verify the EC’s public key.  
- **Privacy-first:** Aadhaar and phone numbers never appear on-chain.  
- **Time-bound authorization:** Expiry field ensures one-time eligibility.  
- **Replay-safe design:** Each election is cryptographically unique.  
- **Public auditability:** Votes are recorded immutably on-chain.

---

## Tech Stack (Planned)

| Layer           | Technology                         |
|-----------------|-----------------------------------|
| Smart Contracts | Solidity (EVM Compatible)         |
| Framework       | Hardhat / Foundry                  |
| Frontend        | React + Ethers.js                  |
| Backend         | Node.js (for OTP + signing)        |
| Wallet          | MetaMask (for voter)               |
| Tools           | OpenZeppelin ECDSA, Slither, Echidna |
---
## Running the code
- Go to the project root folder
- Type the command **npm run dev**


