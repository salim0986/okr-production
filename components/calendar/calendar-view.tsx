"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, Target } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'deadline' | 'checkin' | 'meeting';
  date: Date;
  description: string;
}

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Q1 OKR Review',
      type: 'deadline',
      date: new Date(2024, 2, 15),
      description: 'Quarterly review of all objectives'
    },
    {
      id: '2',
      title: 'Team Check-in',
      type: 'checkin',
      date: new Date(2024, 2, 20),
      description: 'Weekly team progress update'
    },
    {
      id: '3',
      title: 'Strategy Meeting',
      type: 'meeting',
      date: new Date(2024, 2, 25),
      description: 'Planning session for next quarter'
    }
  ]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'deadline':
        return 'destructive';
      case 'checkin':
        return 'default';
      case 'meeting':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Target className="h-4 w-4" />;
      case 'checkin':
        return <Clock className="h-4 w-4" />;
      case 'meeting':
        return <CalendarDays className="h-4 w-4" />;
      default:
        return <CalendarDays className="h-4 w-4" />;
    }
  };

  const selectedDateEvents = events.filter(event => 
    date && event.date.toDateString() === date.toDateString()
  );

  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
        <p className="text-muted-foreground">
          Track important dates, deadlines, and check-ins
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>
              Select a date to view scheduled events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {date ? `Events for ${date.toLocaleDateString()}` : 'Select a date'}
              </CardTitle>
              <CardDescription>
                {selectedDateEvents.length} event(s) scheduled
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{event.title}</p>
                          <Badge variant={getEventTypeColor(event.type)} className="ml-2">
                            {event.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No events scheduled for this date
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Next 5 scheduled events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getEventIcon(event.type)}
                        <div>
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming events
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
