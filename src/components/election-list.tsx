import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { getRunningElections } from "@/lib/data/elections";

export default async function ElectionList() {
  const runningElections = await getRunningElections();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {runningElections.map((election, index) => (
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
            <Button asChild className="w-full">
              <Link href="/login">
                Vote Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
       {runningElections.length === 0 && (
        <Card className="md:col-span-2 lg:col-span-3 text-center">
            <CardHeader>
                <CardTitle>No Ongoing Elections</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">There are currently no elections running. Please check back later.</p>
            </CardContent>
        </Card>
       )}
    </div>
  );
}
