const INITIAL_STATE = {
  token: localStorage.getItem("TOKEN"),
  userId: localStorage.getItem("USER_ID"),
  role: localStorage.getItem("ROLE"),
};

function AuthReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "LOG_IN":
      localStorage.setItem("TOKEN", action.payload.token);
      localStorage.setItem("USER_ID", action.payload.userId);
      localStorage.setItem("ROLE", action.payload.role);

      return {
        ...state,
        token: localStorage.getItem("TOKEN"),
        userId: localStorage.getItem("USER_ID"),
        role: localStorage.getItem("ROLE"),
      };

    case "LOG_OUT":
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("USER_ID");
      localStorage.removeItem("ROLE");
      return {
        ...state,
        token: null,
        userId: null,
        role: null,
      };
  }

  return state;
}

export default AuthReducer;
