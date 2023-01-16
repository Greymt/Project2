import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

export const store = configureStore({
  reducer: combineReducers({
  }),
  devTools: process.env.NODE_ENV !== "production",
  middleware: (gDM) => gDM({ serializableCheck: false })
});

const makeStore = () => {
  return store;
}

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const wrapper = createWrapper(makeStore, { debug: false });