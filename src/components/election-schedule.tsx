import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, MapPin, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const elections = [
  {
    name: 'Lok Sabha General Election 2024',
    status: 'Ongoing',
    constituency: 'Nationwide',
    date: 'April 19 - June 1, 2024',
    details: 'The 18th Lok Sabha election to elect 543 members of the lower house of Parliament. Voting is being held in seven phases.'
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

export default function ElectionSchedule() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Election Schedule</CardTitle>
        <CardDescription>Ongoing and upcoming elections across India.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {elections.map((election, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="border-b-0 rounded-lg border bg-card">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-left text-primary">{election.name}</span>
                  <Badge className={`ml-4 ${election.status === 'Ongoing' ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {election.status}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 text-sm text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{election.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{election.constituency}</span>
                  </div>
                  <p className="pt-2">{election.details}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
