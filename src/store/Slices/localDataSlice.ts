import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Inventory, Item, Items, Merch } from '../../utils/types';

const initialState: Inventory = {
  merchIn: [],
  merchOut: [],
  items: [],
};

let localData = localStorage.getItem('localData');
if (localData) {
  const parsedLocalData = JSON.parse(localData);
  initialState.merchIn = parsedLocalData.merchIn || initialState.merchIn;
  initialState.merchOut = parsedLocalData.merchOut || initialState.merchOut;
  initialState.items = parsedLocalData.items || initialState.items;
}

export const LocalDataState = createSlice({
  name: 'localData',
  initialState,
  reducers: {
    saveLocalData: (state, action: PayloadAction<{ [propName: string]: Array<Merch> | Array<Item> }>) => {
      state = { ...state, ...action.payload };
      localStorage.setItem('localData', JSON.stringify(state));
      console.log('saved.');
    },
    saveItem: (state, action: PayloadAction<{ [propName: string]: Item }>) => {
      state = {
        ...state,
        items: {
          ...state.items,
          ...action.payload,
        },
      };
    },
  },
});

export const { saveLocalData, saveItem } = LocalDataState.actions;

export default LocalDataState.reducer;
