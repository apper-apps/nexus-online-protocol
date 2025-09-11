import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import DatePicker from "@/components/molecules/DatePicker"

const ProjectForm = ({ contracts, customers, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "",
    workplace: "",
    profitCenter: "",
    startDate: "",
    estimatedEndDate: "",
    actualEndDate: "",
    rdQuota: 1,
    supportQuota: 1,
    contractId: "",
    customerId: ""
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }

    // Auto-populate customer when contract is selected
    if (name === "contractId" && value) {
      const selectedContract = contracts.find(c => c.Id === parseInt(value))
      if (selectedContract) {
        setFormData(prev => ({
          ...prev,
          customerId: selectedContract.customerId
        }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Project name is required"
    if (!formData.code.trim()) newErrors.code = "Project code is required"
    if (!formData.type) newErrors.type = "Project type is required"
    if (!formData.workplace.trim()) newErrors.workplace = "Workplace is required"
    if (!formData.profitCenter.trim()) newErrors.profitCenter = "Profit center is required"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.estimatedEndDate) newErrors.estimatedEndDate = "Estimated end date is required"
    if (!formData.contractId) newErrors.contractId = "Contract is required"

    if (formData.startDate && formData.estimatedEndDate && formData.startDate >= formData.estimatedEndDate) {
      newErrors.estimatedEndDate = "Estimated end date must be after start date"
    }

    if (formData.rdQuota < 1) newErrors.rdQuota = "R&D quota must be at least 1"
    if (formData.supportQuota < 1) newErrors.supportQuota = "Support quota must be at least 1"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const projectTypes = ["Product", "Order"]

  const workplaces = [
    "Istanbul Teknokent",
    "Ankara Teknokent", 
    "Izmir Teknokent"
  ]

  const profitCenters = [
    "R&D Division",
    "Technology Division",
    "Blockchain Division",
    "IoT Division",
    "Security Division",
    "Analytics Division",
    "Mobile Division",
    "Advanced Research"
  ]

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.Id === parseInt(customerId))
    return customer ? customer.name : ""
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            placeholder="Enter project name"
          />
        </div>

        <Input
          label="Project Code"
          name="code"
          value={formData.code}
          onChange={handleInputChange}
          error={errors.code}
          placeholder="e.g., PROJ-2024-001"
        />

        <Select
          label="Project Type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          error={errors.type}
        >
          <option value="">Select Type</option>
          {projectTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>

        <Select
          label="Workplace"
          name="workplace"
          value={formData.workplace}
          onChange={handleInputChange}
          error={errors.workplace}
        >
          <option value="">Select Workplace</option>
          {workplaces.map(workplace => (
            <option key={workplace} value={workplace}>{workplace}</option>
          ))}
        </Select>

        <Select
          label="Profit Center"
          name="profitCenter"
          value={formData.profitCenter}
          onChange={handleInputChange}
          error={errors.profitCenter}
        >
          <option value="">Select Profit Center</option>
          {profitCenters.map(center => (
            <option key={center} value={center}>{center}</option>
          ))}
        </Select>

        <DatePicker
          label="Start Date"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          error={errors.startDate}
        />

        <DatePicker
          label="Estimated End Date"
          name="estimatedEndDate"
          value={formData.estimatedEndDate}
          onChange={handleInputChange}
          error={errors.estimatedEndDate}
        />

        <DatePicker
          label="Actual End Date"
          name="actualEndDate"
          value={formData.actualEndDate}
          onChange={handleInputChange}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            R&D Personnel Quota
          </label>
          <input
            type="number"
            name="rdQuota"
            min="1"
            max="50"
            value={formData.rdQuota}
            onChange={handleInputChange}
            className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.rdQuota && <p className="mt-1 text-sm text-red-600">{errors.rdQuota}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Support Personnel Quota
          </label>
          <input
            type="number"
            name="supportQuota"
            min="1"
            max="20"
            value={formData.supportQuota}
            onChange={handleInputChange}
            className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.supportQuota && <p className="mt-1 text-sm text-red-600">{errors.supportQuota}</p>}
        </div>

        <Select
          label="Related Contract"
          name="contractId"
          value={formData.contractId}
          onChange={handleInputChange}
          error={errors.contractId}
        >
          <option value="">Select Contract</option>
          {contracts.map(contract => (
            <option key={contract.Id} value={contract.Id}>
              {contract.title} (ID: {contract.Id})
            </option>
          ))}
        </Select>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer (Auto-populated)
          </label>
          <div className="h-10 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 flex items-center">
            {formData.customerId ? getCustomerName(formData.customerId) : "Select contract first"}
          </div>
        </div>
      </div>

      <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <strong>Note:</strong> When you select a contract, the customer will be automatically populated based on the contract relationship. 
              Personnel quotas represent the maximum number of staff that can be assigned to this project.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  )
}

export default ProjectForm