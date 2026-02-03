import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UIState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  cameraPermissionGranted: boolean;
  locationPermissionGranted: boolean;
}

const initialState: UIState = {
  isLoading: false,
  error: null,
  success: null,
  cameraPermissionGranted: false,
  locationPermissionGranted: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
    setCameraPermission: (state, action: PayloadAction<boolean>) => {
      state.cameraPermissionGranted = action.payload;
    },
    setLocationPermission: (state, action: PayloadAction<boolean>) => {
      state.locationPermissionGranted = action.payload;
    },
    clearMessages: state => {
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setSuccess,
  setCameraPermission,
  setLocationPermission,
  clearMessages,
} = uiSlice.actions;

export default uiSlice.reducer;