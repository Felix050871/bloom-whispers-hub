import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { BottomNavigation } from "@/components/BottomNavigation";
import { UserMenu } from "@/components/UserMenu";
import shebloomLogo from "@/assets/shebloom-logo.png";
import shebloomIcon from "@/assets/shebloom-icon.png";

interface AppLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppLayout({ children, activeSection, onSectionChange }: AppLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-40 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <button 
              onClick={() => onSectionChange('home')} 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img 
                src={shebloomIcon} 
                alt="SheBloom Icon" 
                className="w-8 h-8 object-contain"
              />
              <img 
                src={shebloomLogo} 
                alt="SheBloom Logo" 
                className="h-6 object-contain"
              />
            </button>
            
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca contenuti, mentori..."
                className="pl-10 w-80 bg-muted/50 border-0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <UserMenu onSectionChange={onSectionChange} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container max-w-none p-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeSection={activeSection} 
        onSectionChange={onSectionChange} 
      />
    </div>
  );
}