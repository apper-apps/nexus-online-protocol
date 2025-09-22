const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const customerService = {
  async getAll() {
    await delay(250)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "name_c" } },
          { field: { Name: "parent_company_c" } }
        ]
      }

      const response = await apperClient.fetchRecords('customer_c', params)
      
      if (!response.success) {
        console.error("Error fetching customers:", response.message)
        throw new Error(response.message)
      }

      return response.data || []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching customers:", error.response.data.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error fetching customers:", error)
        throw error
      }
    }
  },

  async getById(id) {
    await delay(200)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "name_c" } },
          { field: { Name: "parent_company_c" } }
        ]
      }

      const response = await apperClient.getRecordById('customer_c', parseInt(id), params)
      
      if (!response.success) {
        console.error(`Error fetching customer ${id}:`, response.message)
        throw new Error(response.message)
      }

      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching customer ${id}:`, error.response.data.message)
        throw new Error(error.response.data.message)
      } else {
        console.error(`Error fetching customer ${id}:`, error)
        throw error
      }
    }
  },

  async create(customerData) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const params = {
        records: [{
          Name: customerData.name_c || customerData.Name,
          Tags: customerData.Tags || "",
          name_c: customerData.name_c || customerData.Name,
          parent_company_c: customerData.parent_company_c || ""
        }]
      }

      const response = await apperClient.createRecord('customer_c', params)
      
      if (!response.success) {
        console.error("Error creating customer:", response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to create customer records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }

      throw new Error("No records created")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating customer:", error.response.data.message)
        throw new Error(error.response.data.message)
      } else {
        console.error("Error creating customer:", error)
        throw error
      }
    }
  },

  async update(id, customerData) {
    await delay(300)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: customerData.name_c || customerData.Name,
          Tags: customerData.Tags || "",
          name_c: customerData.name_c || customerData.Name,
          parent_company_c: customerData.parent_company_c || ""
        }]
      }

      const response = await apperClient.updateRecord('customer_c', params)
      
      if (!response.success) {
        console.error(`Error updating customer ${id}:`, response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to update customer records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        const successfulRecords = response.results.filter(result => result.success)
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data
        }
      }

      throw new Error("No records updated")
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error updating customer ${id}:`, error.response.data.message)
        throw new Error(error.response.data.message)
      } else {
        console.error(`Error updating customer ${id}:`, error)
        throw error
      }
    }
  },

  async delete(id) {
    await delay(200)
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('customer_c', params)
      
      if (!response.success) {
        console.error(`Error deleting customer ${id}:`, response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        if (failedRecords.length > 0) {
          console.error(`Failed to delete customer records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return response.results.filter(result => result.success).length > 0
      }

      return true
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error deleting customer ${id}:`, error.response.data.message)
        throw new Error(error.response.data.message)
      } else {
        console.error(`Error deleting customer ${id}:`, error)
        throw error
      }
    }
  }
}