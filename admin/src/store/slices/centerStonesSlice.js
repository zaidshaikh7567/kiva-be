import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data for center stones (will be replaced with real API)
const mockCenterStones = [
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
    name: '1.0 C',
    categoryId: '68e36f191cc55f0b0587b695', // pear (using round for now)
    price: 2100,
    status: 'inactive',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  },
  {
    _id: '4',
    name: '1.0 C',
    categoryId: '68e4998dc848309a6bea0674', // Emerald
    price: 2800,
    status: 'active',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    _id: '5',
    name: '1.0 C',
    categoryId: '68e499a2c848309a6bea067b', // Cushion
    price: 2300,
    status: 'active',
    createdAt: '2024-01-19T11:30:00Z',
    updatedAt: '2024-01-19T11:30:00Z'
  },
  {
    _id: '6',
    name: '1.0 C',
    categoryId: '68e499b6c848309a6bea0682', // Radiant
    price: 2600,
    status: 'inactive',
    createdAt: '2024-01-20T13:20:00Z',
    updatedAt: '2024-01-20T13:20:00Z'
  }
];

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// Async thunks for API calls
export const fetchCenterStones = createAsyncThunk(
  'centerStones/fetchCenterStones',
  async (params = {}) => {
    // Mock API implementation
    await delay(500); // Simulate API delay
    
    // Return all center stones without filtering
    return {
      centerStones: mockCenterStones,
      total: mockCenterStones.length,
      page: 1,
      limit: mockCenterStones.length,
      totalPages: 1
    };
    
    // Uncomment when real API is ready:
    // const response = await api.get('/center-stones');
    // return response.data;
  }
);

export const createCenterStone = createAsyncThunk(
  'centerStones/createCenterStone',
  async (centerStoneData) => {
    // Mock API implementation
    await delay(500); // Simulate API delay
    
    const newCenterStone = {
      _id: Date.now().toString(),
      ...centerStoneData,
      price: parseFloat(centerStoneData.price),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockCenterStones.push(newCenterStone);
    
    return newCenterStone;
    
    // Uncomment when real API is ready:
    // const response = await api.post('/center-stones', centerStoneData);
    // return response.data;
  }
);

export const updateCenterStone = createAsyncThunk(
  'centerStones/updateCenterStone',
  async ({ id, data }) => {
    // Mock API implementation
    await delay(500); // Simulate API delay
    
    const index = mockCenterStones.findIndex(stone => stone._id === id);
    if (index === -1) {
      throw new Error('Center stone not found');
    }
    
    const updatedCenterStone = {
      ...mockCenterStones[index],
      ...data,
      price: parseFloat(data.price),
      updatedAt: new Date().toISOString()
    };
    
    mockCenterStones[index] = updatedCenterStone;
    
    return updatedCenterStone;
    
    // Uncomment when real API is ready:
    // const response = await api.put(`/center-stones/${id}`, data);
    // return response.data;
  }
);

export const deleteCenterStone = createAsyncThunk(
  'centerStones/deleteCenterStone',
  async (id) => {
    // Mock API implementation
    await delay(500); // Simulate API delay
    
    const index = mockCenterStones.findIndex(stone => stone._id === id);
    if (index === -1) {
      throw new Error('Center stone not found');
    }
    
    mockCenterStones.splice(index, 1);
    return id;
    
    // Uncomment when real API is ready:
    // await api.delete(`/center-stones/${id}`);
    // return id;
  }
);

// Update center stone status
export const updateCenterStoneStatus = createAsyncThunk(
  'centerStones/updateCenterStoneStatus',
  async ({ id, status }) => {
    // Mock API implementation
    await delay(300); // Simulate API delay
    
    const centerStone = mockCenterStones.find(stone => stone._id === id);
    if (!centerStone) {
      throw new Error('Center stone not found');
    }
    
    centerStone.status = status;
    centerStone.updatedAt = new Date().toISOString();
    
    return { centerStone, message: 'Status updated successfully' };
    
    // Uncomment when real API is ready:
    // await api.patch(`/center-stones/${id}/status`, { status });
    // return { id, status };
  }
);

const centerStonesSlice = createSlice({
  name: 'centerStones',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch center stones
      .addCase(fetchCenterStones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCenterStones.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.centerStones || action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchCenterStones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch center stones';
      })
      
      // Create center stone
      .addCase(createCenterStone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCenterStone.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(createCenterStone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create center stone';
      })
      
      // Update center stone
      .addCase(updateCenterStone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCenterStone.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCenterStone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update center stone';
      })
      
      // Delete center stone
      .addCase(deleteCenterStone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCenterStone.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCenterStone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete center stone';
      })
      
      // Update center stone status
      .addCase(updateCenterStoneStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCenterStoneStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { centerStone } = action.payload;
        const index = state.items.findIndex(item => item._id === centerStone._id);
        if (index !== -1) {
          state.items[index] = centerStone;
        }
        state.error = null;
      })
      .addCase(updateCenterStoneStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update center stone status';
      });
  }
});

export const { clearError } = centerStonesSlice.actions;

// Selectors
export const selectCenterStones = (state) => state.centerStones.items;
export const selectCenterStonesLoading = (state) => state.centerStones.loading;
export const selectCenterStonesError = (state) => state.centerStones.error;

export default centerStonesSlice.reducer;
