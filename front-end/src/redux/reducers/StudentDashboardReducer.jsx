const INITIAL_STATE = {
  data: null,
  isFetching: false,
  error: null,
  lineChartData: null,
  lineChartOptions: null,
  semestre: "1",
};
function StudentDashboardReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "STUDENT_LOAD_DATA":
      return {
        ...state,
        data: action.payload,
      };
    case "STUDENT_LOAD_DATA_FETCHING":
      return {
        ...state,
        isFetching: action.payload,
      };
    case "STUDENT_LOAD_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "STUDENT_LINE_CHART":
      return {
        ...state,
        lineChartData: action.payload.lineChartData,
        lineChartOptions: action.payload.lineChartOptions,
      };

    case "CHANGE_SEMESTRE_DASHBOARD_ETUDIANT":
      return {
        ...state,
        semestre: action.payload,
      };
  }
  return state;
}

export default StudentDashboardReducer;

export const getData = (e, semestre) => (dispatch) => {
  dispatch({
    type: "STUDENT_LOAD_ERROR",
    payload: null,
  });
  dispatch({
    type: "STUDENT_LOAD_DATA_FETCHING",
    payload: true,
  });
  fetch(`http://localhost:5001/note/etudiant/${e}/asc/2022-2023`)
    .then((res) => {
      if (!res.ok) {
        dispatch({
          type: "STUDENT_LOAD_DATA_FETCHING",
          payload: false,
        });
        return dispatch({
          type: "STUDENT_LOAD_ERROR",
          payload: "Une erreur s'est produite",
        });
      }
      return res.json();
    })
    .then((json) => {
      dispatch({
        type: "STUDENT_LOAD_DATA_FETCHING",
        payload: false,
      });
      if (json.success) {
        dispatch({
          type: "STUDENT_LOAD_DATA",
          payload: json.data,
        });
        let matieres = [...json.data.notes];
        let tabData = [];
        let tabLabels = [];
        matieres.forEach((mat) => {
          if (mat.semestre === semestre) {
            let val = mat.noteValue;
            if (val === null) val = 0;
            tabLabels.push(mat.matiere.acronyme);
            tabData.push(mat.noteValue);
          }
        });

        dispatch({
          type: "STUDENT_LINE_CHART",
          payload: {
            lineChartData: [
              {
                name: "Note",
                data: tabData,
                color: "#4318FF",
              },
            ],
            lineChartOptions: {
              legend: {
                show: true,
              },

              theme: {
                mode: "light",
              },
              chart: {
                type: "line",

                toolbar: {
                  show: false,
                },
              },

              dataLabels: {
                enabled: false,
              },
              stroke: {
                curve: "smooth",
              },

              tooltip: {
                style: {
                  fontSize: "12px",
                  fontFamily: undefined,
                  backgroundColor: "#000000",
                },
                theme: "dark",
                x: {
                  format: "dd/MM/yy HH:mm",
                },
              },
              grid: {
                show: false,
              },
              xaxis: {
                axisBorder: {
                  show: false,
                },
                axisTicks: {
                  show: false,
                },
                labels: {
                  style: {
                    colors: "#A3AED0",
                    fontSize: "12px",
                    fontWeight: "500",
                  },
                },
                type: "text",
                range: undefined,
                categories: tabLabels,
              },

              yaxis: {
                show: false,
              },
            },
          },
        });
      } else {
        return dispatch({
          type: "STUDENT_LOAD_ERROR",
          payload: "Une erreur s'est produite",
        });
      }
    });
};
