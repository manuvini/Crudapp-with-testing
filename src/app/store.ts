import { configureStore, combineReducers , ThunkAction, Action } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import userReducer from "../module/User/PostSlice";
import { PreloadedState } from "@reduxjs/toolkit";


const rootReduser = combineReducers({
  user: userReducer
})

export const setupStore = (preloadedState ?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReduser,
    preloadedState
  })
}





export type AppDispatch = AppStore['dispatch'];
export type AppStore = ReturnType<typeof setupStore>
export type RootState = ReturnType<typeof rootReduser>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
