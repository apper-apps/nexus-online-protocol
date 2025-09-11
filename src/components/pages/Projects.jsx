import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import FilterDropdown from "@/components/molecules/FilterDropdown"
import DataTable from "@/components/organisms/DataTable"
import Modal from "@/components/organisms/Modal"
import ProjectForm from "@/components/organisms/ProjectForm"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { projectService } from "@/services/api/projectService"
import { contractService } from "@/services/api/contractService"
import { customerService } from "@/services/api/customerService"

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [contracts, setContracts] = useState([])
  const [customers, setCustomers] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedWorkplaces, setSelectedWorkplaces] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [projectsData, contractsData, customersData] = await Promise.all([
        projectService.getAll(),
        contractService.getAll(),
        customerService.getAll()
      ])
      setProjects(projectsData)
      setContracts(contractsData)
      setCustomers(customersData)
    } catch (err) {
      setError("Failed to load projects. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.workplace.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(project => selectedTypes.includes(project.type))
    }

    if (selectedWorkplaces.length > 0) {
      filtered = filtered.filter(project => selectedWorkplaces.includes(project.workplace))
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, selectedTypes, selectedWorkplaces])

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData)
      setProjects([...projects, newProject])
      setIsModalOpen(false)
      toast.success("Project created successfully!")
    } catch (err) {
      toast.error("Failed to create project. Please try again.")
    }
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleUpdateProject = async (projectData) => {
    try {
      const updatedProject = await projectService.update(editingProject.Id, projectData)
      setProjects(projects.map(p => p.Id === editingProject.Id ? updatedProject : p))
      setIsModalOpen(false)
      setEditingProject(null)
      toast.success("Project updated successfully!")
    } catch (err) {
      toast.error("Failed to update project. Please try again.")
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await projectService.delete(projectId)
        setProjects(projects.filter(p => p.Id !== projectId))
        toast.success("Project deleted successfully!")
      } catch (err) {
        toast.error("Failed to delete project. Please try again.")
      }
    }
  }

  const getStatusBadgeVariant = (project) => {
    if (project.actualEndDate) return "success"
    const now = new Date()
    const endDate = new Date(project.estimatedEndDate)
    if (endDate < now) return "danger"
    const warningThreshold = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    if (now > warningThreshold) return "warning"
    return "primary"
  }

  const getProjectStatus = (project) => {
    if (project.actualEndDate) return "Completed"
    const now = new Date()
    const endDate = new Date(project.estimatedEndDate)
    if (endDate < now) return "Overdue"
    const warningThreshold = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    if (now > warningThreshold) return "Near Deadline"
    return "Active"
  }

  const columns = [
    { key: "Id", title: "ID" },
    { key: "name", title: "Project Name" },
    { key: "code", title: "Project Code" },
    { 
      key: "type", 
      title: "Type",
      type: "badge",
      getBadgeVariant: (value) => value === "Product" ? "primary" : "secondary"
    },
    { key: "workplace", title: "Workplace" },
    { key: "startDate", title: "Start Date", type: "date" },
    { key: "estimatedEndDate", title: "Est. End Date", type: "date" },
    { 
      key: "status", 
      title: "Status", 
      type: "badge",
      getBadgeVariant: (value, row) => getStatusBadgeVariant(row),
      render: (value, row) => getProjectStatus(row)
    },
    { 
      key: "totalQuota", 
      title: "Total Personnel",
      render: (value, row) => `${row.rdQuota + row.supportQuota}`
    }
  ]

  const typeOptions = [...new Set(projects.map(p => p.type))]
    .map(type => ({ value: type, label: type }))

  const workplaceOptions = [...new Set(projects.map(p => p.workplace))]
    .map(workplace => ({ value: workplace, label: workplace }))

  if (loading) {
    return <Loading text="Loading projects..." />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">R&D Project Management</h1>
          <p className="text-gray-600">Track and manage your research and development projects</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects..."
          />
        </div>
        <div className="flex gap-2">
          <FilterDropdown
            title="Type"
            options={typeOptions}
            selectedValues={selectedTypes}
            onSelectionChange={setSelectedTypes}
          />
          <FilterDropdown
            title="Workplace"
            options={workplaceOptions}
            selectedValues={selectedWorkplaces}
            onSelectionChange={setSelectedWorkplaces}
          />
        </div>
      </div>

      {/* Data Table */}
      {filteredProjects.length === 0 && !loading ? (
        <Empty
          title="No projects found"
          description="Start by creating your first R&D project"
          actionLabel="Create Project"
          onAction={() => setIsModalOpen(true)}
          icon="Lightbulb"
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredProjects}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          loading={loading}
          emptyMessage="No projects match your current filters"
        />
      )}

      {/* Project Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProject(null)
        }}
        title={editingProject ? "Edit Project" : "Create New Project"}
        size="lg"
      >
        <ProjectForm
          contracts={contracts}
          customers={customers}
          initialData={editingProject}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingProject(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default Projects