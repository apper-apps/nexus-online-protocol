import React, { useEffect, useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const CustomerForm = ({ initialData, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    name_c: "",
    parent_company_c: ""
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name_c: initialData.name_c || "",
        parent_company_c: initialData.parent_company_c || ""
      })
    }
  }, [initialData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name_c.trim()) {
      newErrors.name_c = "Customer name is required"
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

return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Customer Name"
          name="name_c"
          value={formData.name_c}
          onChange={handleInputChange}
          error={errors.name_c}
          placeholder="Enter customer name"
        />

        <Input
          label="Parent Company"
          name="parent_company_c"
          value={formData.parent_company_c}
          onChange={handleInputChange}
          placeholder="Enter parent company (optional)"
        />
      </div>

      <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Parent Company:</strong> Use this field if this customer is part of a larger organization. 
              This helps group related customers together for better organization and reporting.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? "Update Customer" : "Create Customer"}
        </Button>
      </div>
    </form>
  )
}

export default CustomerForm