const INITIAL_STATE = {
  activeClasse: "6450d395c1f8f4dd5479c28a",
  asc: "2022-2023",
  skip: 1,
  pagination: 1,
  listeNote: [],
  searchValue: "",
  listeMatiere: [],
  isFetchingMatiere: false,
  isFetchingNote: false,
  error: false,
  errorMessage: "",
  semestre: "1",
};

function ListeNoteReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_CLASSE_NOTE":
      return {
        ...state,
        activeClasse: action.payload,
      };

    case "LOAD_LISTE_NOTE":
      return {
        ...state,
        listeNote: action.payload,
      };
    case "CHANGE_PAGINATION_NOTE":
      return {
        ...state,
        pagination: action.payload,
      };

    case "CHANGE_SKIP_NOTE":
      return {
        ...state,
        skip: action.payload,
      };

    case "LOAD_LISTE_MATIERE_PAR_CLASSE":
      return {
        ...state,
        listeMatiere: action.payload,
      };

    case "CHANGE_SEMESTRE":
      return {
        ...state,
        semestre: action.payload,
      };
    case "NOTE_FETCHING":
      return {
        ...state,
        isFetchingNote: action.payload,
      };
    case "NOTE_FETCHING_MATIERE":
      return {
        ...state,
        isFetchingMatiere: action.payload,
      };

    case "NOTE_REDUCER_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_NOTE_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_NOTE_ERROR_MESSAGE":
      return {
        ...state,
        errorMessage: action.payload,
      };
  }

  return state;
}

export default ListeNoteReducer;

export const getMatiereByClass = (e) => (dispatch) => {
  dispatch({
    type: "SET_NOTE_ERROR",
    payload: false,
  });
  dispatch({
    type: "SET_NOTE_ERROR_MESSAGE",
    payload: "",
  });

  fetch(`http://localhost:5001/matiere/${e}`)
    .then((response) => {
      if (!response.ok) {
        dispatch({
          type: "SET_NOTE_ERROR",
          payload: true,
        });
        dispatch({
          type: "SET_NOTE_ERROR_MESSAGE",
          payload:
            "Une erreur s'est produite ou vérifier votre connexion internet",
        });
      }
      return response.json();
    })
    .then((data) => {
      dispatch({
        type: "LOAD_LISTE_MATIERE_PAR_CLASSE",
        payload: data.data,
      });
    });
};

export const getNotes = (classe, asc, skip) => (dispatch) => {
  try {
    dispatch({
      type: "NOTE_FETCHING",
      payload: true,
    });
    dispatch({
      type: "SET_NOTE_ERROR",
      payload: false,
    });
    dispatch({
      type: "SET_NOTE_ERROR_MESSAGE",
      payload: "",
    });

    fetch(
      `http://localhost:5001/note/asc/${asc}/classe/${classe}/skip=${
        (Number(skip) - 1) * 10
      }`
    )
      .then((response) => {
        if (!response.ok) {
          dispatch({
            type: "NOTE_FETCHING",
            payload: false,
          });
          dispatch({
            type: "SET_NOTE_ERROR",
            payload: true,
          });
          dispatch({
            type: "SET_NOTE_ERROR_MESSAGE",
            payload:
              "Une erreur s'est produite ou vérifier votre connexion internet",
          });
        }
        return response.json();
      })
      .then((data) => {
        dispatch({
          type: "NOTE_FETCHING",
          payload: false,
        });
        dispatch({
          type: "LOAD_LISTE_NOTE",
          payload: data.notes,
        });
      });
  } catch (error) {
    dispatch({
      type: "LOAD_LISTE_NOTE",
      payload: [],
    });
    dispatch({
      type: "NOTE_FETCHING",
      payload: false,
    });
    dispatch({
      type: "NOTE_REDUCER_ERROR",
      payload: "Vérifier votre connexion Internet",
    });
  }
};

function divisionEntiere(nombre) {
  let division = Math.floor(nombre / 10); // Division entière par 10
  let reste = nombre % 10; // Reste de la division par 10

  if (reste > 0) {
    division++; // Ajouter 1 si le reste est supérieur à 0
  }

  return division;
}

export const getTotalNotes = (classe, asc) => (dispatch) => {
  dispatch({
    type: "SET_NOTE_ERROR",
    payload: false,
  });
  dispatch({
    type: "SET_NOTE_ERROR_MESSAGE",
    payload: "",
  });
  fetch(
    `http://localhost:5001/etudiant/nombre/total/asc/${asc}/classe/${classe}`
  )
    .then((response) => {
      if (!response.ok) {
        dispatch({
          type: "NOTE_FETCHING",
          payload: false,
        });
        dispatch({
          type: "SET_NOTE_ERROR",
          payload: true,
        });
        dispatch({
          type: "SET_NOTE_ERROR_MESSAGE",
          payload:
            "Une erreur s'est produite ou vérifier votre connexion internet",
        });
      }
      return response.json();
    })
    .then((data) => {
      if (Number(data.count) > 0) {
        dispatch({
          type: "CHANGE_PAGINATION_NOTE",
          payload: divisionEntiere(Number(data.count)),
        });
      } else {
        dispatch({
          type: "CHANGE_PAGINATION_NOTE",
          payload: 1,
        });
      }
    });
};

export const searchNotes = (classe, asc, skip, value) => (dispatch) => {
  try {
    dispatch({
      type: "SET_NOTE_ERROR",
      payload: false,
    });
    dispatch({
      type: "SET_NOTE_ERROR_MESSAGE",
      payload: "",
    });
    dispatch({
      type: "NOTE_FETCHING",
      payload: true,
    });
    fetch(
      `http://localhost:5001/note/research=${value}/asc=${asc}/classe=${classe}/skip=${
        (Number(skip) - 1) * 10
      }`
    )
      .then((response) => {
        if (!response.ok) {
          dispatch({
            type: "NOTE_FETCHING",
            payload: false,
          });
          dispatch({
            type: "SET_NOTE_ERROR",
            payload: true,
          });
          dispatch({
            type: "SET_NOTE_ERROR_MESSAGE",
            payload:
              "Une erreur s'est produite ou vous ne pouvez pas effectuer cette recherche",
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          dispatch({
            type: "SET_NOTE_ERROR",
            payload: true,
          });
        } else {
          dispatch({
            type: "NOTE_FETCHING",
            payload: false,
          });
          dispatch({
            type: "LOAD_LISTE_NOTE",
            payload: data.notes,
          });
        }
      });
  } catch (error) {
    console.log("ERROR");
  }
};

export const getTotalSearchNotes = (classe, asc, val) => (dispatch) => {
  dispatch({
    type: "SET_NOTE_ERROR",
    payload: false,
  });
  dispatch({
    type: "SET_NOTE_ERROR_MESSAGE",
    payload: "",
  });
  fetch(
    `http://localhost:5001/note/total/research=${val}/asc=${asc}/classe=${classe}`
  )
    .then((response) => {
      if (!response.ok) {
        dispatch({
          type: "NOTE_FETCHING",
          payload: false,
        });
        dispatch({
          type: "SET_NOTE_ERROR",
          payload: true,
        });
        dispatch({
          type: "SET_NOTE_ERROR_MESSAGE",
          payload:
            "Une erreur s'est produite ou vérifier votre connexion internet",
        });
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        dispatch({
          type: "SET_NOTE_ERROR",
          payload: true,
        });
      } else {
        if (Number(data.count) > 0) {
          dispatch({
            type: "CHANGE_PAGINATION_NOTE",
            payload: divisionEntiere(Number(data.count)),
          });
        } else {
          dispatch({
            type: "CHANGE_PAGINATION_NOTE",
            payload: 1,
          });
        }
      }
    });
};
