import { SET_MESSAGE } from "../actions/actionTypes";

const initialState = {
    type: '',
    text: ''
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MESSAGE:
            return {
                ...state,
                type: action.payload.type,
                text: action.payload.text
            }
        default:
            return state
    }
}

export default reducer