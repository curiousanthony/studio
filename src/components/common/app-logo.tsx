import { cn } from "@/lib/utils";

export function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("lucide lucide-box-select", className)}
      data-ai-hint="logo abstract"
    >
      <path d="M5 3a2 2 0 0 0-2 2" />
      <path d="M19 3a2 2 0 0 1 2 2" />
      <path d="M21 19a2 2 0 0 1-2 2" />
      <path d="M3 19a2 2 0 0 0 2 2" />
      <path d="M5 9V5h4" />
      <path d="M9 21H5v-4" />
      <path d="M15 21h4v-4" />
      <path d="M19 9V5h-4" />
    </svg>
  );
}
