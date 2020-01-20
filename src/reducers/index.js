import { UPDATE_USERS } from '../constants/actionTypes'
import { UPDATE_CURRENT_USER } from '../constants/actionTypes'

const initialState = {
  users: [],
  currentUser: {}
}

function rootReducer(state = initialState, action) {
  if (action.type === UPDATE_USERS) {
    return {
      ...state,
      users: [...action.payload]
    }
  }

  if (action.type === UPDATE_CURRENT_USER) {
    return {
      ...state,
      currentUser: action.payload,
      users: state.users.map(u => {
        if (u.id === action.payload.id) {
          return action.payload
        }
        return u
      })
    }
  }

  return state
}

export default rootReducer
