const INITIAL_STATE = {
  isFetching: false,
  matieres: null,
  activeClasse: "6450d395c1f8f4dd5479c28a",
};

function MatiereReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_MATIERE_CLASSE":
      return {
        ...state,
        activeClasse: action.payload,
      };

    case "MATIERE_FETCHING":
      return {
        ...state,
        isFetching: action.payload,
      };

    case "LOAD_MATIERE_REDUCER":
      return {
        ...state,
        matieres: action.payload,
      };
  }

  return state;
}

export default MatiereReducer;

export const getMatieres = (classe) => (dispatch) => {
  dispatch({
    type: "MATIERE_FETCHING",
    payload: true,
  });
  fetch(`http://localhost:5001/matiere/${classe}`)
    .then((response) => response.json())
    .then((json) => {
      dispatch({
        type: "MATIERE_FETCHING",
        payload: false,
      });
      dispatch({
        type: "LOAD_MATIERE_REDUCER",
        payload: json.data,
      });
    });
};
