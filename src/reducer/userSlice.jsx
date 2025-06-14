import { createSlice } from "@reduxjs/toolkit";
import { cascadeTabs } from "utilities";

const initialState = {
  user: localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null,
  userData: localStorage.getItem("userData") !== null ? JSON.parse(localStorage.getItem("userData")) : null,
  privileges: localStorage.getItem("privileges") !== null ? JSON.parse(localStorage.getItem("privileges")) : null,
  companyId: localStorage.getItem("companyId") !== null ? JSON.parse(localStorage.getItem("companyId")) : null,
  selectedTaskUser: localStorage.getItem("selectedTaskUser") !== null ? JSON.parse(localStorage.getItem("selectedTaskUser")) : null,
  threshold: [{
    "highValueRange": [
      {
        "min": "100",
        "max": "120"
      }
    ],
    "midValueRange": [
      {
        "min": "95",
        "max": "99.9"
      }
    ],
    "lowValueRange": [
      {
        "min": "0",
        "max": "94.9"
      }
    ]
  }],
  tabReadOnly: false,
  currentTab: cascadeTabs.Individual
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser: (state, action) => {
      state.user = localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null;
    },
    getPrivileges: (state, action) => {
      state.privileges = action.payload;
      localStorage.setItem("privileges", JSON.stringify(action.payload));
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setSelectedTaskUser: (state, action) => {
      localStorage.setItem("selectedTaskUser", JSON.stringify(action.payload))
      state.selectedTaskUser = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setThreshold: (state, action) => {
      state.threshold = action.payload;
    },
    setCompanyId: (state, action) => {
      state.companyId = action.payload;
      localStorage.setItem("companyId", JSON.stringify(action.payload))
    },
    setTabReadOnly: (state, action) => {
      state.tabReadOnly = action.payload;
    },
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    }
  }
})

export const { getUser, getPrivileges, setUser, setUserData, setCompanyId, setThreshold, setSelectedTaskUser, setTabReadOnly, setCurrentTab } = userSlice.actions;

export default userSlice.reducer;