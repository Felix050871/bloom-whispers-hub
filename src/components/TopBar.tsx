import React from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';
import { SheBloomLogo } from './SheBloomLogo';
import { useAuth } from '@/hooks/useAuth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
  userName: string;
}

export const TopBar: React.FC<TopBarProps> = ({ userName }) => {
  const { signOut } = useAuth();

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 max-w-2xl">
        <div className="flex items-center justify-between">
          <SheBloomLogo size="sm" />
          
          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-full hover:bg-muted/50 transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted/50 transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 bg-gradient-to-br from-bloom-lilac to-bloom-lilac/60 rounded-full flex items-center justify-center text-white text-sm font-medium hover:scale-105 transition-transform">
                  {userName?.[0]?.toUpperCase() || 'B'}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium">
                  Ciao, {userName}! 👋
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-vital-red">
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnetti
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};