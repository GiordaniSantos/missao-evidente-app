import { Alert } from 'react-native'

function showError(err) {
    Alert.alert('Ops! Ocorreu um problema!', `Mensagem: ${err}`)
}

function showSuccess(msg) {
    Alert.alert('Sucesso!', msg)
}

export { showError, showSuccess }