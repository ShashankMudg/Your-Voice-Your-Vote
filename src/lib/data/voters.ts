// This file simulates a backend user database.

export interface Voter {
    aadhar: string;
    name: string;
    hasVoted: boolean;
    votedFor?: string; // Store which party the user voted for
}
  
// In a real application, this would be a database table (e.g., PostgreSQL, MongoDB).
// We are pre-populating it with some dummy data.
const voters: Voter[] = [
    { aadhar: "111122223333", name: "Ramesh Kumar", hasVoted: false },
    { aadhar: "444455556666", name: "Sita Sharma", hasVoted: true, votedFor: "Indian National Congress" },
    { aadhar: "777788889999", name: "Amit Singh", hasVoted: false },
    { aadhar: "123456789012", name: "Priya Patel", hasVoted: false },
    { aadhar: "112211221122", name: "John Doe", hasVoted: false },
];

/**
 * Finds a voter by their Aadhar number.
 * @param aadhar The 12-digit Aadhar number.
 * @returns The voter object or null if not found.
 */
export async function getVoterByAadhar(aadhar: string): Promise<Voter | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const voter = voters.find(v => v.aadhar === aadhar);
    return voter ? { ...voter } : null; // Return a copy to prevent mutation
}

/**
 * Records a vote for a specific user.
 * In a real app, this would be a transactional database update.
 * @param aadhar The voter's Aadhar number.
 * @param partyName The name of the party the user voted for.
 */
export async function recordVote(aadhar: string, partyName: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const voterIndex = voters.findIndex(v => v.aadhar === aadhar);

    if (voterIndex === -1) {
        throw new Error("Voter not found. Cannot record vote.");
    }

    if (voters[voterIndex].hasVoted) {
        // This is a failsafe check. The primary check should be done before calling this function.
        throw new Error("This voter has already cast their vote.");
    }
    
    // Update the voter's status
    voters[voterIndex] = {
        ...voters[voterIndex],
        hasVoted: true,
        votedFor: partyName,
    };

    console.log(`Vote recorded for ${aadhar}: ${partyName}`);
    console.log("Current voter states:", voters); // Log for debugging
}
