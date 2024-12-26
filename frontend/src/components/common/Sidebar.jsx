import { BarChart2, DollarSign, Menu, Settings, ShoppingBag, ShoppingCart, TrendingUp, Users, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart2, color: "#6366f1", href: "/admin" },
  { name: "Products", icon: ShoppingBag, color: "#6366f1", href: "/admin/products" },
  { name: "Users", icon: Users, color: "#6366f1", href: "/admin/users" },
  { name: "Sales", icon: DollarSign, color: "#6366f1", href: "/admin/sales" },
  { name: "Orders", icon: ShoppingCart, color: "#6366f1", href: "/admin/orders" },
  { name: "Analytics", icon: TrendingUp, color: "#6366f1", href: "/admin/analytics" },
  { name: "Settings", icon: Settings, color: "#6366f1", href: "/admin/settings" },
  { name: "Log out", icon: LogOut, color: "#6366f1", href: "/admin/logout" },

];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation(); // Get the current location (route)
  

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-3 flex flex-col ">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div
                className={`flex items-center p-4 text-sm font-medium hover:bg-gray-700 transition-colors mb-2 ${
                  location.pathname === item.href
                    ? "font-bold border-r-4 border-[#6366f1] text-gray-100"
                    : "text-gray-400"
                }`}
                whileHover={{ backgroundColor: '#d1d5db' }}
                whileTap={{
                  scale: 0.95,
                  backgroundColor: '#d1d5db', 
                }}
              >
                <item.icon
                  size={20}
                  style={{
                    color: location.pathname === item.href ? "#6366f1" : item.color,
                    minWidth: "20px",
                  }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
