import React from 'react';
import { Bell, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheBloomLogo } from './SheBloomLogo';

interface TopBarProps {
  userName: string;
}

export const TopBar: React.FC<TopBarProps> = ({ userName }) => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between p-4">
        {/* Logo e saluto */}
        <div className="flex items-center space-x-3">
          <SheBloomLogo size="sm" showText={false} />
          <div>
            <p className="text-sm font-medium text-foreground">
              Ciao, {userName}
            </p>
            <p className="text-xs text-muted-foreground">
              Come stai oggi?
            </p>
          </div>
        </div>
        
        {/* Azioni */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="relative">
            <Search className="w-5 h-5 text-muted-foreground" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {/* Badge notifiche */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-vital-red rounded-full text-xs" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
};