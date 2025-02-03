"use client";

import { AlertCircle } from "lucide-react";

export default function NoData({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2">
      <AlertCircle className="w-12 h-12" />
      <p>{message}</p>
    </div>
  );
}
