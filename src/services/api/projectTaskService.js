import projectTasksData from "@/services/mockData/projectTasks.json"
import projectsData from "@/services/mockData/projects.json"
import personnelData from "@/services/mockData/personnel.json"

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const enrichProjectTaskData = (projectTask) => {
  // Find related project data
  const project = projectsData.find(p => p.Id === parseInt(projectTask.Id))
  
  // Find assigned personnel
  const assignedPersonnel = personnelData.find(person => 
    person.projectId === projectTask.Id.toString()
  )
  
  return {
    ...projectTask,
    // Use project name from projects.json if available
    projectName: project ? project.name : projectTask.projectName,
    // Use personnel full name if assigned
    assignedTo: assignedPersonnel 
      ? `${assignedPersonnel.firstName} ${assignedPersonnel.lastName}`
      : projectTask.assignedTo
  }
}

export const projectTaskService = {
  async getAll() {
    await delay(350)
    return projectTasksData.map(enrichProjectTaskData)
  },

  async getById(id) {
    await delay(200)
    const projectTask = projectTasksData.find(task => task.Id === parseInt(id))
    if (!projectTask) {
      throw new Error("Project task not found")
    }
    return projectTask
  },

async create(projectTaskData) {
    await delay(400)
    const newProjectTask = {
      ...projectTaskData,
      Id: Math.max(...projectTasksData.map(t => t.Id)) + 1
    }
    projectTasksData.push(newProjectTask)
    return enrichProjectTaskData(newProjectTask)
  },

async update(id, projectTaskData) {
    await delay(350)
    const index = projectTasksData.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Project task not found")
    }
    projectTasksData[index] = { 
      ...projectTasksData[index], 
      ...projectTaskData,
      Id: parseInt(id)
    }
    return enrichProjectTaskData(projectTasksData[index])
  },

  async delete(id) {
    await delay(250)
    const index = projectTasksData.findIndex(task => task.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Project task not found")
    }
    const deletedProjectTask = projectTasksData.splice(index, 1)[0]
    return deletedProjectTask
  }
}