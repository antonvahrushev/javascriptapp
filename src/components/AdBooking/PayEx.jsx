import React from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { goBack } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
import { startPayEx } from '../../redux/actions/payment';
import Typography from '@material-ui/core/Typography';
import { PAYEX_CONTAINER_ID } from '../../constants';
import { getPathname } from '../../utils';

const styles = theme => ({
    root: {
        padding: theme.spacing(1),
    },
    header: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    divider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    }
});

class PayEx extends React.Component {
    componentDidMount() {
        if (this.props.selectedPaymentMethod) {
            this.props.startPayEx(this.props.match.params.adParentId);
        }
    }

    render() {
        const { classes } = this.props;

        if (!this.props.selectedPaymentMethod) {
            return <Redirect to={getPathname(1, this.props.match.params.adParentId)} />;
        }

        return (
            <Paper className={classes.root} elevation={0} square>
                <Typography variant="h6" className={classes.header} >
                    Swedbank Pay
                </Typography>
                <div id={PAYEX_CONTAINER_ID} />
                <Divider className={classes.divider} />
                <div className={classes.flexGrow}>
                    <Button variant="outlined" onClick={this.props.goBack} >
                        Tidigare
                    </Button>
                </div>
            </Paper>
        )
    }
}

const mapStateToProps = state => ({
    selectedPaymentMethod: state.payment.selectedPaymentMethod
});

export default connect(mapStateToProps, { startPayEx, goBack })(withStyles(styles)(PayEx));