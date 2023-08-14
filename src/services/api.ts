import { Platform } from 'react-native'
import axios from 'axios'

const url = Platform.OS === 'ios' ? 'http://localhost:8000/api' : 'http://10.0.2.2:8000/api'

const api = axios.create({
    baseURL: url,
})

export default api;