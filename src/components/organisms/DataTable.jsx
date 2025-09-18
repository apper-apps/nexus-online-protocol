import React, { useState } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  loading = false,
  emptyMessage = "No data available",
  sortable = true 
}) => {
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")

  const handleSort = (field) => {
    if (!sortable) return
    
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortField) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (aValue === bValue) return 0

      const result = aValue < bValue ? -1 : 1
      return sortDirection === "asc" ? result : -result
    })
  }, [data, sortField, sortDirection])

  const renderCellValue = (value, column) => {
    if (column.type === "badge") {
      const variant = column.getBadgeVariant ? column.getBadgeVariant(value) : "default"
      return <Badge variant={variant}>{value}</Badge>
    }
    
    if (column.type === "date" && value) {
      return new Date(value).toLocaleDateString()
    }
    
if (column.render) {
      return column.render(row)
    }
    
    return value || "-"
  }

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto table-scrollbar">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </th>
                ))}
                <th className="px-6 py-4 w-32">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-12 text-center">
        <ApperIcon name="Database" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 overflow-hidden shadow-lg"
    >
      <div className="overflow-x-auto table-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80">
            <tr>
{columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    sortable && column.sortable !== false && "cursor-pointer hover:bg-gray-100/60 transition-colors duration-150"
                  )}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    <span>{column.title}</span>
                    {sortable && column.sortable !== false && (
                      <div className="ml-2 flex flex-col">
                        <ApperIcon
                          name="ChevronUp"
                          className={cn(
                            "h-3 w-3 transition-colors duration-150",
                            sortField === column.key && sortDirection === "asc"
                              ? "text-primary-600"
                              : "text-gray-300"
                          )}
                        />
                        <ApperIcon
                          name="ChevronDown"
                          className={cn(
                            "h-3 w-3 -mt-1 transition-colors duration-150",
                            sortField === column.key && sortDirection === "desc"
                              ? "text-primary-600"
                              : "text-gray-300"
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/50 divide-y divide-gray-200">
            {sortedData.map((row, rowIndex) => (
              <motion.tr
                key={row.Id || rowIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                className="hover:bg-gray-50/60 transition-colors duration-150"
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderCellValue(row[column.key], column)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(row)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <ApperIcon name="Edit2" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(row.Id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <ApperIcon name="Trash2" className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default DataTable