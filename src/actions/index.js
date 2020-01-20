import { firebaseApp } from '../database'
import { App } from '../constants/app'

import { UPDATE_USERS } from '../constants/actionTypes'
import { UPDATE_CURRENT_USER } from '../constants/actionTypes'

export function updateUsers() {
  return function(dispatch) {
    return firebaseApp
      .firestore()
      .collection(App.USERS)
      .get()
      .then(res => {
        if (res.docs.length > 0) {
          const users = [...res.docs]
          dispatch({ type: UPDATE_USERS, payload: users })
        }
      })
  }
}

export function updateCurrentUser(payload) {
  return { type: UPDATE_CURRENT_USER, payload }
}
