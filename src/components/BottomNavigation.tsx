import { Home, Calendar, Users, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  {
    id: 'home',
    title: 'Home',
    icon: Home,
  },
  {
    id: 'daily',
    title: 'Daily Bloom',
    icon: Calendar,
  },
  {
    id: 'appointments',
    title: 'Appuntamenti',
    icon: CalendarDays,
  },
  {
    id: 'community',
    title: 'Community',
    icon: Users,
  },
];

export function BottomNavigation({ activeSection, onSectionChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="flex justify-around items-center py-2 px-2 max-w-lg mx-auto">
        {navigationItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-2 min-w-0 ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-xs font-medium leading-tight">{item.title}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}