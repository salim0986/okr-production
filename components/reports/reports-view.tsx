"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Download, Filter, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ReportData {
  period: string;
  totalObjectives: number;
  completedObjectives: number;
  completionRate: number;
  trend: 'up' | 'down' | 'stable';
  teamPerformance: Array<{
    teamName: string;
    completionRate: number;
    objectivesCount: number;
  }>;
}

export function ReportsView() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-quarter");
  const [reportData] = useState<ReportData>({
    period: "Q1 2024",
    totalObjectives: 45,
    completedObjectives: 32,
    completionRate: 71,
    trend: 'up',
    teamPerformance: [
      { teamName: "Engineering", completionRate: 85, objectivesCount: 12 },
      { teamName: "Marketing", completionRate: 67, objectivesCount: 8 },
      { teamName: "Sales", completionRate: 78, objectivesCount: 10 },
      { teamName: "Product", completionRate: 62, objectivesCount: 15 },
    ]
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const exportReport = () => {
    // Simulate report export
    const data = {
      period: reportData.period,
      summary: {
        totalObjectives: reportData.totalObjectives,
        completedObjectives: reportData.completedObjectives,
        completionRate: reportData.completionRate,
      },
      teamPerformance: reportData.teamPerformance,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `okr-report-${reportData.period.toLowerCase().replace(' ', '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Reports
          </h2>
          <p className="text-muted-foreground">
            Analyze performance and track progress over time
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Summary of OKR performance for the selected period
              </CardDescription>
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-quarter">Current Quarter</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="current-year">Current Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Objectives</p>
                    <p className="text-2xl font-bold">{reportData.totalObjectives}</p>
                  </div>
                  {getTrendIcon(reportData.trend)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{reportData.completedObjectives}</p>
                  </div>
                  {getTrendIcon(reportData.trend)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">{reportData.completionRate}%</p>
                  </div>
                  {getTrendIcon(reportData.trend)}
                </div>
                <Progress value={reportData.completionRate} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>
            Breakdown of OKR completion rates by team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.teamPerformance.map((team, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{team.teamName}</p>
                    <p className="text-sm text-muted-foreground">
                      {team.objectivesCount} objectives
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32">
                    <Progress value={team.completionRate} className="h-2" />
                  </div>
                  <Badge 
                    variant={team.completionRate >= 80 ? 'default' : team.completionRate >= 60 ? 'secondary' : 'destructive'}
                  >
                    {team.completionRate}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>
              Important findings from the current period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <p className="text-sm">
                  Engineering team is performing exceptionally well with 85% completion rate
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <p className="text-sm">
                  Product team needs attention with 62% completion rate
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-sm">
                  Overall completion rate improved by 8% compared to last quarter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>
              Suggested actions based on current performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-sm">
                  Schedule one-on-one meetings with Product team members
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-sm">
                  Share Engineering team's best practices with other teams
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-sm">
                  Consider adjusting objective difficulty for next quarter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
