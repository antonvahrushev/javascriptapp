import React from 'react';
import { connect } from "react-redux";
import { goBack } from 'connected-react-router';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import SelectField from '../common/SelectField';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { goToPayEx } from '../../redux/actions/payment';
import { changeCoupon, changePaymentMethod } from '../../redux/actions/payment';
import { getPathname } from '../../utils';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
    },
    item: {
        paddingBottom: theme.spacing(2),
    },
    row: {
        padding: theme.spacing(1),
    },
    buttons: {
        display: 'flex',
    },
    flexGrow: {
        flexGrow: 1
    },
    header: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    divider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }
}))

function PaymentPanel({ match, coupon, couponError, publishTimes, selectedPublishTime, selectedPaymentMethod, paymentMethods, paymentErrors, changeCoupon, changePaymentMethod, goToPayEx, goBack }) {
    const classes = useStyles();
    const publishTime = publishTimes.find(time => time.publishTimeText == selectedPublishTime) || {};

    if (!selectedPublishTime) {
        return <Redirect to={getPathname(1, match.params.adParentId)} />;
    }
    
    function goToPayExOnSubmit(e) {
        e.preventDefault();
        goToPayEx();
    }

    return (
        <Paper className={classes.root} elevation={0} square>
        <form onSubmit={ goToPayExOnSubmit }> {/* the form and the input below are for having "Next" and "Submit" buttons on a mobile virtual keyboard */}
            <input type="submit" value="Submit" style={{ display: 'none' }} />
            <Typography variant="h6" className={classes.header} >
                Betalning
            </Typography>
            <TextField className={classes.item}
                error={!!couponError}
                helperText={couponError}
                fullWidth
                variant="outlined"
                label="Kupong"
                value={coupon}
                onChange={(event) => changeCoupon(event.target.value)}
            />
            <SelectField className={classes.item}
                error={paymentErrors.selectedPaymentMethod}
                label="Betalsätt"
                items={paymentMethods}
                value={selectedPaymentMethod}
                onChange={changePaymentMethod} />
            <Typography variant="subtitle2" className={classes.row}>
                Din beställning
            </Typography>
            <Divider />
            <Typography align="right" variant="body2" className={classes.row}>
                {publishTime.totalPriceText}
            </Typography>
            <Typography align="right" variant="body2" className={classes.row}>
                {publishTime.vatText}
            </Typography>
            <Divider className={classes.divider} />
            <div className={classes.buttons}>
                <div className={classes.flexGrow}>
                    <Button variant="outlined" onClick={goBack}>
                        Tidigare
                    </Button>
                </div>
                <div>
                    <Button variant="outlined" color="primary" onClick={goToPayEx}>
                        Slutför och betala
                    </Button>
                </div>
            </div>
        </form>
        </Paper>
    )
}

const mapStateToProps = state => ({
    publishTimes: state.advert.publishTimes,
    selectedPublishTime: state.advert.selectedPublishTime,
    coupon: state.payment.coupon || '',
    couponError: state.payment.couponError,
    selectedPaymentMethod: state.payment.selectedPaymentMethod || '',
    paymentMethods: state.advert.paymentMethods,
    paymentErrors: state.payment.paymentErrors || {}
})

// bad idea but I have just tried this way
const mapDispatchToProps = (dispatch, ownProps) => ({
        goToPayEx: () => dispatch(goToPayEx(ownProps.match.params.adParentId)),
        changeCoupon: (value) => dispatch(changeCoupon(value)),
        changePaymentMethod: (paymentMethod) => dispatch(changePaymentMethod(paymentMethod)),
        goBack: () => dispatch(goBack())
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPanel);