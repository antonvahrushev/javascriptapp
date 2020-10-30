import React from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { saveCategory } from '../../redux/actions/admin';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    flexGrow: {
        flexGrow: 1
    }
}))

function ButtonsPanel({ isCategoryChanged, userAllowed, saveCategory }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div className={classes.flexGrow}>
            </div>
            <div>
                <Button variant="outlined" color="primary" onClick={saveCategory} disabled={!(isCategoryChanged && userAllowed)}>
                    Spara
                </Button>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    isCategoryChanged: state.admin.isCategoryChanged,
    userAllowed: state.admin.userAllowed
})

export default connect(mapStateToProps, { saveCategory })(ButtonsPanel);