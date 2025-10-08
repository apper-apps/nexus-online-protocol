import { toast } from 'react-toastify';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const filterService = {
  async getAll() {
    try {
      await delay(300);
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { "field": { "Name": "name_c" } },
          { "field": { "Name": "filter_data_c" } }
        ],
        orderBy: [{ "fieldName": "CreatedOn", "sorttype": "DESC" }]
      };

      const response = await apperClient.fetchRecords('contact_filter_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching saved filters:", error?.response?.data?.message || error);
      toast.error("Failed to load saved filters");
      return [];
    }
  },

  async getById(id) {
    try {
      await delay(300);
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { "field": { "Name": "name_c" } },
          { "field": { "Name": "filter_data_c" } }
        ]
      };

      const response = await apperClient.getRecordById('contact_filter_c', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching filter ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to load filter");
      return null;
    }
  },

  async create(filterData) {
    try {
      await delay(300);
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            name_c: filterData.name_c,
            filter_data_c: filterData.filter_data_c
          }
        ]
      };

      const response = await apperClient.createRecord('contact_filter_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create filter:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating filter:", error?.response?.data?.message || error);
      toast.error("Failed to save filter");
      return null;
    }
  },

  async update(id, filterData) {
    try {
      await delay(300);
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Id: id,
            name_c: filterData.name_c,
            filter_data_c: filterData.filter_data_c
          }
        ]
      };

      const response = await apperClient.updateRecord('contact_filter_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update filter:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
          return null;
        }

        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating filter:", error?.response?.data?.message || error);
      toast.error("Failed to update filter");
      return null;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('contact_filter_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete filter:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting filter:", error?.response?.data?.message || error);
      toast.error("Failed to delete filter");
      return false;
    }
  }
};