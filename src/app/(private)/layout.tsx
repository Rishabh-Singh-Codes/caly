import { NavLink } from "@/components/NavLink";
import { UserButton } from "@clerk/nextjs";
import { CalendarCheck } from "lucide-react";
import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header className="flex py-2 border-b bg-card">
        <nav className="font-medium flex items-center text-sm gap-6 container">
          <div className="flex items-center gap-2 font-semibold mr-auto">
            <CalendarCheck className="text-green-700"/>
            <span className="sr-only md:not-sr-only">Caly</span>
          </div>
          <NavLink href="/events">Events</NavLink>
          <NavLink href="/schedule">Schedule</NavLink>
          <div className="ml-auto size-10">
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: "size-full" } }}
            />
          </div>
        </nav>
      </header>
      <main className="container mx-auto my-6">{children}</main>
    </div>
  );
}
