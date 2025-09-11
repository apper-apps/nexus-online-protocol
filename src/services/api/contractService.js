import contractsData from "@/services/mockData/contracts.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const contractService = {
  async getAll() {
    await delay(300)
    return [...contractsData]
  },

  async getById(id) {
    await delay(200)
    return contractsData.find(contract => contract.Id === parseInt(id))
  },

  async create(contractData) {
    await delay(400)
    const newContract = {
      ...contractData,
      Id: Math.max(...contractsData.map(c => c.Id)) + 1
    }
    contractsData.push(newContract)
    return newContract
  },

  async update(id, contractData) {
    await delay(350)
    const index = contractsData.findIndex(contract => contract.Id === parseInt(id))
    if (index !== -1) {
      contractsData[index] = { ...contractsData[index], ...contractData }
      return contractsData[index]
    }
    throw new Error("Contract not found")
  },

  async delete(id) {
    await delay(250)
    const index = contractsData.findIndex(contract => contract.Id === parseInt(id))
    if (index !== -1) {
      const deleted = contractsData.splice(index, 1)[0]
      return deleted
    }
    throw new Error("Contract not found")
  }
}