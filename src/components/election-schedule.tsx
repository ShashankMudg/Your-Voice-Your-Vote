import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { getRunningElections } from "@/lib/data/elections";

export default async function ElectionSchedule() {
  const runningElections = await getRunningElections();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Running Elections</CardTitle>
        <CardDescription>Currently ongoing elections across India.</CardDescription>
      </CardHeader>
      <CardContent>
        {runningElections.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {runningElections.map((election, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b-0 rounded-lg border bg-card">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-left text-primary">{election.name}</span>
                    <Badge className={`ml-4 bg-accent hover:bg-accent/90 text-accent-foreground`}>
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
        ) : (
          <p className="text-muted-foreground text-center">No elections are currently running.</p>
        )}
      </CardContent>
    </Card>
  );
}
