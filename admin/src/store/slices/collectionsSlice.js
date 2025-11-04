import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

// Dummy data
const DUMMY_COLLECTIONS = [
  {
    _id: '1',
    title: 'Youth Collection',
    category: 'necklaces',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'
    ],
    isNew: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Classic Collection',
    category: 'rings',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop'
    ],
    isNew: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'Luxury Collection',
    category: 'bracelets',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    images: [],
    isNew: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    title: 'Elegant Earrings',
    category: 'earrings',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop'
    ],
    isNew: false,
    isActive: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '5',
    title: 'Premium Watches',
    category: 'watches',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop'
    ],
    isNew: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper to create image preview URLs from File objects
const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

// Async thunks with dummy data
export const fetchCollections = createAsyncThunk(
  'collections/fetchCollections',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      await delay(500); // Simulate API delay
      
      // Get paginated data
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCollections = DUMMY_COLLECTIONS.slice(startIndex, endIndex);
      const totalRecords = DUMMY_COLLECTIONS.length;
      const totalPages = Math.ceil(totalRecords / limit);
      
      return {
        collections: paginatedCollections,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords,
          limit
        }
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch collections');
    }
  }
);

export const fetchSingleCollection = createAsyncThunk(
  'collections/fetchSingleCollection',
  async (collectionId, { rejectWithValue }) => {
    try {
      await delay(300);
      const collection = DUMMY_COLLECTIONS.find(c => c._id === collectionId);
      
      if (!collection) {
        return rejectWithValue('Collection not found');
      }
      
      return collection;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch collection');
    }
  }
);

export const createCollection = createAsyncThunk(
  'collections/createCollection',
  async (collectionData, { rejectWithValue }) => {
    try {
      await delay(800); // Simulate API delay
      
      // Create image previews for File objects
      let imageUrls = [];
      if (collectionData.images && collectionData.images.length > 0) {
        imageUrls = collectionData.images.map(img => {
          if (img instanceof File) {
            return createImagePreview(img);
          }
          return img;
        });
      }
      
      const newCollection = {
        _id: generateId(),
        title: collectionData.title,
        category: collectionData.category,
        video: collectionData.video,
        images: imageUrls,
        isNew: collectionData.isNew || false,
        isActive: collectionData.isActive !== undefined ? collectionData.isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to dummy data (for this session)
      DUMMY_COLLECTIONS.unshift(newCollection);
      
      toast.success('Collection created successfully!');
      return newCollection;
    } catch (error) {
      const errorMessage = error.message || 'Failed to create collection';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCollection = createAsyncThunk(
  'collections/updateCollection',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await delay(800); // Simulate API delay
      
      const index = DUMMY_COLLECTIONS.findIndex(c => c._id === id);
      if (index === -1) {
        return rejectWithValue('Collection not found');
      }
      
      // Create image previews for new File objects, keep existing URLs
      let imageUrls = [...(DUMMY_COLLECTIONS[index].images || [])];
      if (data.images && data.images.length > 0) {
        const newImageUrls = data.images
          .filter(img => img instanceof File)
          .map(img => createImagePreview(img));
        imageUrls = [...imageUrls, ...newImageUrls];
      }
      
      const updatedCollection = {
        ...DUMMY_COLLECTIONS[index],
        title: data.title !== undefined ? data.title : DUMMY_COLLECTIONS[index].title,
        category: data.category !== undefined ? data.category : DUMMY_COLLECTIONS[index].category,
        video: data.video !== undefined ? data.video : DUMMY_COLLECTIONS[index].video,
        images: imageUrls,
        isNew: data.isNew !== undefined ? data.isNew : DUMMY_COLLECTIONS[index].isNew,
        isActive: data.isActive !== undefined ? data.isActive : DUMMY_COLLECTIONS[index].isActive,
        updatedAt: new Date().toISOString()
      };
      
      DUMMY_COLLECTIONS[index] = updatedCollection;
      
      toast.success('Collection updated successfully!');
      return updatedCollection;
    } catch (error) {
      const errorMessage = error.message || 'Failed to update collection';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCollection = createAsyncThunk(
  'collections/deleteCollection',
  async (collectionId, { rejectWithValue }) => {
    try {
      await delay(500); // Simulate API delay
      
      const index = DUMMY_COLLECTIONS.findIndex(c => c._id === collectionId);
      if (index === -1) {
        return rejectWithValue('Collection not found');
      }
      
      DUMMY_COLLECTIONS.splice(index, 1);
      
      toast.success('Collection deleted successfully!');
      return collectionId;
    } catch (error) {
      const errorMessage = error.message || 'Failed to delete collection';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  items: [],
  allItems: [],
  currentCollection: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10
  }
};

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch collections
      .addCase(fetchCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.collections;
        state.allItems = action.payload.collections;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single collection
      .addCase(fetchSingleCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCollection = action.payload;
      })
      .addCase(fetchSingleCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create collection
      .addCase(createCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.allItems.unshift(action.payload);
        state.pagination.totalRecords += 1;
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit);
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update collection
      .addCase(updateCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCollection.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        const allIndex = state.allItems.findIndex(item => item._id === action.payload._id);
        if (allIndex !== -1) {
          state.allItems[allIndex] = action.payload;
        }
        if (state.currentCollection?._id === action.payload._id) {
          state.currentCollection = action.payload;
        }
      })
      .addCase(updateCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete collection
      .addCase(deleteCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        state.allItems = state.allItems.filter(item => item._id !== action.payload);
        state.pagination.totalRecords -= 1;
        state.pagination.totalPages = Math.ceil(state.pagination.totalRecords / state.pagination.limit);
      })
      .addCase(deleteCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, setPagination } = collectionsSlice.actions;

// Selectors
export const selectCollections = (state) => state.collections.items;
export const selectCollectionsLoading = (state) => state.collections.loading;
export const selectCollectionsError = (state) => state.collections.error;
export const selectCollectionsPagination = (state) => state.collections.pagination;
export const selectCurrentCollection = (state) => state.collections.currentCollection;

export default collectionsSlice.reducer;
