import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import localDataReducer from './Slices/localDataSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    localData: localDataReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
