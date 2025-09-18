import React from 'react';
import { Home, Users, Calendar } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'daily' | 'sessions' | 'social';
  onTabChange: (tab: 'daily' | 'sessions' | 'social') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'daily', label: 'Bloom Daily', icon: Home },
    { id: 'sessions', label: 'Bloom Sessions', icon: Calendar },
    { id: 'social', label: 'Social Bloom', icon: Users }
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center space-y-1 px-4 py-2 transition-all ${
              activeTab === id
                ? 'text-bloom-lilac scale-110'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};