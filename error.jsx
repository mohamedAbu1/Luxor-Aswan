"use client";

import StatusPage from "@/components/layout/StatusPage";

export default function ErrorPage({ reset }) {
  return <StatusPage kind="error" reset={reset} />;
}
