import { SET_DASHBOARD, SET_REFRESHING, SET_PARAMS_MES_RELATORIO, SET_PARAMS_ANO_RELATORIO, SET_PARAMS_DEFAULT_RELATORIO } from "./actionTypes";
import api from "../../services/api";
import { closeSplashScreen } from "./user";
import { setMessage } from "./message";

export const setDashboard = data => {
    return {
        type: SET_DASHBOARD,
        payload: data
    }
}

export const setRefreshingRelatorio = () => {
    return {
        type: SET_REFRESHING
    }
}

export const setParamsMesRelatorio = (mes) => {
    return {
        type: SET_PARAMS_MES_RELATORIO,
        payload: mes
    }
}

export const setParamsAnoRelatorio = (ano) => {
    return {
        type: SET_PARAMS_ANO_RELATORIO,
        payload: ano
    }
}

export const setParamsDefaultRelatorio = () => {
    return {
        type: SET_PARAMS_DEFAULT_RELATORIO
    }
}

export const fetchRelatorios = (mes = new Date().getMonth()+1, ano = new Date().getFullYear()) => {
    return async dispatch => {
        await api.get(`/dashboard?mes=${mes}&ano=${ano}`)
            .then(response => {
                dispatch(setDashboard(response.data));
            })
            .catch(e => {
                dispatch(setMessage({
                    type: 'error',
                    text: e.response.data.message
                }));
            });
            setTimeout(
                () => {dispatch(closeSplashScreen())},
                1000
            )
    }
}