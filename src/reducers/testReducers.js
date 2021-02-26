import { actions } from "../constants";

export function favReducer(state = null, action) {
  switch (action.type) {
    case actions.SET_FAVORITES:
      return action.payload;
  }
  return state;
}

// export function
