import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import FilterDropdown from "@/components/molecules/FilterDropdown"
import DataTable from "@/components/organisms/DataTable"
import Modal from "@/components/organisms/Modal"
import ContractForm from "@/components/organisms/ContractForm"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { contractService } from "@/services/api/contractService"
import { customerService } from "@/services/api/customerService"

const Contracts = () => {
  const [contracts, setContracts] = useState([])
  const [customers, setCustomers] = useState([])
  const [filteredContracts, setFilteredContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingContract, setEditingContract] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [contractsData, customersData] = await Promise.all([
        contractService.getAll(),
        customerService.getAll()
      ])
      setContracts(contractsData)
      setCustomers(customersData)
    } catch (err) {
      setError("Failed to load contracts. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = contracts

    if (searchTerm) {
      filtered = filtered.filter(contract =>
        contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(contract => selectedCategories.includes(contract.category))
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(contract => selectedTypes.includes(contract.type))
    }

    setFilteredContracts(filtered)
  }, [contracts, searchTerm, selectedCategories, selectedTypes])

  const handleCreateContract = async (contractData) => {
    try {
      const newContract = await contractService.create(contractData)
      setContracts([...contracts, newContract])
      setIsModalOpen(false)
      toast.success("Contract created successfully!")
    } catch (err) {
      toast.error("Failed to create contract. Please try again.")
    }
  }

  const handleEditContract = (contract) => {
    setEditingContract(contract)
    setIsModalOpen(true)
  }

  const handleUpdateContract = async (contractData) => {
    try {
      const updatedContract = await contractService.update(editingContract.Id, contractData)
      setContracts(contracts.map(c => c.Id === editingContract.Id ? updatedContract : c))
      setIsModalOpen(false)
      setEditingContract(null)
      toast.success("Contract updated successfully!")
    } catch (err) {
      toast.error("Failed to update contract. Please try again.")
    }
  }

  const handleDeleteContract = async (contractId) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      try {
        await contractService.delete(contractId)
        setContracts(contracts.filter(c => c.Id !== contractId))
        toast.success("Contract deleted successfully!")
      } catch (err) {
        toast.error("Failed to delete contract. Please try again.")
      }
    }
  }

  const getRiskBadgeVariant = (riskScore) => {
    if (riskScore <= 3) return "low"
    if (riskScore <= 6) return "medium"
    if (riskScore <= 8) return "high"
    return "critical"
  }

  const columns = [
    { key: "Id", title: "ID" },
    { key: "title", title: "Title" },
    { key: "category", title: "Category" },
    { key: "type", title: "Type" },
    { key: "profitCenter", title: "Profit Center" },
    { key: "startDate", title: "Start Date", type: "date" },
    { key: "endDate", title: "End Date", type: "date" },
    { 
      key: "riskScore", 
      title: "Risk Score", 
      type: "badge",
      getBadgeVariant: getRiskBadgeVariant,
      render: (value) => `${value}/10`
    }
  ]

  const categoryOptions = [...new Set(contracts.map(c => c.category))]
    .map(category => ({ value: category, label: category }))

  const typeOptions = [...new Set(contracts.map(c => c.type))]
    .map(type => ({ value: type, label: type }))

  if (loading) {
    return <Loading text="Loading contracts..." />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Management</h1>
          <p className="text-gray-600">Manage and track all your business contracts</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Contract
        </Button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contracts..."
          />
        </div>
        <div className="flex gap-2">
          <FilterDropdown
            title="Category"
            options={categoryOptions}
            selectedValues={selectedCategories}
            onSelectionChange={setSelectedCategories}
          />
          <FilterDropdown
            title="Type"
            options={typeOptions}
            selectedValues={selectedTypes}
            onSelectionChange={setSelectedTypes}
          />
        </div>
      </div>

      {/* Data Table */}
      {filteredContracts.length === 0 && !loading ? (
        <Empty
          title="No contracts found"
          description="Start by creating your first contract or adjust your search filters"
          actionLabel="Create Contract"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredContracts}
          onEdit={handleEditContract}
          onDelete={handleDeleteContract}
          loading={loading}
          emptyMessage="No contracts match your current filters"
        />
      )}

      {/* Contract Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingContract(null)
        }}
        title={editingContract ? "Edit Contract" : "Create New Contract"}
        size="lg"
      >
        <ContractForm
          customers={customers}
          initialData={editingContract}
          onSubmit={editingContract ? handleUpdateContract : handleCreateContract}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingContract(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default Contracts