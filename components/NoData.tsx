"use client";

export default function NoData({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center h-full">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
