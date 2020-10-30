import React from 'react';
import { render } from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import App from './components/App';
import { SnackbarProvider } from 'notistack';
import configureStore from './redux/store';
import { Provider } from 'react-redux';

import MomentUtils from '@date-io/moment';
import moment from 'moment';
import 'moment/locale/sv';
moment.locale('sv');

const store = configureStore(/* provide initial state if any */);

const theme = createMuiTheme({
    palette: {
        // primary: {
        //     main: '#00afad'
        // },
    },
    typography: {
        // button: {
        //     fontWeight: 600
        // }
    }
});

render(
    <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={'sv'}>
            <SnackbarProvider maxSnack={3}>
                <Provider store={store}>
                    <App />
                </Provider>
            </SnackbarProvider>
        </MuiPickersUtilsProvider>
    </MuiThemeProvider>,
    document.getElementById('container')
);

if (process.env.NODE_ENV === 'development') {    
    module.hot.accept();
}