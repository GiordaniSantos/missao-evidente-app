import SweetAlert from 'react-native-sweet-alert';

const Alert = (text, estilo) => {
    SweetAlert.showAlertWithOptions({
        //title: 'Sucesso!',
        subTitle: text,
        confirmButtonTitle: 'OK',
        otherButtonTitle: 'Cancel',
        style: estilo,
        cancellable: true
    }/*, callback => this.loadVisitasHospital()*/);
}

export default Alert