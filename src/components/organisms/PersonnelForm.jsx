import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import DatePicker from "@/components/molecules/DatePicker"

const PersonnelForm = ({ contracts, projects, selectedYear, selectedMonth, initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    tckn: "",
    firstName: "",
    lastName: "",
    profitCenter: "",
    workplace: "",
    startDate: "",
    endDate: "",
    type: "",
    contractId: "",
    projectId: "",
    annualLeave: 0,
    unpaidLeave: 0,
    sickDays: 0,
    timesheetDays: 22
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

    // Auto-populate project details when project is selected
    if (name === "projectId" && value) {
      const selectedProject = projects.find(p => p.Id === parseInt(value))
      if (selectedProject) {
        setFormData(prev => ({
          ...prev,
          contractId: selectedProject.contractId,
          profitCenter: selectedProject.profitCenter,
          workplace: selectedProject.workplace
        }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.tckn.trim()) newErrors.tckn = "TC ID is required"
    if (formData.tckn.length !== 11) newErrors.tckn = "TC ID must be 11 digits"
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.type) newErrors.type = "Personnel type is required"
    if (!formData.workplace.trim()) newErrors.workplace = "Workplace is required"
    if (!formData.profitCenter.trim()) newErrors.profitCenter = "Profit center is required"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.projectId) newErrors.projectId = "Project is required"

    if (formData.timesheetDays < 0 || formData.timesheetDays > 31) {
      newErrors.timesheetDays = "Timesheet days must be between 0 and 31"
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

  const personnelTypes = [
    "Software Developer",
    "Research Personnel", 
    "Support Personnel"
  ]

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

  const getMonthName = (month) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    return months[month - 1]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-primary-50/80 border border-primary-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-primary-900 mb-2">
          Personnel Record for {getMonthName(selectedMonth)} {selectedYear}
        </h4>
        <p className="text-sm text-primary-700">
          This record will be created for the selected month and year. Monthly records allow for historical tracking and changes over time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="TC Identity Number"
          name="tckn"
          value={formData.tckn}
          onChange={handleInputChange}
          error={errors.tckn}
          placeholder="11-digit TC ID"
          maxLength={11}
        />

        <Select
          label="Personnel Type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          error={errors.type}
        >
          <option value="">Select Type</option>
          {personnelTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>

        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          error={errors.firstName}
          placeholder="Enter first name"
        />

        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          error={errors.lastName}
          placeholder="Enter last name"
        />

        <Select
          label="Assigned Project"
          name="projectId"
          value={formData.projectId}
          onChange={handleInputChange}
          error={errors.projectId}
        >
          <option value="">Select Project</option>
          {projects.map(project => (
            <option key={project.Id} value={project.Id}>
              {project.name} ({project.code})
            </option>
          ))}
        </Select>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Related Contract (Auto-populated)
          </label>
          <div className="h-10 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 flex items-center">
            {formData.contractId ? 
              `Contract ID: ${formData.contractId}` : 
              "Select project first"
            }
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workplace (Auto-populated)
          </label>
          <div className="h-10 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 flex items-center">
            {formData.workplace || "Select project first"}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profit Center (Auto-populated)
          </label>
          <div className="h-10 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 flex items-center">
            {formData.profitCenter || "Select project first"}
          </div>
        </div>

        <DatePicker
          label="Employment Start Date"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          error={errors.startDate}
        />

        <DatePicker
          label="Employment End Date"
          name="endDate"
          value={formData.endDate}
          onChange={handleInputChange}
        />
      </div>

      {/* Monthly Stats */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Statistics for {getMonthName(selectedMonth)} {selectedYear}
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Leave Days
            </label>
            <input
              type="number"
              name="annualLeave"
              min="0"
              max="31"
              value={formData.annualLeave}
              onChange={handleInputChange}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unpaid Leave Days
            </label>
            <input
              type="number"
              name="unpaidLeave"
              min="0"
              max="31"
              value={formData.unpaidLeave}
              onChange={handleInputChange}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sick Days
            </label>
            <input
              type="number"
              name="sickDays"
              min="0"
              max="31"
              value={formData.sickDays}
              onChange={handleInputChange}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timesheet Days
            </label>
            <input
              type="number"
              name="timesheetDays"
              min="0"
              max="31"
              value={formData.timesheetDays}
              onChange={handleInputChange}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.timesheetDays && <p className="mt-1 text-sm text-red-600">{errors.timesheetDays}</p>}
          </div>
        </div>
      </div>

      <div className="bg-green-50/80 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              <strong>Note:</strong> When you select a project, the workplace, profit center, and related contract will be automatically populated. 
              This ensures data consistency across all modules.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? "Update Personnel" : "Add Personnel"}
        </Button>
      </div>
    </form>
  )
}

export default PersonnelForm