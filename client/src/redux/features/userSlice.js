import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}
console.log(initialState);
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
            state.error = null
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signInFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        }
    }
})

export const { signInFailure, signInStart, signInSuccess } = userSlice.actions
export default userSlice.reducer