import { combineReducers } from "redux";
import { favReducer } from "./testReducers";

const rootReducer = combineReducers({
  favorites: favReducer,
});

export default rootReducer;
