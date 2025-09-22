import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import FilterDropdown from "@/components/molecules/FilterDropdown"
import DataTable from "@/components/organisms/DataTable"
import Modal from "@/components/organisms/Modal"
import ProjectTaskForm from "@/components/organisms/ProjectTaskForm"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { projectTaskService } from "@/services/api/projectTaskService"

const ProjectTaskManagement = () => {
  const [projectTasks, setProjectTasks] = useState([])
  const [filteredProjectTasks, setFilteredProjectTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProjectTask, setEditingProjectTask] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterProjectTasks()
  }, [projectTasks, searchQuery, statusFilter, priorityFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectTaskService.getAll()
      setProjectTasks(data)
    } catch (err) {
      setError(err.message || "Failed to load project tasks")
      console.error("Error loading project tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  const filterProjectTasks = () => {
    let filtered = [...projectTasks]

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.projectDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.projectManagerEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.projectPriority === priorityFilter)
    }

    setFilteredProjectTasks(filtered)
  }

  const handleCreateProjectTask = async (projectTaskData) => {
try {
      // Transform data for API compatibility
      const transformedData = {
        ...projectTaskData,
        departments_involved_c: Array.isArray(projectTaskData.departmentsInvolved) 
          ? projectTaskData.departmentsInvolved.join(',') 
          : projectTaskData.departmentsInvolved || '',
        progress_range_c: projectTaskData.progressRange?.toString() || '0',
        project_tags_c: Array.isArray(projectTaskData.projectTags) 
          ? projectTaskData.projectTags.join(',') 
          : projectTaskData.projectTags || '',
        include_risk_assessment_c: Array.isArray(projectTaskData.includeRiskAssessment) 
          ? projectTaskData.includeRiskAssessment.join(',') 
          : projectTaskData.includeRiskAssessment?.toString() || 'false',
        Tags: Array.isArray(projectTaskData.projectTags) 
          ? projectTaskData.projectTags.join(',') 
          : projectTaskData.projectTags || ''
      }
      
      const newProjectTask = await projectTaskService.create(transformedData)
      setProjectTasks(prev => [newProjectTask, ...prev])
      setIsModalOpen(false)
      toast.success("Project task created successfully!")
    } catch (err) {
      toast.error("Failed to create project task")
      console.error("Error creating project task:", err)
    }
  }

  const handleEditProjectTask = (projectTask) => {
    setEditingProjectTask(projectTask)
    setIsModalOpen(true)
  }

  const handleUpdateProjectTask = async (projectTaskData) => {
try {
      // Transform data for API compatibility
      const transformedData = {
        ...projectTaskData,
        departments_involved_c: Array.isArray(projectTaskData.departmentsInvolved) 
          ? projectTaskData.departmentsInvolved.join(',') 
          : projectTaskData.departmentsInvolved || '',
        progress_range_c: projectTaskData.progressRange?.toString() || '0',
        project_tags_c: Array.isArray(projectTaskData.projectTags) 
          ? projectTaskData.projectTags.join(',') 
          : projectTaskData.projectTags || '',
        include_risk_assessment_c: Array.isArray(projectTaskData.includeRiskAssessment) 
          ? projectTaskData.includeRiskAssessment.join(',') 
          : projectTaskData.includeRiskAssessment?.toString() || 'false',
        Tags: Array.isArray(projectTaskData.projectTags) 
          ? projectTaskData.projectTags.join(',') 
          : projectTaskData.projectTags || ''
      }
      
      const updatedProjectTask = await projectTaskService.update(editingProjectTask.Id, transformedData)
      setProjectTasks(prev => prev.map(task => 
        task.Id === editingProjectTask.Id ? updatedProjectTask : task
      ))
      setIsModalOpen(false)
      setEditingProjectTask(null)
      toast.success("Project task updated successfully!")
    } catch (err) {
      toast.error("Failed to update project task")
      console.error("Error updating project task:", err)
    }
  }

  const handleDeleteProjectTask = async (projectTaskId) => {
    if (!window.confirm("Are you sure you want to delete this project task?")) {
      return
    }

    try {
      await projectTaskService.delete(projectTaskId)
      setProjectTasks(prev => prev.filter(task => task.Id !== projectTaskId))
      toast.success("Project task deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete project task")
      console.error("Error deleting project task:", err)
    }
  }

  const getPriorityBadgeVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "destructive"
      case "medium": return "warning"
      case "low": return "secondary"
      default: return "outline"
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "success"
      case "in progress": return "primary"
      case "not started": return "outline"
      default: return "outline"
    }
  }

  const formatCurrency = (amount, currency) => {
    const symbols = { USD: "$", EUR: "€", INR: "₹" }
    return `${symbols[currency] || currency} ${amount?.toLocaleString() || "0"}`
  }

const columns = [
    {
      key: "projectName",
      label: "Project Name",
      sortable: true,
      render: (projectTask) => (
        <div className="min-w-[200px]">
          <div className="font-medium text-gray-900 truncate">
            {projectTask.projectName}
          </div>
          <div className="text-xs text-gray-500 truncate mt-1">
            {projectTask.projectDescription?.slice(0, 60)}
            {projectTask.projectDescription?.length > 60 ? "..." : ""}
          </div>
        </div>
      ),
    },
    {
      key: "assignedTo",
      label: "Assigned To",
      render: (projectTask) => (
        <div className="text-gray-900 font-medium">
          {projectTask.assignedTo}
        </div>
      ),
    },
    {
      key: "projectPriority",
      label: "Priority",
      render: (projectTask) => (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          getPriorityBadgeVariant(projectTask.projectPriority) === "destructive" ? "bg-red-100 text-red-800" :
          getPriorityBadgeVariant(projectTask.projectPriority) === "warning" ? "bg-yellow-100 text-yellow-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {projectTask.projectPriority}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (projectTask) => (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          getStatusBadgeVariant(projectTask.status) === "success" ? "bg-green-100 text-green-800" :
          getStatusBadgeVariant(projectTask.status) === "primary" ? "bg-blue-100 text-blue-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {projectTask.status}
        </div>
      ),
    },
    {
      key: "numberOfTeamMembers",
      label: "Team Size",
      render: (projectTask) => (
        <div className="flex items-center space-x-1">
          <ApperIcon name="Users" className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900">
            {projectTask.numberOfTeamMembers}
          </span>
        </div>
      ),
    },
    {
      key: "allocatedBudget",
      label: "Budget",
      render: (projectTask) => (
        <div className="text-right">
          <div className="text-gray-900 font-medium">
            {formatCurrency(projectTask.allocatedBudget, projectTask.allocatedBudgetCurrency)}
          </div>
          {projectTask.estimatedBudget && projectTask.estimatedBudget !== projectTask.allocatedBudget && (
            <div className="text-xs text-gray-500">
              Est: {formatCurrency(projectTask.estimatedBudget, projectTask.allocatedBudgetCurrency)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "progressRange",
      label: "Progress",
      render: (projectTask) => (
        <div className="flex items-center space-x-2 min-w-[120px]">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${projectTask.progressRange}%` }}
            />
          </div>
          <span className="text-sm text-gray-600 min-w-[35px]">
            {projectTask.progressRange}%
          </span>
        </div>
      ),
    },
    {
      key: "startDate",
      label: "Start Date",
      sortable: true,
      render: (projectTask) => (
        <div className="text-gray-600 text-sm">
          {projectTask.startDate 
            ? new Date(projectTask.startDate).toLocaleDateString()
            : "Not Set"}
        </div>
      ),
    },
    {
      key: "deadline",
      label: "Deadline",
      sortable: true,
      render: (projectTask) => (
        <div className="text-gray-600 text-sm">
          {projectTask.deadline 
            ? new Date(projectTask.deadline).toLocaleDateString()
            : "No Deadline"}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (projectTask) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditProjectTask(projectTask)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <ApperIcon name="Edit" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteProjectTask(projectTask.Id)}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "Not Started", label: "Not Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ]

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "High", label: "High Priority" },
    { value: "Medium", label: "Medium Priority" },
    { value: "Low", label: "Low Priority" },
  ]

  if (loading) {
    return <Loading text="Loading project tasks..." />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project & Task Management</h1>
          <p className="text-gray-600">Comprehensive project and task management system</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Project Task
        </Button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search project tasks..."
        />
        <div className="flex gap-3">
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
          />
          <FilterDropdown
            label="Priority"
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={priorityOptions}
          />
        </div>
      </div>

      {/* Data Table */}
      {filteredProjectTasks.length === 0 ? (
        <Empty
          title="No project tasks found"
          description="Get started by creating your first project task"
          icon="ClipboardList"
          actionLabel="Create Project Task"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <DataTable
          data={filteredProjectTasks}
          columns={columns}
          searchQuery={searchQuery}
        />
      )}

      {/* Project Task Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProjectTask(null)
        }}
        title={editingProjectTask ? "Edit Project Task" : "Create New Project Task"}
        size="xl"
      >
        <ProjectTaskForm
          initialData={editingProjectTask}
          onSubmit={editingProjectTask ? handleUpdateProjectTask : handleCreateProjectTask}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingProjectTask(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default ProjectTaskManagement