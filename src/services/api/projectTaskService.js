// Initialize ApperClient for database operations
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const projectTaskService = {
async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "project_name_c" } },
          { field: { Name: "project_description_c" } },
          { field: { Name: "estimated_budget_c" } },
          { field: { Name: "project_priority_c" } },
          { field: { Name: "departments_involved_c" } },
          { field: { Name: "progress_range_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "number_of_team_members_c" } },
          { field: { Name: "is_approved_c" } },
          { field: { Name: "project_manager_email_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "project_tags_c" } },
          { field: { Name: "assigned_to_c" } },
          { field: { Name: "allocated_budget_c" } },
          { field: { Name: "allocated_budget_currency_c" } },
          { field: { Name: "include_risk_assessment_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "contact_phone_c" } },
          { field: { Name: "project_website_c" } },
          { field: { Name: "stakeholder_satisfaction_c" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };
      
      const response = await apperClient.fetchRecords('project_task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI format
      const transformedData = (response.data || []).map(task => ({
        Id: task.Id,
        Name: task.Name,
        projectName: task.project_name_c,
        projectDescription: task.project_description_c,
        estimatedBudget: task.estimated_budget_c,
        projectPriority: task.project_priority_c,
        departmentsInvolved: task.departments_involved_c,
        progressRange: task.progress_range_c,
        startDate: task.start_date_c,
        numberOfTeamMembers: task.number_of_team_members_c,
        isApproved: task.is_approved_c,
        projectManagerEmail: task.project_manager_email_c,
        deadline: task.deadline_c,
        projectTags: task.project_tags_c,
        assignedTo: task.assigned_to_c,
        allocatedBudget: task.allocated_budget_c,
        allocatedBudgetCurrency: task.allocated_budget_currency_c,
        includeRiskAssessment: task.include_risk_assessment_c,
        status: task.status_c,
        contactPhone: task.contact_phone_c,
        projectWebsite: task.project_website_c,
        stakeholderSatisfaction: task.stakeholder_satisfaction_c
      }));
      
      return transformedData;
    } catch (error) {
      console.error("Error fetching project tasks:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "project_name_c" } },
          { field: { Name: "project_description_c" } },
          { field: { Name: "estimated_budget_c" } },
          { field: { Name: "project_priority_c" } },
          { field: { Name: "departments_involved_c" } },
          { field: { Name: "progress_range_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "number_of_team_members_c" } },
          { field: { Name: "is_approved_c" } },
          { field: { Name: "project_manager_email_c" } },
          { field: { Name: "deadline_c" } },
          { field: { Name: "project_tags_c" } },
          { field: { Name: "assigned_to_c" } },
          { field: { Name: "allocated_budget_c" } },
          { field: { Name: "allocated_budget_currency_c" } },
          { field: { Name: "include_risk_assessment_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "contact_phone_c" } },
          { field: { Name: "project_website_c" } },
          { field: { Name: "stakeholder_satisfaction_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById('project_task_c', parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Project task not found");
      }
      
      const task = response.data;
      return {
        Id: task.Id,
        Name: task.Name,
        projectName: task.project_name_c,
        projectDescription: task.project_description_c,
        estimatedBudget: task.estimated_budget_c,
        projectPriority: task.project_priority_c,
        departmentsInvolved: task.departments_involved_c,
        progressRange: task.progress_range_c,
        startDate: task.start_date_c,
        numberOfTeamMembers: task.number_of_team_members_c,
        isApproved: task.is_approved_c,
        projectManagerEmail: task.project_manager_email_c,
        deadline: task.deadline_c,
        projectTags: task.project_tags_c,
        assignedTo: task.assigned_to_c,
        allocatedBudget: task.allocated_budget_c,
        allocatedBudgetCurrency: task.allocated_budget_currency_c,
        includeRiskAssessment: task.include_risk_assessment_c,
        status: task.status_c,
        contactPhone: task.contact_phone_c,
        projectWebsite: task.project_website_c,
        stakeholderSatisfaction: task.stakeholder_satisfaction_c
      };
    } catch (error) {
      console.error(`Error fetching project task with ID ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  },

async create(projectTaskData) {
    try {
      // Transform UI format to database fields (only updateable fields)
      const dbRecord = {
        Name: projectTaskData.projectName || projectTaskData.Name,
        project_name_c: projectTaskData.projectName,
        project_description_c: projectTaskData.projectDescription,
        estimated_budget_c: projectTaskData.estimatedBudget,
        project_priority_c: projectTaskData.projectPriority,
        departments_involved_c: projectTaskData.departmentsInvolved,
        progress_range_c: projectTaskData.progressRange ? parseInt(projectTaskData.progressRange) : 0,
        start_date_c: projectTaskData.startDate,
        number_of_team_members_c: projectTaskData.numberOfTeamMembers ? parseInt(projectTaskData.numberOfTeamMembers) : 1,
        is_approved_c: projectTaskData.isApproved || false,
        project_manager_email_c: projectTaskData.projectManagerEmail,
        deadline_c: projectTaskData.deadline,
        project_tags_c: projectTaskData.projectTags,
        assigned_to_c: projectTaskData.assignedTo,
        allocated_budget_c: projectTaskData.allocatedBudget,
        allocated_budget_currency_c: projectTaskData.allocatedBudgetCurrency || 'USD',
        include_risk_assessment_c: projectTaskData.includeRiskAssessment,
        status_c: projectTaskData.status || 'Not Started',
        contact_phone_c: projectTaskData.contactPhone,
        project_website_c: projectTaskData.projectWebsite,
        stakeholder_satisfaction_c: projectTaskData.stakeholderSatisfaction ? parseInt(projectTaskData.stakeholderSatisfaction) : 1,
        Tags: projectTaskData.projectTags
      };
      
      const params = { records: [dbRecord] };
      const response = await apperClient.createRecord('project_task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create project task ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error}`);
            });
          });
          throw new Error("Some records failed to create");
        }
        
        const createdRecord = successfulRecords[0]?.data;
        if (createdRecord) {
          return {
            Id: createdRecord.Id,
            Name: createdRecord.Name,
            projectName: createdRecord.project_name_c,
            projectDescription: createdRecord.project_description_c,
            estimatedBudget: createdRecord.estimated_budget_c,
            projectPriority: createdRecord.project_priority_c,
            departmentsInvolved: createdRecord.departments_involved_c,
            progressRange: createdRecord.progress_range_c,
            startDate: createdRecord.start_date_c,
            numberOfTeamMembers: createdRecord.number_of_team_members_c,
            isApproved: createdRecord.is_approved_c,
            projectManagerEmail: createdRecord.project_manager_email_c,
            deadline: createdRecord.deadline_c,
            projectTags: createdRecord.project_tags_c,
            assignedTo: createdRecord.assigned_to_c,
            allocatedBudget: createdRecord.allocated_budget_c,
            allocatedBudgetCurrency: createdRecord.allocated_budget_currency_c,
            includeRiskAssessment: createdRecord.include_risk_assessment_c,
            status: createdRecord.status_c,
            contactPhone: createdRecord.contact_phone_c,
            projectWebsite: createdRecord.project_website_c,
            stakeholderSatisfaction: createdRecord.stakeholder_satisfaction_c
          };
        }
      }
      
      throw new Error("No record created");
    } catch (error) {
      console.error("Error creating project task:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

async update(id, projectTaskData) {
    try {
      // Transform UI format to database fields (only updateable fields)
      const dbRecord = {
        Id: parseInt(id),
        Name: projectTaskData.projectName || projectTaskData.Name,
        project_name_c: projectTaskData.projectName,
        project_description_c: projectTaskData.projectDescription,
        estimated_budget_c: projectTaskData.estimatedBudget,
        project_priority_c: projectTaskData.projectPriority,
        departments_involved_c: projectTaskData.departmentsInvolved,
        progress_range_c: projectTaskData.progressRange ? parseInt(projectTaskData.progressRange) : 0,
        start_date_c: projectTaskData.startDate,
        number_of_team_members_c: projectTaskData.numberOfTeamMembers ? parseInt(projectTaskData.numberOfTeamMembers) : 1,
        is_approved_c: projectTaskData.isApproved || false,
        project_manager_email_c: projectTaskData.projectManagerEmail,
        deadline_c: projectTaskData.deadline,
        project_tags_c: projectTaskData.projectTags,
        assigned_to_c: projectTaskData.assignedTo,
        allocated_budget_c: projectTaskData.allocatedBudget,
        allocated_budget_currency_c: projectTaskData.allocatedBudgetCurrency || 'USD',
        include_risk_assessment_c: projectTaskData.includeRiskAssessment,
        status_c: projectTaskData.status || 'Not Started',
        contact_phone_c: projectTaskData.contactPhone,
        project_website_c: projectTaskData.projectWebsite,
        stakeholder_satisfaction_c: projectTaskData.stakeholderSatisfaction ? parseInt(projectTaskData.stakeholderSatisfaction) : 1,
        Tags: projectTaskData.projectTags
      };
      
      const params = { records: [dbRecord] };
      const response = await apperClient.updateRecord('project_task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update project task ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              console.error(`${error.fieldLabel}: ${error}`);
            });
          });
          throw new Error("Update failed");
        }
        
        const updatedRecord = successfulUpdates[0]?.data;
        if (updatedRecord) {
          return {
            Id: updatedRecord.Id,
            Name: updatedRecord.Name,
            projectName: updatedRecord.project_name_c,
            projectDescription: updatedRecord.project_description_c,
            estimatedBudget: updatedRecord.estimated_budget_c,
            projectPriority: updatedRecord.project_priority_c,
            departmentsInvolved: updatedRecord.departments_involved_c,
            progressRange: updatedRecord.progress_range_c,
            startDate: updatedRecord.start_date_c,
            numberOfTeamMembers: updatedRecord.number_of_team_members_c,
            isApproved: updatedRecord.is_approved_c,
            projectManagerEmail: updatedRecord.project_manager_email_c,
            deadline: updatedRecord.deadline_c,
            projectTags: updatedRecord.project_tags_c,
            assignedTo: updatedRecord.assigned_to_c,
            allocatedBudget: updatedRecord.allocated_budget_c,
            allocatedBudgetCurrency: updatedRecord.allocated_budget_currency_c,
            includeRiskAssessment: updatedRecord.include_risk_assessment_c,
            status: updatedRecord.status_c,
            contactPhone: updatedRecord.contact_phone_c,
            projectWebsite: updatedRecord.project_website_c,
            stakeholderSatisfaction: updatedRecord.stakeholder_satisfaction_c
          };
        }
      }
      
      throw new Error("No record updated");
    } catch (error) {
      console.error("Error updating project task:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

async delete(id) {
    try {
      const params = { RecordIds: [parseInt(id)] };
      const response = await apperClient.deleteRecord('project_task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete project task ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) console.error(record.message);
          });
          throw new Error("Delete failed");
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting project task:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
}