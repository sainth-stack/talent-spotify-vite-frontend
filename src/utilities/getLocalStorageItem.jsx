export const getItemFromLocalStorage = (key) => {
  const item = localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing localStorage item: ${key}`, error);
    return null;
  }
};



export const setItemToLocalStorage = (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error setting localStorage item: ${key}`, error);
  }
};


export const storeEmployeeId = (employeeId) => {
  if (employeeId) {
    try {
      const jsonValue = JSON.stringify(employeeId);
      localStorage.setItem("employeeId", jsonValue);
    } catch (error) {
      console.error("Error storing employeeId", error);
    }
  }
}
