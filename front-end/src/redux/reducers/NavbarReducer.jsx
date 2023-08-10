const INITIAL_STATE = {
    activeNav:""
}

function NavbarReducer(state = INITIAL_STATE,action){
    switch(action.type){
        case "CHANGE_ACTIVE_NAV":
            return{
                ...state,
                activeNav:action.payload
            }
    }


    return state
}

export default NavbarReducer