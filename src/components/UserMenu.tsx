import { useState, useEffect } from "react";
import { User, Wallet, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { supabase } from "@/integrations/supabase/client";

interface UserMenuProps {
  onSectionChange: (section: string) => void;
}

export function UserMenu({ onSectionChange }: UserMenuProps) {
  const { user, signOut } = useAuth();
  const { balance } = useWallet();
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch user profile
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const accountItems = [
    {
      id: 'profile',
      title: 'Profilo',
      icon: User,
      description: 'Le tue informazioni',
    },
    {
      id: 'wallet',
      title: 'Wallet',
      icon: Wallet,
      description: 'Gestisci i pagamenti',
      badge: `€${balance.toFixed(0)}`,
    },
    {
      id: 'settings',
      title: 'Impostazioni',
      icon: Settings,
      description: 'Preferenze app',
    },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-0 w-10 h-10 rounded-full">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
            {(user?.user_metadata?.name || 'U').charAt(0).toUpperCase()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userProfile?.name || user?.user_metadata?.name || 'Utente'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {accountItems.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center w-full">
                <Icon className="mr-3 h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs ml-2">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
          <LogOut className="mr-3 h-4 w-4" />
          <span>Esci</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}