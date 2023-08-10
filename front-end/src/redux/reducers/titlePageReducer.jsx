const INITIAL_STATE = {
  title: "Dashboard",
};

function titlePageReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_TITLE":
      return {
        ...state,
        title: action.payload,
      };
  }

  return state;
}

export default titlePageReducer
