import personnelData from "@/services/mockData/personnel.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const personnelService = {
  async getAll() {
    await delay(300)
    return [...personnelData]
  },

  async getByMonthYear(year, month) {
    await delay(300)
    return personnelData.filter(person => person.year === year && person.month === month)
  },

  async getById(id) {
    await delay(200)
    return personnelData.find(person => person.Id === parseInt(id))
  },

  async create(personData) {
    await delay(400)
    const newPerson = {
      ...personData,
      Id: Math.max(...personnelData.map(p => p.Id)) + 1
    }
    personnelData.push(newPerson)
    return newPerson
  },

  async update(id, personData) {
    await delay(350)
    const index = personnelData.findIndex(person => person.Id === parseInt(id))
    if (index !== -1) {
      personnelData[index] = { ...personnelData[index], ...personData }
      return personnelData[index]
    }
    throw new Error("Personnel not found")
  },

  async delete(id) {
    await delay(250)
    const index = personnelData.findIndex(person => person.Id === parseInt(id))
    if (index !== -1) {
      const deleted = personnelData.splice(index, 1)[0]
      return deleted
    }
    throw new Error("Personnel not found")
  }
}