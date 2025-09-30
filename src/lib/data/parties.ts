// This file simulates fetching data from a backend database.

export interface Party {
    name: string;
    candidate: string;
    initials: string;
}

const parties: Party[] = [
    { name: 'Bharatiya Janata Party', candidate: 'Narendra Modi', initials: 'NM' },
    { name: 'Indian National Congress', candidate: 'Rahul Gandhi', initials: 'RG' },
    { name: 'Aam Aadmi Party', candidate: 'Arvind Kejriwal', initials: 'AK' },
    { name: 'Bahujan Samaj Party', candidate: 'Mayawati', initials: 'M' },
    { name: 'All India Trinamool Congress', candidate: 'Mamata Banerjee', initials: 'MB' },
    { name: 'None of the Above', candidate: 'NOTA', initials: 'N' },
];

/**
 * Fetches all political parties.
 * In a real app, this would be an async database call.
 */
export function getParties(): Party[] {
    return parties;
}
