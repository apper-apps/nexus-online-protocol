import React from "react"
import Input from "@/components/atoms/Input"

const DatePicker = ({ label, value, onChange, error, ...props }) => {
  return (
    <Input
      type="date"
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      {...props}
    />
  )
}

export default DatePicker