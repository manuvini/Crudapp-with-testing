import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import type { PreloadedState } from "@reduxjs/toolkit";
import { Provider } from "react-redux";


import type { AppStore , RootState} from "../app/store"
import { setupStore } from '../app/store'
import userSlice from "../module/User/PostSlice"
import { BrowserRouter, Route, Routes } from "react-router-dom";

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: PreloadedState<RootState>
    store?: AppStore
  }

 


  export function renderWithProviders(
    ui: React.ReactElement,
    {
      preloadedState = {},
      // Automatically create a store instance if no store was passed in
      store = setupStore(preloadedState),
      ...renderOptions
    }: ExtendedRenderOptions = {}
  ) {
    function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
      return <Provider store={store}>
        {children}
            {/* <BrowserRouter>
            <Routes>
              <Route index element={children}></Route>
            </Routes>
            </BrowserRouter> */}
        </Provider>
    }
  
    // Return an object with the store and all of RTL's query functions
    return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
  }