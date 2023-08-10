import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import SidebarReducer from "./reducers/SidebarReducer";
import titlePageReducer from "./reducers/titlePageReducer";
import NavbarReducer from "./reducers/NavbarReducer";
import ListeEtudiantReducer from "./reducers/ListeEtudiantReducer";
import ListeNoteReducer from "./reducers/ListeNoteReducer";
import AuthReducer from "./reducers/AuthReducer";
import MatiereReducer from "./reducers/MatiereReducer";
import DashboardReducer from "./reducers/DashboardReducer";
import StudentDashboardReducer from "./reducers/StudentDashboardReducer";


const rootReducer = combineReducers({
  SidebarReducer,
  titlePageReducer,
  NavbarReducer,
  ListeEtudiantReducer,
  ListeNoteReducer,
  AuthReducer, 
  MatiereReducer,
  DashboardReducer,
  StudentDashboardReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
