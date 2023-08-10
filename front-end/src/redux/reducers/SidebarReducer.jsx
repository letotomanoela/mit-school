const INITIAL_STATE = {
  size: "full",
  active: "Dashboard",
  color: "primary",
};

function SidebarReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "TOGGLE_SIZE":
      return {
        ...state,
        size: action.payload,
      };

    case "CHANGE_ACTIVE":
      return {
        ...state,
        active: action.payload,
      };

    case "CHANGE_COLOR":
      return {
        ...state,
        color: action.payload,
      };
  }
  return state;
}

export default SidebarReducer;
