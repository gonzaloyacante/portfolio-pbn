"use client";

import { AlertCircle } from "lucide-react";

export default function NoData({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <AlertCircle className="w-12 h-12" />
      <p className="mt-2">{message}</p>
    </div>
  );
}
