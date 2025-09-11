import projectsData from "@/services/mockData/projects.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const projectService = {
  async getAll() {
    await delay(350)
    return [...projectsData]
  },

  async getById(id) {
    await delay(200)
    return projectsData.find(project => project.Id === parseInt(id))
  },

  async create(projectData) {
    await delay(400)
    const newProject = {
      ...projectData,
      Id: Math.max(...projectsData.map(p => p.Id)) + 1
    }
    projectsData.push(newProject)
    return newProject
  },

  async update(id, projectData) {
    await delay(350)
    const index = projectsData.findIndex(project => project.Id === parseInt(id))
    if (index !== -1) {
      projectsData[index] = { ...projectsData[index], ...projectData }
      return projectsData[index]
    }
    throw new Error("Project not found")
  },

  async delete(id) {
    await delay(250)
    const index = projectsData.findIndex(project => project.Id === parseInt(id))
    if (index !== -1) {
      const deleted = projectsData.splice(index, 1)[0]
      return deleted
    }
    throw new Error("Project not found")
  }
}