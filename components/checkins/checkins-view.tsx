// app/checkins/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "../ui/badge";

type KeyResult = {
  id: string;
  title: string;
  target_value: number;
};

type CheckIn = {
  id: string;
  progress_value: number;
  comment: string;
  check_in_date: string;
  created_at: string;
  key_result: KeyResult;
  status: "pending" | "approved" | "rejected";
};

export default function CheckinsPage() {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCheckins = async () => {
      try {
        const res = await fetch("/api/checkins", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch check-ins");
        const data: CheckIn[] = await res.json();
        setCheckins(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckins();
  }, []);

  if (loading) {
    return <p className="p-4">Loading check-ins...</p>;
  }
  function getStatusColor(status: string) {
    switch (status?.toLowerCase()) {
      case "rejected":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      case "approved":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  }
  function capitalizeFirst(str: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className="p-6 space-y-4">
      {checkins.map((checkin) => (
        <Card key={checkin.id} className="p-4">
          <CardHeader className="flex flex-row justify-between items-center p-0 mb-2">
            <CardTitle className="text-lg font-semibold">
              {checkin.key_result.title}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {new Date(checkin.check_in_date).toLocaleDateString()}
            </span>
          </CardHeader>

          <CardContent className="p-0 space-y-3">
            <div className="flex flex-col gap-3">
              <p className="text-sm">
                {Math.floor(
                  (checkin.progress_value / checkin.key_result.target_value) *
                    100
                )}
                %
              </p>
              <Progress
                value={
                  (checkin.progress_value / checkin.key_result.target_value) *
                  100
                }
                className="h-3"
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {checkin.comment || "—"}
              </p>
            </div>
            <div>
              <Badge className={`${getStatusColor(checkin.status)} capitalize`}>
                {capitalizeFirst(checkin.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
