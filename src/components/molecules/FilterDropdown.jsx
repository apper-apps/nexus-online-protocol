import React, { useState, useRef, useEffect } from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const FilterDropdown = ({ title, options, selectedValues, onSelectionChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleOptionToggle = (value) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter(v => v !== value))
    } else {
      onSelectionChange([...selectedValues, value])
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="justify-between min-w-[140px]"
      >
        <span className="truncate">
          {selectedValues.length > 0 ? `${title} (${selectedValues.length})` : title}
        </span>
        <ApperIcon 
          name="ChevronDown" 
          className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} 
        />
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-xl">
          <div className="p-3 border-b border-gray-100">
            <h4 className="font-medium text-gray-900">{title}</h4>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleOptionToggle(option.value)}
                  className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {selectedValues.length > 0 && (
            <div className="p-3 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectionChange([])}
                className="w-full text-gray-600 hover:text-gray-800"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FilterDropdown