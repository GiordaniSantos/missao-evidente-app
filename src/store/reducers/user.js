import { USER_LOGGED_IN, USER_LOGGED_OUT, LOADING_USER, USER_LOADED, INIT_SPLASH_SCREEN, CLOSE_SPLASH_SCREEN } from "../actions/actionTypes";

const initialState = {
    name: null,
    email: null,
    id: null,
    token: null,
    isLoading: false,
    splashScreen: true
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGGED_IN:
            return {
                ...state,
                name: action.payload.name,
                email: action.payload.email,
                id: action.payload.id,
                token: action.payload.token
            }
        case USER_LOGGED_OUT:
            return {
                ...initialState,
                splashScreen: false
            }
        case LOADING_USER:
            return {
                ...state,
                isLoading: true
            }
        case USER_LOADED:
            return {
                ...state,
                isLoading: false
            }
        case INIT_SPLASH_SCREEN:
            return {
                ...state,
                splashScreen: true
            }
        case CLOSE_SPLASH_SCREEN:
            return {
                ...state,
                splashScreen: false
            }
        default:
            return state
    }
} 

export default reducer