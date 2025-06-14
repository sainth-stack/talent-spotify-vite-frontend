// import {createStore, applyMiddleware} from "redux";
import { configureStore } from "@reduxjs/toolkit";
// import {reducers} from "../../reducer";
import reducers from "../../reducer"
import previlageReducer from "../../reducer/privilegesGroup"
// import thunk from "redux-thunk";
// import userSlice from "reducer/userSlice";
import { Toast } from './../toast';
import { api } from './../../utilities/api';
// export const store = createStore(reducers, applyMiddleware(thunk.withExtraArgument({api, Toast})));

export const store2 = configureStore({
  reducer: {
    data: reducers,
    previlage: previlageReducer,
    // user: userSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          api, Toast
        },
      },
      serializableCheck: false,
    }),
})

export const history = require("history").createBrowserHistory();

let routerCache = {};

export const pageNavigationByName = (locationDetails) => {
  let { name: locationName, params = "", ...rest } = locationDetails;

  let pathname = "";

  let locationProps = rest || {};

  if (routerCache.hasOwnProperty(locationName)) {
    pathname = routerCache[locationName];
  } else {
    // for (let i = 0; i < routers.length; i++) {
    //   let { name = "", childrens = [], path: parentPath } = routers[i];

    //   if (name === locationName) {
    //     pathname = parentPath;
    //     routerCache[locationName] = parentPath;
    //     break;
    //   } else {
    //     for (let j = 0; j < childrens.length; j++) {
    //       let { name = "", path = "" } = childrens[j];

    //       if (name === locationName) {
    //         let fullPath = `${parentPath}${path}`;
    //         pathname = fullPath;
    //         routerCache[locationName] = fullPath;
    //         break;
    //       }
    //     }
    //   }

    //   if (pathname) break;
    // }
  }

  if (params) {
    pathname = Object.keys(params).reduce((acc, keyName) => {
      return acc.replace(`:${keyName}`, params[keyName]);
    }, pathname);
  }

  history.push({ pathname, ...locationProps });
};
