import SweetAlert from 'react-native-sweet-alert';

const Alert = (text) => {
    SweetAlert.showAlertWithOptions({
        //title: 'Sucesso!',
        subTitle: text,
        confirmButtonTitle: 'OK',
        otherButtonTitle: 'Cancel',
        style: 'success',
        cancellable: true
    }/*, callback => this.loadVisitasHospital()*/);
}

export default Alert