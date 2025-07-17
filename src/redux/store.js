import { configureStore } from "@reduxjs/toolkit";
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { rootPersistConfig, rootReducer } from "./rootReducer";

// Create the persisted reducer
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

// Create the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

// Create the persistor
const persistor = persistStore(store);

// Export dispatch from store directly
const { dispatch } = store;

// Custom hooks for use in components
const useDispatch = useAppDispatch;
const useSelector = useAppSelector;

// Export everything
export { store, persistor, dispatch, useSelector, useDispatch };
// Export the store as default