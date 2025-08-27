import type { LucideProps } from "lucide-react";
import { Bot, Image as ImageIcon, Send, Sparkles } from "lucide-react";

export const Icons = {
  bot: Bot,
  image: ImageIcon,
  send: Send,
  sparkles: Sparkles,
  logo: (props: LucideProps) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <rect width="8" height="6" x="9" y="7" rx="1"></rect>
      <circle cx="11" cy="9" r=".5"></circle>
      <path d="m13 13-1.5-1.5-3 3"></path>
    </svg>
  ),
};
