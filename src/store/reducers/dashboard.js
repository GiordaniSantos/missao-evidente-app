import { SET_DASHBOARD, SET_REFRESHING, SET_PARAMS_ANO_RELATORIO, SET_PARAMS_MES_RELATORIO, SET_PARAMS_DEFAULT_RELATORIO } from "../actions/actionTypes";

const initialState = {
    visitaCrente: 0,
    visitaNaoCrente: 0,
    visitaPresidio: 0,
    visitaEnfermo: 0,
    visitaHospital: 0,
    visitaEscola: 0,
    batismosInfantis: 0,
    batismosProfissoes: 0,
    bencoesNupciais: 0,
    santasCeias: 0,
    estudos: 0,
    sermoes: 0,
    estudosBiblicos: 0,
    discipulados: 0,
    comungante: 0,
    naoComungante: 0,
    loading: true,
    refresh: false,
    membresias: {},
    mes: new Date().getMonth()+1,
    ano: new Date().getFullYear(),
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DASHBOARD:
            return {
                ...state,
                visitaCrente: action.payload.crentes,
                membresias: action.payload.membresias,
                visitaCrente: action.payload.crentes,
                visitaNaoCrente: action.payload.incredulos,
                visitaPresidio: action.payload.presidios,
                visitaEnfermo: action.payload.enfermos,
                visitaHospital: action.payload.hospitais,
                visitaEscola: action.payload.escolas,
                batismosInfantis: action.payload.batismosInfantis,
                batismosProfissoes: action.payload.batismosProfissoes,
                bencoesNupciais: action.payload.bencoesNupciais,
                santasCeias: action.payload.santasCeias,
                estudos: action.payload.estudos,
                sermoes: action.payload.sermoes,
                estudosBiblicos: action.payload.estudosBiblicos,
                discipulados: action.payload.discipulados,
                comungante: action.payload.comungante,
                naoComungante: action.payload.naoComungante,
                loading: false,
                refresh: false
            }
        case SET_REFRESHING:
            return {
                ...state,
                refresh: true
            }
        case SET_PARAMS_ANO_RELATORIO:
            return {
                ...state,
                ano: action.payload.ano
            }
        case SET_PARAMS_MES_RELATORIO:
            return {
                ...state,
                mes: action.payload.mes
            }
        case SET_PARAMS_DEFAULT_RELATORIO:
            return {
                ...state,
                mes: initialState.mes,
                ano: initialState.ano
            }
        default:
            return state
    }
}

export default reducer