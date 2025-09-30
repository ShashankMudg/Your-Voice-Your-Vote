// This file simulates fetching data from a backend database.

export interface Election {
    name: string;
    status: 'Ongoing' | 'Upcoming' | 'Finished';
    constituency: string;
    date: string;
    details: string;
  }
  
  const elections: Election[] = [
    {
      name: 'Lok Sabha General Election 2024',
      status: 'Ongoing',
      constituency: 'Nationwide',
      date: 'April 19 - June 1, 2024',
      details: 'The 18th Lok Sabha election to elect 543 members of the lower house of Parliament.'
    },
    {
      name: 'State Assembly Election - Maharashtra',
      status: 'Upcoming',
      constituency: 'Maharashtra',
      date: 'October 2024',
      details: 'Election for the legislative assembly of Maharashtra.'
    },
    {
        name: 'State Assembly Election - Haryana',
        status: 'Upcoming',
        constituency: 'Haryana',
        date: 'October 2024',
        details: 'Election for the legislative assembly of Haryana.'
    }
  ];
  
  /**
   * Fetches all elections from the "database".
   * In a real app, this would be an async database call.
   */
  export async function getAllElections(): Promise<Election[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return elections;
  }
  
  /**
   * Fetches only the elections that are currently ongoing.
   */
  export async function getRunningElections(): Promise<Election[]> {
    const allElections = await getAllElections();
    return allElections.filter(election => election.status === 'Ongoing');
  }
  