import React from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import CategoryPanel from './CategoryPanel';
import BookingContent from './BookingContent';
import PreviewPanel from './PreviewPanel';
import ContactPanel from './ContactPanel';
import { Button } from '@material-ui/core';
import ValidationSummaryPanel from './ValidationSummaryPanel';
import { Collapse } from '@material-ui/core';
import LawRuleContentPanel from './LawRuleContentPanel';
import { goToPayment } from '../../redux/actions/payment';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
    },
    divider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    buttonsRoot: {
        display: 'flex',
    },
    flexGrow: {
        flexGrow: 1
    }
}))

function AdBookingPage({ showLawRuleContent, goToPayment, adParentId }) {
    const classes = useStyles();

    function goToPaymentOnSubmit(e) {
        e.preventDefault();
        goToPayment(adParentId);
    }

    function goToPaymentOnClick() {
        goToPayment(adParentId);
    }

    return (<>
        <Paper className={classes.root} elevation={0} square>
            <Collapse in={showLawRuleContent} timeout={1}>
                <LawRuleContentPanel />
            </Collapse>
            <Collapse in={!showLawRuleContent} timeout={1}>
                <form onSubmit={ goToPaymentOnSubmit }> {/* the form and the input below are for having "Next" and "Submit" buttons on a mobile virtual keyboard */}
                    <input type="submit" value="Submit" style={{ display: 'none' }} />
                    <CategoryPanel />
                    <Divider className={classes.divider} />
                    <ValidationSummaryPanel />
                    <ContactPanel />
                    <Divider className={classes.divider} />
                    <BookingContent />
                    <Divider className={classes.divider} />
                    <PreviewPanel />
                    <Divider className={classes.divider} />
                    <div className={classes.buttonsRoot}>
                        <div className={classes.flexGrow} />
                        <div>
                            <Button variant="outlined" color="primary" onClick={goToPaymentOnClick}>
                                Nästa
                            </Button>
                        </div>
                    </div>
                </form>
            </Collapse>
        </Paper></>
    )
}

const mapStateToProps = state => ({
    showLawRuleContent: state.advert.showLawRuleContent
})

export default connect(mapStateToProps, {goToPayment})(AdBookingPage);