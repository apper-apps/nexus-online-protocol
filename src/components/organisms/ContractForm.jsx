import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import DatePicker from "@/components/molecules/DatePicker"

const ContractForm = ({ customers, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    type: "",
    customerId: "",
    profitCenter: "",
    signatureDate: "",
    startDate: "",
    endDate: "",
    responsibleParties: [],
    penalties: "",
    importantClauses: "",
    riskScore: 1
  })

  const [responsibleParty, setResponsibleParty] = useState("")
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        responsibleParties: Array.isArray(initialData.responsibleParties) 
          ? initialData.responsibleParties 
          : []
      })
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
  }

  const handleAddResponsibleParty = () => {
    if (responsibleParty.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibleParties: [...prev.responsibleParties, responsibleParty.trim()]
      }))
      setResponsibleParty("")
    }
  }

  const handleRemoveResponsibleParty = (index) => {
    setFormData(prev => ({
      ...prev,
      responsibleParties: prev.responsibleParties.filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.category.trim()) newErrors.category = "Category is required"
    if (!formData.type.trim()) newErrors.type = "Type is required"
    if (!formData.customerId) newErrors.customerId = "Customer is required"
    if (!formData.profitCenter.trim()) newErrors.profitCenter = "Profit Center is required"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.endDate) newErrors.endDate = "End date is required"

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = "End date must be after start date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const categories = [
    "Technology Services",
    "Development",
    "Consulting",
    "Security",
    "Infrastructure",
    "Support"
  ]

  const types = [
    "Service Contract",
    "Partnership Agreement",
    "Consulting Contract",
    "Fixed-Price Contract",
    "Service Agreement",
    "Maintenance Contract"
  ]

  const profitCenters = [
    "Technology Division",
    "R&D Division",
    "Analytics Division",
    "Mobile Division",
    "Security Division",
    "Blockchain Division",
    "IoT Division",
    "Advanced Research"
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Contract Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            error={errors.title}
            placeholder="Enter contract title"
          />
        </div>

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          error={errors.category}
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Select>

        <Select
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          error={errors.type}
        >
          <option value="">Select Type</option>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>

        <Select
          label="Customer"
          name="customerId"
          value={formData.customerId}
          onChange={handleInputChange}
          error={errors.customerId}
        >
          <option value="">Select Customer</option>
          {customers.map(customer => (
            <option key={customer.Id} value={customer.Id}>{customer.name}</option>
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
          label="Signature Date"
          name="signatureDate"
          value={formData.signatureDate}
          onChange={handleInputChange}
          error={errors.signatureDate}
        />

        <DatePicker
          label="Start Date"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          error={errors.startDate}
        />

        <DatePicker
          label="End Date"
          name="endDate"
          value={formData.endDate}
          onChange={handleInputChange}
          error={errors.endDate}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Score (1-10)
          </label>
          <input
            type="range"
            name="riskScore"
            min="1"
            max="10"
            value={formData.riskScore}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low (1)</span>
            <span className="font-semibold text-primary-600">{formData.riskScore}</span>
            <span>Critical (10)</span>
          </div>
        </div>
      </div>

      {/* Responsible Parties */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Responsible Parties
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add responsible party"
            value={responsibleParty}
            onChange={(e) => setResponsibleParty(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddResponsibleParty}
            variant="outline"
            size="md"
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.responsibleParties.map((party, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
            >
              {party}
              <button
                type="button"
                onClick={() => handleRemoveResponsibleParty(index)}
                className="ml-2 text-primary-600 hover:text-primary-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Penalties
          </label>
          <textarea
            name="penalties"
            value={formData.penalties}
            onChange={handleInputChange}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe penalty clauses..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Important Clauses
          </label>
          <textarea
            name="importantClauses"
            value={formData.importantClauses}
            onChange={handleInputChange}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe important contract clauses..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? "Update Contract" : "Create Contract"}
        </Button>
      </div>
    </form>
  )
}

export default ContractForm