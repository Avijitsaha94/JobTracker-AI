import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <ThemeToggle />
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Google — SDE Intern</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge>Applied</Badge>
        </CardContent>
      </Card>
      <Button>Hello JobTrackr AI</Button>
    </div>
  );
}