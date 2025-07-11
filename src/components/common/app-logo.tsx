import { cn } from "@/lib/utils";

export function AppLogo({ className }: { className?: string }) {
  return (
    <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M30.8431 4.5C30.8431 2.016 28.8271 0 26.3431 0H5.34314C2.85914 0 0.84314 2.016 0.84314 4.5V25.5C0.84314 27.984 2.85914 30 5.34314 30H26.3431C28.8271 30 30.8431 27.984 30.8431 25.5V4.5Z" fill="#EF4444"/>
      <path d="M8.54365 19.6533L11.1895 21.6635L11.2206 11.6282L13.7162 10.6702L13.8028 20.6604L16.8019 23.1026L16.8781 13.0499L19.492 12.0466L19.4743 22.0767L22.0243 24.5026L22.3007 13.9943L22.3417 10.6702L16.4858 6.01364L8.43059 9.10573L8.54365 19.6533Z" fill="white"/>
    </svg>

    /*<svg
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
    </svg>*/
  );
}
