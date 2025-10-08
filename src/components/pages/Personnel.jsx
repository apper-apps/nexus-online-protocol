import React, { useEffect, useState } from "react";
import { filterService } from "@/services/api/filterService";
import { toast } from "react-toastify";
import { personnelService } from "@/services/api/personnelService";
import { contractService } from "@/services/api/contractService";
import { projectService } from "@/services/api/projectService";
import ApperIcon from "@/components/ApperIcon";
import MonthYearSelector from "@/components/molecules/MonthYearSelector";
import SearchBar from "@/components/molecules/SearchBar";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import PersonnelForm from "@/components/organisms/PersonnelForm";
import Modal from "@/components/organisms/Modal";
import DataTable from "@/components/organisms/DataTable";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";

const Personnel = () => {
  const currentDate = new Date()
const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1)
  
  const [personnel, setPersonnel] = useState([])
  const [contracts, setContracts] = useState([])
  const [projects, setProjects] = useState([])
  const [filteredPersonnel, setFilteredPersonnel] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedWorkplaces, setSelectedWorkplaces] = useState([])
  
  const [savedFilters, setSavedFilters] = useState([])
  const [currentFilterId, setCurrentFilterId] = useState(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [filterName, setFilterName] = useState("")
  const [loadingFilters, setLoadingFilters] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPersonnel, setEditingPersonnel] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [personnelData, contractsData, projectsData] = await Promise.all([
        personnelService.getByMonthYear(selectedYear, selectedMonth),
        contractService.getAll(),
        projectService.getAll()
      ])
      setPersonnel(personnelData)
      setContracts(contractsData)
      setProjects(projectsData)
    } catch (err) {
      setError("Failed to load personnel data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
    loadData()
    loadSavedFilters()
  }, [selectedYear, selectedMonth])

  const loadSavedFilters = async () => {
    const filters = await filterService.getAll()
    setSavedFilters(filters)
  }

  const handleSaveFilter = () => {
    setShowSaveModal(true)
    setFilterName("")
  }

  const handleSaveFilterSubmit = async () => {
    if (!filterName.trim()) {
      toast.error("Please enter a filter name")
      return
    }

    setLoadingFilters(true)
    const filterData = {
      searchTerm,
      selectedTypes,
      selectedWorkplaces,
      selectedYear,
      selectedMonth
    }

    const result = await filterService.create({
      name_c: filterName.trim(),
      filter_data_c: JSON.stringify(filterData)
    })

    setLoadingFilters(false)

    if (result) {
      toast.success("Filter saved successfully")
      setShowSaveModal(false)
      setFilterName("")
      setCurrentFilterId(result.Id)
      await loadSavedFilters()
    }
  }

  const handleLoadFilter = async (filterId) => {
    setLoadingFilters(true)
    const filter = await filterService.getById(filterId)
    setLoadingFilters(false)

    if (filter && filter.filter_data_c) {
      try {
        const filterData = JSON.parse(filter.filter_data_c)
        setSearchTerm(filterData.searchTerm || "")
        setSelectedTypes(filterData.selectedTypes || [])
        setSelectedWorkplaces(filterData.selectedWorkplaces || [])
        setSelectedYear(filterData.selectedYear || currentDate.getFullYear())
        setSelectedMonth(filterData.selectedMonth || currentDate.getMonth() + 1)
        setCurrentFilterId(filterId)
        toast.success(`Filter "${filter.name_c}" applied`)
      } catch (error) {
        toast.error("Failed to parse filter data")
      }
    }
  }

  const handleDeleteFilter = async (filterId, filterName) => {
    if (!confirm(`Delete filter "${filterName}"?`)) return

    setLoadingFilters(true)
    const success = await filterService.delete(filterId)
    setLoadingFilters(false)

    if (success) {
      toast.success("Filter deleted successfully")
      if (currentFilterId === filterId) {
        setCurrentFilterId(null)
      }
      await loadSavedFilters()
    }
  }

  const handleClearFilter = () => {
    setSearchTerm("")
    setSelectedTypes([])
    setSelectedWorkplaces([])
    setCurrentFilterId(null)
    toast.info("Filters cleared")
  }

useEffect(() => {
    let filtered = personnel

    if (searchTerm) {
      filtered = filtered.filter(person =>
        `${person.firstName} ${person.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.tckn.includes(searchTerm) ||
        person.workplace.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(person => selectedTypes.includes(person.type))
    }

    if (selectedWorkplaces.length > 0) {
      filtered = filtered.filter(person => selectedWorkplaces.includes(person.workplace))
    }

    setFilteredPersonnel(filtered)
  }, [personnel, searchTerm, selectedTypes, selectedWorkplaces])
  const handleCreatePersonnel = async (personnelData) => {
    try {
      const newPersonnel = await personnelService.create({
        ...personnelData,
        year: selectedYear,
        month: selectedMonth
      })
      setPersonnel([...personnel, newPersonnel])
      setIsModalOpen(false)
      toast.success("Personnel record created successfully!")
    } catch (err) {
      toast.error("Failed to create personnel record. Please try again.")
    }
  }

  const handleEditPersonnel = (person) => {
    setEditingPersonnel(person)
    setIsModalOpen(true)
  }

  const handleUpdatePersonnel = async (personnelData) => {
    try {
      const updatedPersonnel = await personnelService.update(editingPersonnel.Id, personnelData)
      setPersonnel(personnel.map(p => p.Id === editingPersonnel.Id ? updatedPersonnel : p))
      setIsModalOpen(false)
      setEditingPersonnel(null)
      toast.success("Personnel record updated successfully!")
    } catch (err) {
      toast.error("Failed to update personnel record. Please try again.")
    }
  }

  const handleDeletePersonnel = async (personnelId) => {
    if (window.confirm("Are you sure you want to delete this personnel record?")) {
      try {
        await personnelService.delete(personnelId)
        setPersonnel(personnel.filter(p => p.Id !== personnelId))
        toast.success("Personnel record deleted successfully!")
      } catch (err) {
        toast.error("Failed to delete personnel record. Please try again.")
      }
    }
  }

  const getStatusBadgeVariant = (person) => {
    if (person.endDate) return "danger"
    return "success"
  }

  const getPersonStatus = (person) => {
    return person.endDate ? "Inactive" : "Active"
  }

  const columns = [
    { key: "Id", title: "ID" },
    { key: "tckn", title: "TC ID" },
    { 
      key: "fullName", 
      title: "Full Name",
      render: (value, row) => `${row.firstName} ${row.lastName}`
    },
    { 
      key: "type", 
      title: "Personnel Type",
      type: "badge",
      getBadgeVariant: (value) => {
        switch(value) {
          case "Software Developer": return "primary"
          case "Research Personnel": return "secondary"
          case "Support Personnel": return "warning"
          default: return "default"
        }
      }
    },
    { key: "workplace", title: "Workplace" },
    { key: "profitCenter", title: "Profit Center" },
    { key: "startDate", title: "Start Date", type: "date" },
    { 
      key: "status", 
      title: "Status", 
      type: "badge",
      getBadgeVariant: getStatusBadgeVariant,
      render: getPersonStatus
    },
    { key: "timesheetDays", title: "Timesheet Days" }
  ]

  const typeOptions = [...new Set(personnel.map(p => p.type))]
    .map(type => ({ value: type, label: type }))

  const workplaceOptions = [...new Set(personnel.map(p => p.workplace))]
    .map(workplace => ({ value: workplace, label: workplace }))

  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })

  if (loading) {
    return <Loading text="Loading personnel data..." />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personnel Management</h1>
          <p className="text-gray-600">Monthly personnel tracking and management - {monthName} {selectedYear}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Personnel
        </Button>
      </div>

      {/* Month/Year Selector */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Period</h3>
        <MonthYearSelector
selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={setSelectedYear}
          onMonthChange={setSelectedMonth}
        />
        
        <div className="flex gap-2 items-center ml-auto">
          <Button
            variant="outline"
            onClick={handleSaveFilter}
            disabled={loadingFilters}
          >
            <ApperIcon name="Save" className="h-4 w-4 mr-2" />
            Save Filter
          </Button>
          
          {savedFilters.length > 0 && (
            <div className="relative group">
              <Button
                variant="outline"
                className="min-w-[140px] justify-between"
              >
                <span className="truncate">
                  {currentFilterId 
                    ? savedFilters.find(f => f.Id === currentFilterId)?.name_c || "Load Filter"
                    : "Load Filter"}
                </span>
                <ApperIcon name="ChevronDown" className="h-4 w-4 ml-2" />
              </Button>
              
              <div className="hidden group-hover:block absolute right-0 z-50 mt-2 w-64 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-xl">
                <div className="p-3 border-b border-gray-100">
                  <h4 className="font-medium text-gray-900">Saved Filters</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {savedFilters.map((filter) => (
                    <div
                      key={filter.Id}
                      className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      <button
                        onClick={() => handleLoadFilter(filter.Id)}
                        className="flex-1 text-left text-sm text-gray-700"
                      >
                        {filter.name_c}
                        {currentFilterId === filter.Id && (
                          <span className="ml-2 text-xs text-primary-600">(Active)</span>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteFilter(filter.Id, filter.name_c)
                        }}
                        className="ml-2 p-1 text-red-600 hover:text-red-700"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                {currentFilterId && (
                  <div className="p-3 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilter}
                      className="w-full text-gray-600 hover:text-gray-800"
                    >
                      Clear Active Filter
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

{/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search personnel..."
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
      {showSaveModal && (
        <Modal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          title="Save Filter"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Name
              </label>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Enter filter name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSaveModal(false)}
                disabled={loadingFilters}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveFilterSubmit}
                disabled={loadingFilters || !filterName.trim()}
              >
                {loadingFilters ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </Modal>
)}
      {/* Data Table */}
      {filteredPersonnel.length === 0 && !loading ? (
        <Empty
          title="No personnel records found"
          description={`No personnel data available for ${monthName} ${selectedYear}. Add personnel records for this period.`}
          actionLabel="Add Personnel"
          onAction={() => setIsModalOpen(true)}
          icon="UserCog"
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredPersonnel}
          onEdit={handleEditPersonnel}
          onDelete={handleDeletePersonnel}
          loading={loading}
          emptyMessage="No personnel records match your current filters"
        />
      )}

      {/* Personnel Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingPersonnel(null)
        }}
        title={editingPersonnel ? "Edit Personnel" : "Add New Personnel"}
        size="lg"
      >
        <PersonnelForm
          contracts={contracts}
          projects={projects}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          initialData={editingPersonnel}
          onSubmit={editingPersonnel ? handleUpdatePersonnel : handleCreatePersonnel}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingPersonnel(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default Personnel