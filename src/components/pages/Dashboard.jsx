import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { contractService } from "@/services/api/contractService"
import { customerService } from "@/services/api/customerService"
import { projectService } from "@/services/api/projectService"
import { personnelService } from "@/services/api/personnelService"

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    contracts: [],
    customers: [],
    projects: [],
    personnel: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [contracts, customers, projects, personnel] = await Promise.all([
        contractService.getAll(),
        customerService.getAll(),
        projectService.getAll(),
        personnelService.getAll()
      ])
      
      setDashboardData({
        contracts,
        customers,
        projects,
        personnel
      })
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return <Loading text="Loading dashboard..." />
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }

  const stats = [
    {
      title: "Active Contracts",
      value: dashboardData.contracts.length,
      icon: "FileText",
      color: "from-primary-500 to-primary-600",
      bgColor: "bg-primary-50",
      iconColor: "text-primary-600"
    },
    {
      title: "Total Customers",
      value: dashboardData.customers.length,
      icon: "Users",
      color: "from-secondary-500 to-secondary-600",
      bgColor: "bg-secondary-50",
      iconColor: "text-secondary-600"
    },
    {
      title: "Active Projects",
      value: dashboardData.projects.filter(p => !p.actualEndDate).length,
      icon: "Lightbulb",
      color: "from-accent-500 to-accent-600",
      bgColor: "bg-accent-50",
      iconColor: "text-accent-600"
    },
    {
      title: "Active Personnel",
      value: dashboardData.personnel.filter(p => !p.endDate).length,
      icon: "UserCog",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    }
  ]

  const highRiskContracts = dashboardData.contracts.filter(c => c.riskScore >= 7)
  const recentProjects = dashboardData.projects.slice(-3).reverse()

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <ApperIcon name={stat.icon} className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                </div>
              </div>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full transform translate-x-16 -translate-y-8`} />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* High Risk Contracts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">High Risk Contracts</h2>
              <ApperIcon name="AlertTriangle" className="h-5 w-5 text-red-500" />
            </div>
            
            {highRiskContracts.length === 0 ? (
              <div className="text-center py-6">
                <ApperIcon name="CheckCircle" className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="text-gray-500">No high-risk contracts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {highRiskContracts.map((contract) => (
                  <div
                    key={contract.Id}
                    className="flex items-center justify-between p-3 bg-red-50/80 rounded-lg border border-red-100"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">{contract.title}</h4>
                      <p className="text-sm text-gray-600">{contract.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-200 text-red-800">
                        Risk: {contract.riskScore}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Projects</h2>
              <ApperIcon name="Clock" className="h-5 w-5 text-accent-600" />
            </div>
            
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.Id}
                  className="flex items-center p-3 bg-accent-50/80 rounded-lg border border-accent-100"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Lightbulb" className="h-5 w-5 text-accent-600" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{project.name}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>{project.code}</span>
                      <span className="mx-2">•</span>
                      <span>{project.workplace}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.type === "Product" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {project.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <h2 className="text-lg font-bold text-gray-900 mb-6">System Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="TrendingUp" className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Active Workload</h3>
              <p className="text-2xl font-bold gradient-text">
                {dashboardData.projects.reduce((sum, p) => sum + p.rdQuota + p.supportQuota, 0)} Personnel
              </p>
              <p className="text-sm text-gray-600 mt-1">Across all projects</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Building2" className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Technology Centers</h3>
              <p className="text-2xl font-bold gradient-text">3 Locations</p>
              <p className="text-sm text-gray-600 mt-1">Istanbul, Ankara, Izmir</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Shield" className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Risk Management</h3>
              <p className="text-2xl font-bold gradient-text">
                {Math.round(dashboardData.contracts.reduce((sum, c) => sum + c.riskScore, 0) / dashboardData.contracts.length * 10) / 10}/10
              </p>
              <p className="text-sm text-gray-600 mt-1">Average risk score</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Dashboard