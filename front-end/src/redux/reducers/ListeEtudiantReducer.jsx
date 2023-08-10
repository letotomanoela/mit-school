const INITIAL_STATE = {
  activeClasse: "6450d395c1f8f4dd5479c28a",
  asc: "2022-2023",
  skip: 1,
  pagination: 1,
  listeEtudiant: [],
  searchValue: "",
  isFetching: false,
  error: false,
  errorMessage: "",
};

function ListeEtudiantReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_CLASSE":
      return {
        ...state,
        activeClasse: action.payload,
      };

    case "LOAD_LISTE_ETUDIANT":
      return {
        ...state,
        listeEtudiant: action.payload,
      };

    case "CHANGE_PAGINATION":
      return {
        ...state,
        pagination: action.payload,
      };

    case "CHANGE_SKIP":
      return {
        ...state,
        skip: action.payload,
      };
    case "FETCHING_ETUDIANT":
      return {
        ...state,
        isFetching: action.payload,
      };

    case "SET_ETUDIANT_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_ETUDIANT_ERROR_MESSAGE":
      return {
        ...state,
        errorMessage: action.payload,
      };
  }

  return state;
}

export default ListeEtudiantReducer;

export const getEtudiant = (classe, asc, skip) => (dispatch) => {
  dispatch({
    type: "FETCHING_ETUDIANT",
    payload: true,
  });
  dispatch({
    type: "SET_ETUDIANT_ERROR",
    payload: false,
  });
  dispatch({
    type: "SET_ETUDIANT_ERROR_MESSAGE",
    payload: "",
  });
  try {
    fetch(
      `http://localhost:5001/etudiant/classe/${classe}/${asc}/skip=${
        (Number(skip) - 1) * 10
      }`
    )
      .then((response) => {
        if (!response.ok) {
          dispatch({
            type: "SET_ETUDIANT_ERROR",
            payload: true,
          });
          dispatch({
            type: "FETCHING_ETUDIANT",
            payload: false,
          });
          dispatch({
            type: "SET_ETUDIANT_ERROR_MESSAGE",
            payload:
              "Erreur provenant du serveur ou vérifier votre connexion internet",
          });
        }
        return response.json();
      })
      .then((data) => {
        dispatch({
          type: "FETCHING_ETUDIANT",
          payload: false,
        });
        if (data.success) {
          dispatch({
            type: "LOAD_LISTE_ETUDIANT",
            payload: data.etudiant,
          });
        } else {
          dispatch({
            type: "LOAD_LISTE_ETUDIANT",
            payload: data.etudiant,
          });
        }
      });
  } catch (error) {
    console.log(error);
  }
};
export const searchEtudiant = (classe, asc, searchVal, skip) => (dispatch) => {
  dispatch({
    type: "FETCHING_ETUDIANT",
    payload: true,
  });
  dispatch({
    type: "SET_ETUDIANT_ERROR",
    payload: false,
  });
  dispatch({
    type: "SET_ETUDIANT_ERROR_MESSAGE",
    payload: "",
  });
  fetch(
    `http://localhost:5001/etudiant/search/${asc}/${classe}/${searchVal}/skip=${
      Number(skip) - 1
    }`
  )
    .then((res) => {
      if (!res.ok) {
        dispatch({
          type: "SET_ETUDIANT_ERROR",
          payload: true,
        });
        dispatch({
          type: "FETCHING_ETUDIANT",
          payload: false,
        });
        dispatch({
          type: "SET_ETUDIANT_ERROR_MESSAGE",
          payload:
            "Vous ne pouvez pas effectuer cette recherche",
        });
      }
      return res.json();
    })
    .then((data) => {
      dispatch({
        type: "FETCHING_ETUDIANT",
        payload: false,
      });
      if (data.success) {
        dispatch({
          type: "LOAD_LISTE_ETUDIANT",
          payload: data.etudiant,
        });
      } else {
        if (data.error) {
          dispatch({
            type: "SET_ETUDIANT_ERROR",
            payload: true,
          });
        } else {
          dispatch({
            type: "LOAD_LISTE_ETUDIANT",
            payload: data.etudiant,
          });
        }
      }
    });
};
function divisionEntiere(nombre) {
  let division = Math.floor(nombre / 10); // Division entière par 10
  let reste = nombre % 10; // Reste de la division par 10

  if (reste > 0) {
    division++; // Ajouter 1 si le reste est supérieur à 0
  }

  return division;
}
export const getTotalEtudiant = (classe, asc) => (dispatch) => {
  dispatch({
    type: "SET_ETUDIANT_ERROR",
    payload: false,
  });
  dispatch({
    type: "SET_ETUDIANT_ERROR_MESSAGE",
    payload: "",
  });
  fetch(
    `http://localhost:5001/etudiant/nombre/total/asc/${asc}/classe/${classe}`
  )
    .then((res) => {
      if (!res.ok) {
        dispatch({
          type: "SET_ETUDIANT_ERROR",
          payload: true,
        });
        dispatch({
          type: "FETCHING_ETUDIANT",
          payload: false,
        });
        dispatch({
          type: "SET_ETUDIANT_ERROR_MESSAGE",
          payload:
            "Erreur provenant du serveur ou vérifier votre connexion internet",
        });
      }
      return res.json();
    })
    .then((data) => {
      if (Number(data.count) > 0) {
        dispatch({
          type: "CHANGE_PAGINATION",
          payload: divisionEntiere(Number(data.count)),
        });
      } else {
        dispatch({
          type: "CHANGE_PAGINATION",
          payload: 1,
        });
      }
    });
};

export const totalSearchEtudiant = (classe, asc, value) => (dispatch) => {
  dispatch({
    type: "SET_ETUDIANT_ERROR",
    payload: false,
  });
  dispatch({
    type: "SET_ETUDIANT_ERROR_MESSAGE",
    payload: "",
  });
  fetch(`http://localhost:5001/etudiant/total/search/${asc}/${classe}/${value}`)
    .then((res) => {
      if (!res.ok) {
        dispatch({
          type: "SET_ETUDIANT_ERROR",
          payload: true,
        });
        dispatch({
          type: "FETCHING_ETUDIANT",
          payload: false,
        });
        dispatch({
          type: "SET_ETUDIANT_ERROR_MESSAGE",
          payload:
            "Erreur provenant du serveur ou vérifier votre connexion internet",
        });
      }
      return res.json();
    })
    .then((data) => {
      if (Number(data.count) > 0) {
        dispatch({
          type: "CHANGE_PAGINATION",
          payload: divisionEntiere(Number(data.count)),
        });
      } else {
        dispatch({
          type: "CHANGE_PAGINATION",
          payload: 1,
        });
      }
    });
};
