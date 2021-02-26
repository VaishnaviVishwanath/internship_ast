/*This is an action creator, which is returning an action, an action is nothing but an object
 * with fields type and payload */
import { testContent } from "../Data";
import { actions } from "../constants";
export function setFavorites(favs) {
  return {
    type: actions.SET_FAVORITES,
    payload: favs,
  };
}
