import customersData from "@/services/mockData/customers.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const customerService = {
  async getAll() {
    await delay(250)
    return [...customersData]
  },

  async getById(id) {
    await delay(200)
    return customersData.find(customer => customer.Id === parseInt(id))
  },

  async create(customerData) {
    await delay(300)
    const newCustomer = {
      ...customerData,
      Id: Math.max(...customersData.map(c => c.Id)) + 1
    }
    customersData.push(newCustomer)
    return newCustomer
  },

  async update(id, customerData) {
    await delay(300)
    const index = customersData.findIndex(customer => customer.Id === parseInt(id))
    if (index !== -1) {
      customersData[index] = { ...customersData[index], ...customerData }
      return customersData[index]
    }
    throw new Error("Customer not found")
  },

  async delete(id) {
    await delay(200)
    const index = customersData.findIndex(customer => customer.Id === parseInt(id))
    if (index !== -1) {
      const deleted = customersData.splice(index, 1)[0]
      return deleted
    }
    throw new Error("Customer not found")
  }
}