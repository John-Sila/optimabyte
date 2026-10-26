import { Link } from "react-router-dom";
import { ClipboardList, FileText, Lock, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";

/** Top-right admin entry: a sign-in button for visitors, a menu once signed in. */
export default function AdminMenu({ compact = false }: { compact?: boolean }) {
  const { admin, openLogin, logout } = useAuth();

  if (!admin) {
    return (
      <Button
        variant="outline"
        size={compact ? "icon" : "sm"}
        onClick={openLogin}
        aria-label="Admin sign-in"
        className="gap-1.5"
      >
        <Lock className="h-4 w-4" />
        {!compact && "Admin"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={compact ? "icon" : "sm"} aria-label="Admin menu" className="gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-text text-[11px] font-bold text-background">
            {admin.name.charAt(0).toUpperCase()}
          </span>
          {!compact && admin.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-semibold">{admin.name}</p>
          <p className="truncate text-xs text-muted-foreground">{admin.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/admin/reports" className="cursor-pointer">
            <ClipboardList className="mr-2 h-4 w-4" />
            Reports
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/admin/invoices" className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            Invoices
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/admin/logins" className="cursor-pointer">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Login activity
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => {
            void logout();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
