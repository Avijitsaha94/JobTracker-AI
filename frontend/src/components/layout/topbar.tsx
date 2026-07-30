import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}