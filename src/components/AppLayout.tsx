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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface AppLayoutProps {
  children: ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppLayout({ children, activeSection, onSectionChange }: AppLayoutProps) {
  const { user } = useAuth();

  const notifications = [
    { id: '1', title: 'Nuovo contenuto quotidiano', description: 'Scopri la sessione di oggi in Bloom Daily', time: '2h fa' },
    { id: '2', title: 'Promemoria sessione', description: 'Hai una sessione prenotata domani alle 10:00', time: '1g fa' },
    { id: '3', title: 'Aggiornamento profilo', description: 'Completa il tuo profilo per suggerimenti migliori', time: '3g fa' },
  ];

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative" aria-label="Apri notifiche">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="px-3 py-2">
                  <div className="text-sm font-medium">Notifiche</div>
                  <div className="text-xs text-muted-foreground">
                    {notifications.length > 0 ? 'Aggiornamenti recenti' : 'Nessuna notifica'}
                  </div>
                </div>
                {notifications.map(n => (
                  <DropdownMenuItem key={n.id} className="flex flex-col items-start space-y-1 py-3">
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.description}</div>
                    <div className="text-[10px] text-muted-foreground">{n.time}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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