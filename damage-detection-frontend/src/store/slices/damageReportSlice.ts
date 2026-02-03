import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface DamageImage {
  uri: string;
  fileName: string;
  type: string;
  fileSize: number;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface DamageReportState {
  currentReport: {
    itemSku: string;
    images: DamageImage[];
    notes: string;
    location: {
      latitude: number;
      longitude: number;
    } | null;
  };
  isSubmitting: boolean;
  submitError: string | null;
  reports: any[];
}

const initialState: DamageReportState = {
  currentReport: {
    itemSku: '',
    images: [],
    notes: '',
    location: null,
  },
  isSubmitting: false,
  submitError: null,
  reports: [],
};

const damageReportSlice = createSlice({
  name: 'damageReport',
  initialState,
  reducers: {
    setItemSku: (state, action: PayloadAction<string>) => {
      state.currentReport.itemSku = action.payload;
    },
    addImage: (state, action: PayloadAction<DamageImage>) => {
      state.currentReport.images.push(action.payload);
    },
    removeImage: (state, action: PayloadAction<number>) => {
      state.currentReport.images.splice(action.payload, 1);
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.currentReport.notes = action.payload;
    },
    setLocation: (
      state,
      action: PayloadAction<{latitude: number; longitude: number}>,
    ) => {
      state.currentReport.location = action.payload;
    },
    clearCurrentReport: state => {
      state.currentReport = {
        itemSku: '',
        images: [],
        notes: '',
        location: null,
      };
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setSubmitError: (state, action: PayloadAction<string | null>) => {
      state.submitError = action.payload;
    },
  },
});

export const {
  setItemSku,
  addImage,
  removeImage,
  setNotes,
  setLocation,
  clearCurrentReport,
  setSubmitting,
  setSubmitError,
} = damageReportSlice.actions;

export default damageReportSlice.reducer;