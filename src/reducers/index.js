import { UPDATE_USERS } from '../constants/actionTypes'

const initialState = {
  users: []
}

function rootReducer(state = initialState, action) {
  if (action.type === UPDATE_USERS) {
    return {
      ...state,
      users: [...state.users, ...action.payload]
    }
  }

  return state
}

export default rootReducer
