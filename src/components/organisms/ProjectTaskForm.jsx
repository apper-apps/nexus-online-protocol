import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import DatePicker from "@/components/molecules/DatePicker";
import { cn } from "@/utils/cn";
import personnel from "@/services/mockData/personnel.json";
import projectTasks from "@/services/mockData/projectTasks.json";
import contracts from "@/services/mockData/contracts.json";
import projects from "@/services/mockData/projects.json";
import customers from "@/services/mockData/customers.json";

const ProjectTaskForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    estimatedBudget: 0.00,
    projectPriority: "",
    departmentsInvolved: [],
    progressRange: 0,
    startDate: "",
    numberOfTeamMembers: 1,
    isApproved: false,
    projectManagerEmail: "",
    deadline: "",
    projectTags: [],
    assignedTo: "",
    allocatedBudget: 0.00,
    allocatedBudgetCurrency: "USD",
    includeRiskAssessment: false,
    status: "",
    contactPhone: "",
    projectWebsite: "",
    stakeholderSatisfaction: 5
  })

  const [errors, setErrors] = useState({})
  const [customTag, setCustomTag] = useState("")

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        departmentsInvolved: initialData.departmentsInvolved || [],
        projectTags: initialData.projectTags || []
      })
    }
  }, [initialData])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) || 0 : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const currentValues = prev[name] || []
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      return {
        ...prev,
        [name]: newValues
      }
    })
  }

  const handleAddTag = (tag) => {
    if (tag && !formData.projectTags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        projectTags: [...prev.projectTags, tag]
      }))
    }
    setCustomTag("")
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      projectTags: prev.projectTags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.projectName.trim()) newErrors.projectName = "Project name is required"
    if (!formData.projectDescription.trim()) newErrors.projectDescription = "Project description is required"
    if (formData.estimatedBudget <= 0) newErrors.estimatedBudget = "Estimated budget must be greater than 0"
    if (!formData.projectPriority) newErrors.projectPriority = "Project priority is required"
    if (formData.departmentsInvolved.length === 0) newErrors.departmentsInvolved = "At least one department must be selected"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (formData.numberOfTeamMembers < 1) newErrors.numberOfTeamMembers = "Number of team members must be at least 1"
    if (!formData.projectManagerEmail.trim()) newErrors.projectManagerEmail = "Project manager email is required"
    if (!formData.deadline) newErrors.deadline = "Deadline is required"
    if (!formData.assignedTo) newErrors.assignedTo = "Assignment is required"
    if (!formData.status) newErrors.status = "Status is required"
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.projectManagerEmail && !emailRegex.test(formData.projectManagerEmail)) {
      newErrors.projectManagerEmail = "Please enter a valid email address"
    }

    // Phone validation
if (formData.contactPhone && !/^\+?[\d\s\-()]+$/.test(formData.contactPhone)) {
      newErrors.contactPhone = "Please enter a valid phone number"
    }

    // Website validation
    if (formData.projectWebsite && !/^https?:\/\/.+\..+/.test(formData.projectWebsite)) {
      newErrors.projectWebsite = "Please enter a valid website URL"
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

  const departmentOptions = ["HR", "IT", "Finance", "Academics"]
  const priorityOptions = ["High", "Medium", "Low"]
  const statusOptions = ["Not Started", "In Progress", "Completed"]
  const currencyOptions = ["USD", "EUR", "INR"]
  const predefinedTags = ["Internal", "External", "Strategic", "Urgent"]
  const assigneeOptions = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown"]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Name */}
        <div className="lg:col-span-2">
          <Input
            label="Project Name"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            error={errors.projectName}
            placeholder="Enter project title"
          />
        </div>

        {/* Project Description */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Description
          </label>
          <textarea
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleInputChange}
            rows={4}
            className={cn(
              "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none",
              errors.projectDescription && "border-red-500 focus:ring-red-500"
            )}
            placeholder="Enter detailed project description"
          />
          {errors.projectDescription && <p className="mt-1 text-sm text-red-600">{errors.projectDescription}</p>}
        </div>

        {/* Estimated Budget */}
        <Input
          label="Estimated Budget"
          name="estimatedBudget"
          type="number"
          step="0.01"
          min="0"
          value={formData.estimatedBudget}
          onChange={handleInputChange}
          error={errors.estimatedBudget}
          placeholder="0.00"
        />

        {/* Project Priority */}
        <Select
          label="Project Priority"
          name="projectPriority"
          value={formData.projectPriority}
          onChange={handleInputChange}
          error={errors.projectPriority}
        >
          <option value="">Select Priority</option>
          {priorityOptions.map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </Select>

        {/* Departments Involved */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departments Involved
          </label>
          <div className="grid grid-cols-2 gap-2">
            {departmentOptions.map(dept => (
              <label key={dept} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.departmentsInvolved.includes(dept)}
                  onChange={() => handleMultiSelect("departmentsInvolved", dept)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{dept}</span>
              </label>
            ))}
          </div>
          {errors.departmentsInvolved && <p className="mt-1 text-sm text-red-600">{errors.departmentsInvolved}</p>}
        </div>

        {/* Progress Range */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Progress Range: {formData.progressRange}%
          </label>
          <input
            type="range"
            name="progressRange"
            min="0"
            max="100"
            value={formData.progressRange}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Start Date */}
        <DatePicker
          label="Start Date"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          error={errors.startDate}
        />

        {/* Number of Team Members */}
        <Input
          label="Number of Team Members"
          name="numberOfTeamMembers"
          type="number"
          min="1"
          value={formData.numberOfTeamMembers}
          onChange={handleInputChange}
          error={errors.numberOfTeamMembers}
          placeholder="Enter total count"
        />

        {/* Is Approved */}
        <div className="flex items-center space-x-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isApproved"
              checked={formData.isApproved}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Is Approved</span>
          </label>
        </div>

        {/* Project Manager Email */}
        <Input
          label="Project Manager Email"
          name="projectManagerEmail"
          type="email"
          value={formData.projectManagerEmail}
          onChange={handleInputChange}
          error={errors.projectManagerEmail}
          placeholder="example@domain.com"
        />

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deadline
          </label>
          <input
            type="datetime-local"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            className={cn(
              "w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
              errors.deadline && "border-red-500 focus:ring-red-500"
            )}
          />
          {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
        </div>

        {/* Project Tags */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Tags
          </label>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs border transition-all duration-200",
                    formData.projectTags.includes(tag)
                      ? "bg-primary-100 border-primary-300 text-primary-700"
                      : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add custom tag"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddTag(customTag)}
                disabled={!customTag.trim()}
              >
                Add
              </Button>
            </div>
            {formData.projectTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.projectTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <ApperIcon name="X" className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Assigned To */}
        <Select
          label="Assigned To"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleInputChange}
          error={errors.assignedTo}
        >
          <option value="">Select from user list</option>
          {assigneeOptions.map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </Select>

        {/* Allocated Budget with Currency */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label="Allocated Budget"
              name="allocatedBudget"
              type="number"
              step="0.01"
              min="0"
              value={formData.allocatedBudget}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-20">
            <Select
              label="Currency"
              name="allocatedBudgetCurrency"
              value={formData.allocatedBudgetCurrency}
              onChange={handleInputChange}
            >
              {currencyOptions.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </Select>
          </div>
        </div>

        {/* Include Risk Assessment */}
        <div className="flex items-center space-x-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="includeRiskAssessment"
              checked={formData.includeRiskAssessment}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Include Risk Assessment</span>
          </label>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="space-y-2">
            {statusOptions.map(status => (
              <label key={status} className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  onChange={handleInputChange}
                  className="border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
          {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
        </div>

        {/* Contact Phone */}
        <Input
          label="Contact Phone"
          name="contactPhone"
          type="tel"
          value={formData.contactPhone}
          onChange={handleInputChange}
          error={errors.contactPhone}
          placeholder="+1-202-555-0147"
        />

        {/* Project Website */}
        <Input
          label="Project Website"
          name="projectWebsite"
          type="url"
          value={formData.projectWebsite}
          onChange={handleInputChange}
          error={errors.projectWebsite}
          placeholder="https://example.com"
        />

        {/* Stakeholder Satisfaction Rating */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stakeholder Satisfaction: {formData.stakeholderSatisfaction}/5
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, stakeholderSatisfaction: rating }))}
                className={cn(
                  "p-1 rounded transition-colors duration-200",
                  rating <= formData.stakeholderSatisfaction
                    ? "text-yellow-400 hover:text-yellow-500"
                    : "text-gray-300 hover:text-yellow-200"
                )}
              >
                <ApperIcon name="Star" className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
        </div>
      </div>
<div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? "Update Project Task" : "Create Project Task"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProjectTaskForm