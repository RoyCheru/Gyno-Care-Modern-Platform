import { configureStore } from "@reduxjs/toolkit"
import bookingReducer from "./features/booking-slice"
import authReducer from "./features/auth-slice"

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
