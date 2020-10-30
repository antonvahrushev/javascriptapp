import React from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(theme => ({
}));

function Header({ isProgress }) {
    const classes = useStyles();
    return (
        <AppBar position="fixed" className={classes.root}>
            { isProgress ? <LinearProgress /> : null }
        </AppBar>
    )
}

const mapStateToProps = state => ({
        isProgress: state.appUI.isProgress,
});

const dispatchToProps = { };

export default connect(mapStateToProps, dispatchToProps)(Header);