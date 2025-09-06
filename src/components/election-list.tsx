import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const elections = [
  {
    name: 'Lok Sabha General Election 2024',
    status: 'Ongoing',
    constituency: 'Nationwide',
    date: 'April 19 - June 1, 2024',
    details: 'The 18th Lok Sabha election to elect 543 members of the lower house of Parliament.'
  },
  {
    name: 'Maharashtra Assembly Election',
    status: 'Upcoming',
    constituency: 'Maharashtra State',
    date: 'October 2024 (Tentative)',
    details: 'State assembly elections to elect 288 members of the Maharashtra Legislative Assembly.'
  },
  {
    name: 'Haryana Assembly Election',
    status: 'Upcoming',
    constituency: 'Haryana State',
    date: 'October 2024 (Tentative)',
    details: 'State assembly elections to elect 90 members of the Haryana Legislative Assembly.'
  },
  {
    name: 'Bye-election for Pune Constituency',
    status: 'Upcoming',
    constituency: 'Pune, Maharashtra',
    date: 'July 10, 2024',
    details: 'A bye-election to fill a vacant seat in the Pune parliamentary constituency.'
  },
];

export default function ElectionList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {elections.map((election, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl text-primary">{election.name}</CardTitle>
              <Badge className={`${election.status === 'Ongoing' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {election.status}
              </Badge>
            </div>
            <CardDescription>{election.details}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{election.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{election.constituency}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" disabled={election.status !== 'Ongoing'}>
              <Link href="/login">
                {election.status === 'Ongoing' ? 'Vote Now' : 'Voting Closed'}
                {election.status === 'Ongoing' && <ArrowRight className="ml-2 h-4 w-4" />}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
