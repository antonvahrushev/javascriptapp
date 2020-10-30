import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router';
import { validateReducer } from 'redux-revalidate';
import loginDialog from "./loginDialog";
import notifier from './notifier';
import appUI from './appUI';
import advert from './advert';
import payment from './payment';
import validateAdvert from './advertValidator';
import validatePayment from './paymentValidator';
import admin from './admin';

const createRootReducer = (history) => combineReducers({ 
    router: connectRouter(history),
    loginDialog,
    notifier,
    appUI,
    advert: validateReducer( // see the comment below
        validateAdvert, { errorKey: 'advertErrors' }
      )(advert),
    payment: validateReducer(
      validatePayment, { errorKey: 'paymentErrors' }
    )(payment),
    admin
});

/* redux will apply regular reducer "advert" and then "validateAdvert".
Example how validateAdvert fills the advert errors state with four errors:
store.getState().advert.advertErrors = {
    advertiserName: 'Skriv minst två bokstäver',
    selectedPublishTime: 'Pris är en obligatoriska fält',
    fieldsMetaData: {
      13994: "Obligatoriska fält",
      13995: "ANNONSTEXT (max 10 rader - ca 256 tecken)"
    }
}
*/

export default createRootReducer;
