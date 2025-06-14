import { keyresultsApi } from "../service/apiVariables";

export const getKeyResults =
  () =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...keyresultsApi.getKeyResults })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            //Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //reject(Toast({ type: "error", message }));
            console.log("get error", message);
          });
      });
    };

export const getKeyResultsSingle =
  (id) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...keyresultsApi.getKeyResultsSingle(id) })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            //Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //reject(Toast({ type: "error", message }));
            console.log("get error", message);
          });
      });
    };
export const getKeyResultSingle =
  (id, role) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...keyresultsApi.getKeyResultSingle(id, role) })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            //Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            //reject(Toast({ type: "error", message }));
            console.log("get error", message);
          });
      });
    };
export const deletekeyResult = (id) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...keyresultsApi.deletekeyResult(id) })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        reject(Toast({ type: "error", message }));
      });
  });
};
export const updatekeyResult = (id, body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...keyresultsApi.updatekeyResult(id), body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        // Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        reject(Toast({ type: "error", message }));
      });
  });
};
//enable if needed
export const updatekeyResultCascaded = (id, body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...keyresultsApi.updatekeyResultCascaded(id), body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        //Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        console.log("error", message)
        //reject(Toast({ type: "error", message }));
      });
  });
};
export const updatekeyResults = (body) => (dispatch, getState, { api, Toast }) => {
  return new Promise((resolve, reject) => {
    api({ ...keyresultsApi.updatekeyResults, body })
      .then(({ message, data, success }) => {
        resolve({ message, data, success });
        Toast({ type: "success", message, time: 5000 });
      })
      .catch(({ message }) => {
        reject(Toast({ type: "error", message }));
      });
  });
};

export const createkeyResult =
  (body) =>
    (dispatch, getState, { api, Toast }) => {
      return new Promise((resolve, reject) => {
        api({ ...keyresultsApi.createkeyResult, body })
          .then(({ message, data, success }) => {
            resolve({ message, data, success });
            Toast({ type: "success", message, time: 5000 });
          })
          .catch(({ message }) => {
            reject(Toast({ type: "error", message }));
          });
      });
    };