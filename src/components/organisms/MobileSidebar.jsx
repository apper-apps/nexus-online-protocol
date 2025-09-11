import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const MobileSidebar = ({ isOpen, onClose }) => {
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
      name: "Personnel",
      href: "/personnel",
      icon: "UserCog",
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 lg:hidden"
          >
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-6 mb-8">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                        <ApperIcon name="Zap" className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-3">
                        <h1 className="text-xl font-bold gradient-text">Nexus ERP</h1>
                        <p className="text-xs text-gray-500">Enterprise Management</p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <ApperIcon name="X" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <nav className="mt-5 flex-1 px-4 space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.href
                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={onClose}
                        className={cn(
                          "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden",
                          isActive
                            ? "text-white shadow-lg"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeMobileTab"
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileSidebar