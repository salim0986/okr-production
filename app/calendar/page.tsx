"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { CalendarView } from "@/components/calendar/calendar-view";

export default function CalendarPage() {
  return (
    <MainLayout>
      <CalendarView />
    </MainLayout>
  );
}
