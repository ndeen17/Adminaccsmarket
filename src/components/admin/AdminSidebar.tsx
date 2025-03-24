
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  LayoutGrid, 
  BarChart3, 
  Settings,
  LogOut,
  XCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface AdminSidebarProps {
  isOpen: boolean;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: LayoutGrid,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

const AdminSidebar = ({ isOpen }: AdminSidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" aria-hidden="true" />
      )}
      
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
            "shadow-lg": isMobile && isOpen
          }
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary mr-2">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <span className="text-xl font-bold">Admin</span>
          </div>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
            >
              <XCircle className="h-5 w-5" />
            </Button>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    {
                      "bg-gray-100": location.pathname === item.href,
                      "hover:bg-gray-50": location.pathname !== item.href,
                    }
                  )}
                >
                  <item.icon
                    className={cn("h-5 w-5", {
                      "text-primary": location.pathname === item.href,
                      "text-gray-500": location.pathname !== item.href,
                    })}
                  />
                  <span
                    className={cn("ml-3", {
                      "text-primary": location.pathname === item.href,
                    })}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-2 border-t border-gray-200">
          <Button 
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 px-3 py-2.5"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
