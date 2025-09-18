import { useState } from "react";
import { 
  Calendar, 
  Heart, 
  TrendingUp, 
  Users, 
  Wallet,
  Settings,
  Home,
  BookOpen,
  MessageSquare,
  User
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/useWallet";

const navigationItems = [
  { 
    title: "Home", 
    url: "/", 
    icon: Home,
    description: "Dashboard principale"
  }
];

const accountItems = [
  { 
    title: "Profilo", 
    url: "#", 
    icon: User,
    description: "Le tue informazioni",
    action: "profile"
  },
  { 
    title: "Wallet", 
    url: "#", 
    icon: Wallet,
    description: "Gestisci i pagamenti",
    action: "wallet"
  },
  { 
    title: "Impostazioni", 
    url: "#", 
    icon: Settings,
    description: "Preferenze app",
    action: "settings"
  },
];

interface AppSidebarProps {
  onSectionChange?: (section: string) => void;
}

export function AppSidebar({ onSectionChange }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const { balance } = useWallet();
  const currentPath = location.pathname;
  
  const collapsed = state === "collapsed";

  const handleItemClick = (item: typeof accountItems[0], e: React.MouseEvent) => {
    if (item.action && onSectionChange) {
      e.preventDefault();
      onSectionChange(item.action);
    }
  };

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavCls = (isActiveRoute: boolean) =>
    `w-full justify-start h-12 ${
      isActiveRoute 
        ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
    }`;

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r bg-card transition-all duration-300`}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  SheBloom
                </h2>
                <p className="text-xs text-muted-foreground">Il tuo benessere</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>

        <SidebarContent className="flex-1 px-2 py-4">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
              Navigazione
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => {
                  const isActiveRoute = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          className={getNavCls(isActiveRoute)}
                          title={collapsed ? item.title : undefined}
                        >
                          <item.icon className={`${collapsed ? "mx-auto" : "mr-3"} h-5 w-5 flex-shrink-0`} />
                          {!collapsed && (
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{item.title}</div>
                              <div className="text-xs text-muted-foreground truncate">
                                {item.description}
                              </div>
                            </div>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Account Section */}
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
              Account
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {accountItems.map((item) => {
                  const isActiveRoute = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        {item.action ? (
                          <button
                            onClick={(e) => handleItemClick(item, e)}
                            className={getNavCls(isActiveRoute)}
                            title={collapsed ? item.title : undefined}
                          >
                            <item.icon className={`${collapsed ? "mx-auto" : "mr-3"} h-5 w-5 flex-shrink-0`} />
                            {!collapsed && (
                              <div className="flex-1 min-w-0 flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{item.title}</div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {item.description}
                                  </div>
                                </div>
                                {item.title === "Wallet" && (
                                  <Badge variant="secondary" className="text-xs">
                                    €{balance.toFixed(0)}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </button>
                        ) : (
                          <NavLink 
                            to={item.url} 
                            className={getNavCls(isActiveRoute)}
                            title={collapsed ? item.title : undefined}
                          >
                            <item.icon className={`${collapsed ? "mx-auto" : "mr-3"} h-5 w-5 flex-shrink-0`} />
                            {!collapsed && (
                              <div className="flex-1 min-w-0 flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{item.title}</div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {item.description}
                                  </div>
                                </div>
                                {item.title === "Wallet" && (
                                  <Badge variant="secondary" className="text-xs">
                                    €{balance.toFixed(0)}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </NavLink>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <div className="p-4 border-t">
          {!collapsed ? (
            <div className="text-xs text-muted-foreground text-center">
              <p>SheBloom v1.0</p>
              <p>Il tuo spazio di benessere</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-muted rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}