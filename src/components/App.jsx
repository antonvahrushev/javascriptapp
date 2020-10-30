import React from 'react';
import { Route, Switch, Redirect, Prompt } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '../redux/store';
import { connect } from "react-redux";
import CssBaseline from '@material-ui/core/CssBaseline';
import ErrorBoundary from './ErrorBoundary';
import Notifier from './Notifier';
import Login from './Login';
import AdminLogin from './Admin/Login';
import ContentBoundary from './ContentBoundary';
import Header from './Header';
import Admin from './Admin';
import AdminService from '../services/admin';
import { WIZARD_STEPS } from '../constants';
import PaymentPanel from './AdBooking/PaymentPanel';
import FinishPanel from './AdBooking/FinishPanel';
import AdBooking from './AdBooking';
import PayEx from './AdBooking/PayEx';
import { returnToPayment } from '../redux/actions/payment';
import { getStepNumber } from '../utils';

// A wrapper for <Route> that redirects to the login
// screen if you're not authenticated yet.
function PrivateRoute({ children, roles, ...rest }) {
    return (
        <Route {...rest} render={({ location, ...routeRest }) =>
            AdminService.isAuthenticated() && roles.indexOf(AdminService.getRole()) > -1
                ? children(routeRest)
                : <Redirect to={{ pathname: "/admin/login", state: { authRedirect: location } }} />
        }
        />
    );
}

function App(props) {
    let from = location.pathname;

    /*
    Allows navigating by form buttons like "Slutför och betala", "Tidigare" etc.
    Denies going forward by browser button
    Allows going back by browser button
    Performs action returnToPayment on going back from <id>/payex to <id>/payment
    Denies going back after finish payment
    */
    function isNavigationAllowed(location, action) {
        if (action === 'PUSH') {
            from = location.pathname;
            return true; // allows navigating by form buttons like "Slutför och betala", "Tidigare" etc
        }

        const numberFrom = getStepNumber(from);
        const numberTo = getStepNumber(location.pathname);

        if (!numberFrom || !numberTo) return true; // wrong paths

        if (numberTo < numberFrom) { // back button
            if (numberFrom === WIZARD_STEPS.PAYEX.step && numberTo === WIZARD_STEPS.PAYMENT.step) { // back from /10944/payex to /10944/payment
                props.returnToPayment();
            }

            if (numberFrom === WIZARD_STEPS.FINISH.step) return false; // do not go back after finish payment

            from = location.pathname;
            return true; // allow navigating with "back" but not "forward" button
        }

        return false; // navigation with "forward" button not allowed
    }

    return <ConnectedRouter history={history}>
        <ErrorBoundary>
            <CssBaseline />
            <Notifier />
            <Login />
            <Header />
            <ContentBoundary>
                <Prompt when={true} message={isNavigationAllowed} />
                <Switch>
                    <Route path='/admin' exact={true}>
                        <Redirect to='/admin/65197' />
                    </Route>
                    <Route path='/admin/login' component={AdminLogin} exact={true} />
                    <PrivateRoute path="/admin/:adParentId" exact roles={["AdBooker2020Admin"]}>
                        {(props) => <Admin {...props} />}
                    </PrivateRoute>                   

                    <Route path='/' exact={true}>
                        <Redirect to='/65197' />
                    </Route>
                    <Route path={WIZARD_STEPS.BOOKING.path} component={AdBooking} exact={true} />
                    <Route path={WIZARD_STEPS.PAYMENT.path} component={PaymentPanel} exact={true} />
                    <Route path={WIZARD_STEPS.PAYEX.path} component={PayEx} exact={true} />
                    <Route path={WIZARD_STEPS.FINISH.path} component={FinishPanel} exact={true} />
                </Switch>
            </ContentBoundary>
        </ErrorBoundary>
    </ConnectedRouter>
}

export default connect(null, { returnToPayment })(App);