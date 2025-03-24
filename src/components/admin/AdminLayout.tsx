
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminLayout = () => {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  // Close sidebar by default on mobile screens
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar isOpen={isSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-3 md:p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
