// API service for Center Stones in Frontend
// This will fetch center stones from the backend API

import api from './api';

// Ring size options (from 3 to 12 in 0.25 increments)
export const RING_SIZES = [
  { value: '3', label: '3' },
  { value: '3.25', label: '3.25' },
  { value: '3.50', label: '3.50' },
  { value: '3.75', label: '3.75' },
  { value: '4', label: '4' },
  { value: '4.25', label: '4.25' },
  { value: '4.50', label: '4.50' },
  { value: '4.75', label: '4.75' },
  { value: '5', label: '5' },
  { value: '5.25', label: '5.25' },
  { value: '5.50', label: '5.50' },
  { value: '5.75', label: '5.75' },
  { value: '6', label: '6' },
  { value: '6.25', label: '6.25' },
  { value: '6.50', label: '6.50' },
  { value: '6.75', label: '6.75' },
  { value: '7', label: '7' },
  { value: '7.25', label: '7.25' },
  { value: '7.50', label: '7.50' },
  { value: '7.75', label: '7.75' },
  { value: '8', label: '8' },
  { value: '8.25', label: '8.25' },
  { value: '8.50', label: '8.50' },
  { value: '8.75', label: '8.75' },
  { value: '9', label: '9' },
  { value: '9.25', label: '9.25' },
  { value: '9.50', label: '9.50' },
  { value: '9.75', label: '9.75' },
  { value: '10', label: '10' },
  { value: '10.25', label: '10.25' },
  { value: '10.50', label: '10.50' },
  { value: '10.75', label: '10.75' },
  { value: '11', label: '11' },
  { value: '11.25', label: '11.25' },
  { value: '11.50', label: '11.50' },
  { value: '11.75', label: '11.75' },
  { value: '12', label: '12' }
];

// Center stone carat options
export const CENTER_STONE_CARATS = [
  { value: '1.0', label: '1.0 CT' },
  { value: '1.5', label: '1.5 CT' },
  { value: '2.0', label: '2.0 CT' },
  { value: '2.5', label: '2.5 CT' },
  { value: '3.0', label: '3.0 CT' },
  { value: '3.5', label: '3.5 CT' },
  { value: '4.0', label: '4.0 CT' }
];

// API functions for center stones
export const centerStonesApi = {
  // Get all center stones
  getCenterStones: async () => {
    try {
      const response = await api.get('/center-stones');
      return response.data;
    } catch (error) {
      console.error('Error fetching center stones:', error);
      // Return mock data if API fails
      return {
        centerStones: [
            {
                _id: '1',
                name: '1.0 CT',
                categoryId: '68e36f191cc55f0b0587b695', // round
                price: 2500,
                status: 'active',
                createdAt: '2024-01-15T10:30:00Z',
                updatedAt: '2024-01-15T10:30:00Z'
              },
              {
                _id: '2',
                name: '1.5 CT',
                categoryId: '68e36f191cc55f0b0587b695', // round
                price: 2200,
                status: 'active',
                createdAt: '2024-01-16T14:20:00Z',
                updatedAt: '2024-01-16T14:20:00Z'
              },
              {
                _id: '3',
                name: '1.0 CT',
                categoryId: '68e36f191cc55f0b0587b695', // pear (using round for now)
                price: 2100,
                status: 'inactive',
                createdAt: '2024-01-17T09:15:00Z',
                updatedAt: '2024-01-17T09:15:00Z'
              },
              {
                _id: '4',
                name: '1.0 CT',
                categoryId: '68e4998dc848309a6bea0674', // Emerald
                price: 2800,
                status: 'active',
                createdAt: '2024-01-18T16:45:00Z',
                updatedAt: '2024-01-18T16:45:00Z'
              },
              {
                _id: '5',
                name: '1.0 CT',
                categoryId: '68e499a2c848309a6bea067b', // Cushion
                price: 2300,
                status: 'active',
                createdAt: '2024-01-19T11:30:00Z',
                updatedAt: '2024-01-19T11:30:00Z'
              },
              {
                _id: '6',
                name: '1.0 CT',
                categoryId: '68e499b6c848309a6bea0682', // Radiant
                price: 2600,
                status: 'inactive',
                createdAt: '2024-01-20T13:20:00Z',
                updatedAt: '2024-01-20T13:20:00Z'
              }
        ]
      };
    }
  },

  // Get center stones by category
  getCenterStonesByCategory: async (category) => {
    try {
      const response = await api.get(`/center-stones?category=${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching center stones by category:', error);
      // Return filtered mock data if API fails
      const allStones = await centerStonesApi.getCenterStones();
      const filteredStones = allStones.centerStones.filter(stone => stone.categoryId === category);
      return { centerStones: filteredStones };
    }
  },

  // Get single center stone by ID
  getCenterStoneById: async (id) => {
    try {
      const response = await api.get(`/center-stones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching center stone:', error);
      return null;
    }
  }
};

export default centerStonesApi;
