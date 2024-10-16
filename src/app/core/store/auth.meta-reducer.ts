import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import AuthActions from '../../features/auth/store/auth.action';

export function resetOnLogout<State>(reducer: ActionReducer<State>): ActionReducer<State> {
  return function clearStateFn(state: State | undefined, action: Action): State {
    if (action.type === AuthActions.logout.type) {
      return {} as State; // Resetting state to an empty object
    }
    return reducer(state, action);
  };
}