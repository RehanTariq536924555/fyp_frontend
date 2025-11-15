import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CircleUser,
  List,
  ShoppingBag,
  CreditCard,
  Settings,
  Home,
  PlusCircle,
  Pencil,
  Trash2,
  Eye,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Dashboarddata from "../dashboard/Dashboarddata";
import ListingSection from "../dashboard/ListingSection";
import SettingsSection from "../dashboard/SettingsSection";
import PaymentsSection from "../dashboard/PaymentsSection";
import AddListing from "../../pages/AddListing";
import AddProfile from "@/pages/profile/AddProfile";
import UpdateProfile from "@/pages/profile/UpdateProfile";
import ViewProfile from "@/pages/profile/ViewProfile";
import DeleteProfile from "@/pages/profile/DeleteProfile"; // Fixed import path
import Sales from "../../pages/AdminSales";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  defaultSection?: string;
}

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

const DashboardLayout = ({ children, defaultSection = "dashboard" }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("DashboardLayout mounted");
    return () => console.log("DashboardLayout unmounted");
  }, []);

  const mainSidebarItems: SidebarItem[] = [
    { title: "Dashboard", path: "dashboard", icon: LayoutDashboard },
    { title: "My Listings", path: "listings", icon: List },
    { title: "Add Listings", path: "addlistings", icon: PlusCircle },
    { title: "Sales History", path: "sales", icon: ShoppingBag },
    { title: "Settings", path: "settings", icon: Settings },
  ];

  const profileOptions: SidebarItem[] = [
    { title: "Add Profile", path: "addprofile", icon: PlusCircle },
    { title: "Update Profile", path: "updateprofile", icon: Pencil },
    { title: "Delete Profile", path: "deleteprofile", icon: Trash2 },
    { title: "View Profile", path: "viewprofile", icon: Eye },
  ];

  const renderDashboardSection = () => {
    switch (activeSection) {
      case "listings":
        return <ListingSection />;
      case "addlistings":
        return <AddListing />;
      case "sales":
        return <Sales />;
      case "settings":
        return <SettingsSection />;
      case "payments":
        return <PaymentsSection />;
      case "dashboard":
        return <Dashboarddata />;
      case "addprofile":
        return <AddProfile />;
      case "updateprofile":
        return <UpdateProfile />;
      case "deleteprofile":
        return <DeleteProfile />;
      case "viewprofile":
        return <ViewProfile />;
      default:
        return <Dashboarddata />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile Menu Icon */}
      <button
        className="absolute top-4 left-4 z-30 p-2 bg-teal-600 text-white rounded-md lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-teal-600 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-1 flex-col overflow-y-auto py-4">
          <nav className="flex-1 space-y-1 px-3">
            {mainSidebarItems.map((item) => (
              <Button
                key={item.title}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-white",
                  activeSection === item.path ? "bg-teal-700 text-white" : "hover:bg-teal-500 hover:text-white"
                )}
                onClick={() => {
                  setActiveSection(item.path);
                  setShowProfileOptions(false);
                  setSidebarOpen(false);
                }}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.title}
              </Button>
            ))}
            <Separator className="bg-teal-700" />
            <Button
              variant="ghost"
              className="w-full justify-start text-white"
              onClick={() => setShowProfileOptions(!showProfileOptions)}
            >
              <CircleUser className="mr-2 h-5 w-5" />
              Profile
            </Button>
            {showProfileOptions &&
              profileOptions.map((option) => (
                <Button
                  key={option.title}
                  variant="ghost"
                  className="ml-6 w-full justify-start text-sm text-white hover:bg-teal-500"
                  onClick={() => {
                    setActiveSection(option.path);
                    setSidebarOpen(false);
                  }}
                >
                  <option.icon className="mr-2 h-4 w-4" />
                  {option.title}
                </Button>
              ))}
          </nav>
        </div>
        <div className="border-t border-teal-700 p-4">
          <Button variant="ghost" className="w-full text-white hover:bg-teal-700" onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="relative flex-1 overflow-y-auto bg-background">
        <main className="container mx-auto p-4 sm:p-6 md:p-8">
          {children || renderDashboardSection()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;