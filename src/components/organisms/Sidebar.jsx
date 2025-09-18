import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Sidebar = () => {
  const location = useLocation()

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "LayoutDashboard",
    },
    {
      name: "Contracts",
      href: "/contracts",
      icon: "FileText",
    },
    {
      name: "Customers",
      href: "/customers",
      icon: "Users",
    },
{
name: "R&D Projects",
href: "/projects",
icon: "Lightbulb",
},
{
name: "Project & Task Management",
href: "/project-task-management",
icon: "ClipboardList",
},
{
name: "Personnel",
href: "/personnel",
icon: "UserCog",
},
]

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-white/90 backdrop-blur-xl border-r border-gray-200/50">
        <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="Zap" className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold gradient-text">Nexus ERP</h1>
                <p className="text-xs text-gray-500">Enterprise Management</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-5 flex-1 px-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <ApperIcon
                    name={item.icon}
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 relative z-10",
                      isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />
                  <span className="relative z-10">{item.name}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar