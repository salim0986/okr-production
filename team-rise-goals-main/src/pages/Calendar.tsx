import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Target, Clock, AlertTriangle } from "lucide-react";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const events = [
    {
      id: 1,
      title: "Security Audit Deadline",
      date: "2024-03-15",
      type: "Key Result",
      status: "Blocked",
      okr: "Improve Development Velocity"
    },
    {
      id: 2,
      title: "Q1 OKR Review Meeting",
      date: "2024-03-31",
      type: "Objective",
      status: "On Track",
      okr: "Increase User Engagement"
    },
    {
      id: 3,
      title: "Feature Release Milestone",
      date: "2024-03-20",
      type: "Key Result",
      status: "On Track",
      okr: "Increase User Engagement"
    },
    {
      id: 4,
      title: "Team Retrospective",
      date: "2024-03-08",
      type: "Meeting",
      status: "On Track",
      okr: "Team Development"
    },
    {
      id: 5,
      title: "User Research Completion",
      date: "2024-03-25",
      type: "Key Result",
      status: "At Risk",
      okr: "Product Strategy"
    }
  ];

  const upcomingEvents = events.filter(event => 
    new Date(event.date) >= new Date()
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todayEvents = events.filter(event => 
    new Date(event.date).toDateString() === new Date().toDateString()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Blocked":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "At Risk":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Target className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const className = 
      status === "On Track" ? "status-on-track" :
      status === "At Risk" ? "status-at-risk" :
      "status-blocked";
    
    return <Badge variant="outline" className={className}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Track OKR deadlines and important milestones
          </p>
        </div>
        <Button className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-full"
                  modifiers={{
                    hasEvent: events.map(event => new Date(event.date))
                  }}
                  modifiersClassNames={{
                    hasEvent: "bg-primary/20 text-primary font-bold"
                  }}
                />
                
                {/* Legend */}
                <div className="space-y-2">
                  <h4 className="font-medium">Legend:</h4>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>On Track</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>At Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Blocked</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          {todayEvents.length > 0 && (
            <Card className="neumorph-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayEvents.map((event) => (
                  <Popover key={event.id}>
                    <PopoverTrigger asChild>
                      <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.type}</p>
                          </div>
                          {getStatusIcon(event.status)}
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium">{event.title}</h4>
                          {getStatusBadge(event.status)}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span>{event.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">OKR:</span>
                            <span>{event.okr}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{event.date}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">View Details</Button>
                          <Button size="sm" variant="outline">Update</Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Upcoming Events */}
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.slice(0, 5).map((event) => (
                <Popover key={event.id}>
                  <PopoverTrigger asChild>
                    <div className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.date} • {event.type}
                          </p>
                        </div>
                        {getStatusIcon(event.status)}
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        {getStatusBadge(event.status)}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span>{event.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">OKR:</span>
                          <span>{event.okr}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span>{event.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">View Details</Button>
                        <Button size="sm" variant="outline">Update</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
              
              {upcomingEvents.length > 5 && (
                <Button variant="ghost" size="sm" className="w-full">
                  View All Events ({upcomingEvents.length - 5} more)
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="neumorph-card">
            <CardHeader>
              <CardTitle>Event Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Events</span>
                <span className="font-medium">{events.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Overdue</span>
                <span className="font-medium text-red-600">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">At Risk</span>
                <span className="font-medium text-yellow-600">2</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;