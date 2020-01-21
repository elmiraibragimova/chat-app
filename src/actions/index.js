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
      .then(querySnapshot => {
        if (querySnapshot.size > 0) {
          const users = querySnapshot.docs.map(doc => {
            return doc.data()
          })
          dispatch({ type: UPDATE_USERS, payload: users })
        }
      })
  }
}

export function updateCurrentUser(payload) {
  return { type: UPDATE_CURRENT_USER, payload }
}
