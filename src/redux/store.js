import thunkMiddleware from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { createStore, compose, applyMiddleware } from "redux";
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from "./reducers";

export const history = createBrowserHistory();

export default function configureStore(preloadedState) {
    const store = createStore(
        createRootReducer(history), // root reducer with router state
        preloadedState,
        compose(
            applyMiddleware(
                routerMiddleware(history), // for dispatching history actions
                thunkMiddleware
            ),
        ),
    )
  
    return store
}