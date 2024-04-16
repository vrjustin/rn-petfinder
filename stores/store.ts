import {combineReducers, configureStore} from '@reduxjs/toolkit';
import petTypesReducer from '../reducers/petTypesReducer';

const rootReducer = combineReducers({
  petTypes: petTypesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
