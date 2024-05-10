import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import petTypesReducer from '../reducers/petTypesReducer';
import petBreedsReducer from '../reducers/petBreedsReducer';
import animalsReducer from '../reducers/animalsReducer';
import searchParamsReducer from '../reducers/searchParamsReducer';
import organizationsReducer from '../reducers/organizationsReducer';
import profileReducer from '../reducers/profileReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const createDebugger = require('redux-flipper').default;

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  organizations: organizationsReducer,
  petTypes: petTypesReducer,
  petBreeds: petBreedsReducer,
  animals: animalsReducer,
  searchParameters: searchParamsReducer,
  profile: profileReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    __DEV__
      ? getDefaultMiddleware({serializableCheck: false}).concat(
          createDebugger(),
        )
      : getDefaultMiddleware({serializableCheck: false}),
});

persistStore(store);
export default store;
