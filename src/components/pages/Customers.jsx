import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import DataTable from "@/components/organisms/DataTable"
import Modal from "@/components/organisms/Modal"
import CustomerForm from "@/components/organisms/CustomerForm"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { customerService } from "@/services/api/customerService"

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await customerService.getAll()
      setCustomers(data)
    } catch (err) {
      setError("Failed to load customers. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = customers

    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.parentCompany && customer.parentCompany.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredCustomers(filtered)
  }, [customers, searchTerm])

  const handleCreateCustomer = async (customerData) => {
    try {
      const newCustomer = await customerService.create(customerData)
      setCustomers([...customers, newCustomer])
      setIsModalOpen(false)
      toast.success("Customer created successfully!")
    } catch (err) {
      toast.error("Failed to create customer. Please try again.")
    }
  }

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer)
    setIsModalOpen(true)
  }

  const handleUpdateCustomer = async (customerData) => {
    try {
      const updatedCustomer = await customerService.update(editingCustomer.Id, customerData)
      setCustomers(customers.map(c => c.Id === editingCustomer.Id ? updatedCustomer : c))
      setIsModalOpen(false)
      setEditingCustomer(null)
      toast.success("Customer updated successfully!")
    } catch (err) {
      toast.error("Failed to update customer. Please try again.")
    }
  }

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await customerService.delete(customerId)
        setCustomers(customers.filter(c => c.Id !== customerId))
        toast.success("Customer deleted successfully!")
      } catch (err) {
        toast.error("Failed to delete customer. Please try again.")
      }
    }
  }

  const columns = [
    { key: "Id", title: "ID" },
    { key: "name", title: "Customer Name" },
    { 
      key: "parentCompany", 
      title: "Parent Company",
      render: (value) => value || "Independent"
    }
  ]

  // Group customers by parent company for better visualization
  const groupedCustomers = React.useMemo(() => {
    const grouped = {}
    filteredCustomers.forEach(customer => {
      const parent = customer.parentCompany || "Independent"
      if (!grouped[parent]) {
        grouped[parent] = []
      }
      grouped[parent].push(customer)
    })
    return grouped
  }, [filteredCustomers])

  if (loading) {
    return <Loading text="Loading customers..." />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage your customer database and relationships</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          New Customer
        </Button>
      </div>

      {/* Search Section */}
      <div className="max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customers..."
        />
      </div>

      {/* Customer Groups */}
      {filteredCustomers.length === 0 && !loading ? (
        <Empty
          title="No customers found"
          description="Start by adding your first customer to the system"
          actionLabel="Add Customer"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedCustomers).map(([parentCompany, groupCustomers]) => (
            <div key={parentCompany} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building2" className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{parentCompany}</h2>
                  <p className="text-sm text-gray-600">{groupCustomers.length} customer{groupCustomers.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              
              <DataTable
                columns={columns}
                data={groupCustomers}
                onEdit={handleEditCustomer}
                onDelete={handleDeleteCustomer}
                emptyMessage="No customers in this group"
              />
            </div>
          ))}
        </div>
      )}

      {/* Customer Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCustomer(null)
        }}
        title={editingCustomer ? "Edit Customer" : "Create New Customer"}
        size="md"
      >
        <CustomerForm
          initialData={editingCustomer}
          onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingCustomer(null)
          }}
        />
      </Modal>
    </div>
  )
}

export default Customers