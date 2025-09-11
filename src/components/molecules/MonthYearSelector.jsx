import React from "react"
import Select from "@/components/atoms/Select"

const MonthYearSelector = ({ selectedYear, selectedMonth, onYearChange, onMonthChange }) => {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)
  
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" }
  ]

  return (
    <div className="flex gap-4">
      <Select
        label="Year"
        value={selectedYear}
        onChange={(e) => onYearChange(parseInt(e.target.value))}
      >
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </Select>
      
      <Select
        label="Month"
        value={selectedMonth}
        onChange={(e) => onMonthChange(parseInt(e.target.value))}
      >
        {months.map(month => (
          <option key={month.value} value={month.value}>{month.label}</option>
        ))}
      </Select>
    </div>
  )
}

export default MonthYearSelector