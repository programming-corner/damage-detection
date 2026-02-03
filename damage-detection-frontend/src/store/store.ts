import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import damageReportReducer from './slices/damageReportSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    damageReport: damageReportReducer,
    ui: uiReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['damageReport/setImages'],
        ignoredPaths: ['damageReport.images'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;