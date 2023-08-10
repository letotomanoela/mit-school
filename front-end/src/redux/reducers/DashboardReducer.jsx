const INITIAL_STATE = {
  generalStatsNumber: null,
  nombre_etudiant_par_classe: null,
  nombre_matiere_par_classe: null,
  nombre_etudiant_moyenne_matiere: null,
  isFetching: false,
  nombre_etudiant_pie: null,
  nombre_matiere_pie: null,
  nombre_etudiant_bar: null,

  activeClasse: "L1",
  active_bar_moyenne: null,
  active_bar_opt: null,
  semestre: "1",
};

function DashboardReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "STATS_NUMBER":
      return {
        ...state,
        generalStatsNumber: [
          {
            extra: "bg-slate-100",
            title: "Nombres des étudiants",
            number: action.payload.etudiant,
            icon: "students",
          },
          {
            extra: "bg-slate-100",
            title: "Nombres des classes",
            number: action.payload.classe,
            icon: "teachers",
          },
          {
            extra: "bg-slate-100",
            title: "Nombres des matières",
            number: action.payload.matiere,
            icon: "courses",
          },
          {
            extra: "bg-slate-100",
            title: "Nombres des notes",
            number: action.payload.notes,
            icon: "reviews",
          },
        ],
        nombre_etudiant_par_classe: action.payload.etudiantsParClasseAvecNom,
        nombre_matiere_par_classe: action.payload.matiereParClasseAvecNom,
        nombre_etudiant_moyenne_matiere:
          action.payload.etudiantMoyenneParMatiereParClasse,
      };

    case "STATS_FETCHING":
      return {
        ...state,
        isFetching: action.payload,
      };

    case "NOMBRE_ETUDIANT_PIE":
      return {
        ...state,
        nombre_etudiant_pie: action.payload,
        nombre_etudiant_bar: [
          {
            name: "Nombre des étudiants",
            data: action.payload,
          },
        ],
      };
    case "NOMBRE_MATIERE_PIE":
      return {
        ...state,
        nombre_matiere_pie: action.payload,
      };

    case "NOMBRE_MOYENNE_PAR_MATIERE_CLASSE":
      let data = [];
      let matiere = [];
      let tab1 = [...action.payload.bigData];
      tab1.forEach((t) => {
        if (
          t.nomClasse === action.payload.activeClasse &&
          t.semestre === action.payload.semestre
        ) {
          data.push(t._count);
          matiere.push(t.acronyme);
        }
      });
      
      return {
        ...state,
        active_bar_moyenne: [{
            name: "Nombre des étudiants",
            data,
          }],
        active_bar_opt: {
            chart: {
              toolbar: {
                show: false,
              },
            },
            tooltip: {
              style: {
                fontSize: "12px",
                fontFamily: undefined,
                backgroundColor: "#000000",
              },
              onDatasetHover: {
                style: {
                  fontSize: "12px",
                  fontFamily: undefined,
                },
              },
              theme: "dark",
            },
            xaxis: {
              categories: [...matiere],
              show: true,
              labels: {
                show: true,
                style: {
                  colors: "#A3AED0",
                  fontSize: "14px",
                  fontWeight: "500",
                },
              },
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
            },
            yaxis: {
              show: false,
              color: "black",
              labels: {
                show: true,
                style: {
                  colors: "#CBD5E0",
                  fontSize: "14px",
                },
              },
            },
            grid: {
              show: false,
              strokeDashArray: 5,
              yaxis: {
                lines: {
                  show: true,
                },
              },
              xaxis: {
                lines: {
                  show: false,
                },
              },
            },
            fill: {
              type: "gradient",
              gradient: {
                type: "vertical",
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                colorStops: [
                  [
                    {
                      offset: 0,
                      color: "#1d8cf8",
                      opacity: 1,
                    },
                    {
                      offset: 50,
                      color: "#3358f4",
                      opacity: 0.9,
                    },
                    {
                      offset: 100,
                      color: "#1d8cf89",
                      opacity: 0.8,
                    },
                  ],
                ],
              },
            },
            dataLabels: {
              enabled: false,
            },
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: "40px",
              },
            },
          },
      };

    case "CHANGE_CLASSE_BAR":
      return{
        ...state,
        activeClasse:action.payload
      }

      
  }

  return state;
}

export default DashboardReducer;

export const getStats = (classe, sem) => (dispatch) => {
  dispatch({
    type: "STATS_FETCHING",
    payload: true,
  });

  fetch(`http://localhost:5001/stats/generalStats`)
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      dispatch({
        type: "STATS_FETCHING",
        payload: false,
      });
      if (json.success) {
        // console.log(json);
        dispatch({
          type: "STATS_NUMBER",
          payload: json,
        });
        let etudiantParClasse = [];
        let matiereParClasse = [];
        let tab1 = [...json.etudiantsParClasseAvecNom];
        let tab2 = [...json.matiereParClasseAvecNom];

        tab1.forEach((t) => {
          etudiantParClasse.push(t._count);
        });
        // console.log(tab2);
        tab2.forEach((t) => {
          matiereParClasse.push(t._count);
        });

        // console.log(matiereParClasse);

        dispatch({
          type: "NOMBRE_ETUDIANT_PIE",
          payload: etudiantParClasse,
        });

        dispatch({
          type: "NOMBRE_MATIERE_PIE",
          payload: matiereParClasse,
        });

        dispatch({
          type: "NOMBRE_MOYENNE_PAR_MATIERE_CLASSE",
          payload: {
            activeClasse: classe,
            semestre: sem,
            bigData: json.etudiantMoyenneParMatiereParClasse,
          },
        });
      }
    });
};
