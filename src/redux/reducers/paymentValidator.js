import {
    combineValidators,
    isRequired,
} from 'revalidate';

export default combineValidators({
    selectedPaymentMethod: isRequired({ message: 'Betalsätt är en obligatoriska fält' }),
});