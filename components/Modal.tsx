"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: string;
}

export default function Modal({
  title,
  onClose,
  children,
  footer,
}: ModalProps) {
  return (
    <div
      id="modal"
      tabIndex={-1}
      aria-hidden="true"
      className="fixed inset-0 flex items-center justify-center z-100 bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-lg max-h-full">
        <div className="relative bg-background border-2 rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Cerrar modal</span>
            </Button>
          </div>
          <div className="p-4 md:p-5 space-y-4">{children}</div>
          {footer && (
            <div className="flex justify-end p-4 md:p-5">
              <Button
                onClick={() =>
                  document
                    .querySelector("form")
                    ?.dispatchEvent(
                      new Event("submit", { cancelable: true, bubbles: true })
                    )
                }>
                {footer}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
