import React, { useState } from "react"
import Sidebar from "@/components/organisms/Sidebar"
import MobileSidebar from "@/components/organisms/MobileSidebar"
import Header from "@/components/organisms/Header"
import { useLocation } from "react-router-dom"

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const getPageTitle = () => {
switch (location.pathname) {
case "/dashboard":
return "Dashboard"
case "/contracts":
return "Contract Management"
case "/customers":
return "Customer Management"
case "/projects":
return "R&D Projects"
case "/project-task-management":
return "Project & Task Management"
case "/personnel":
return "Personnel Management"
default:
return "Nexus ERP"
}
}

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar />
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden lg:ml-72">
        <Header
          title={getPageTitle()}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout