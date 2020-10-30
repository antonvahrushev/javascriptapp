import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from "react-redux";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { closeMenu } from '../../redux/actions/appUI';
import { logOutAdmin } from "../../redux/actions/loginDialog";

const useStyles = makeStyles(theme => ({
    popper: {
        zIndex: '1200',
    },
    menuItem: {
        width: theme.spacing(20)
    }
}));

function UserMenu ({ anchorEl, closeMenu, logOutAdmin }) {
    const classes = useStyles();
    const isMenuOpened = Boolean(anchorEl);

    function logOut() {
        closeMenu();
        logOutAdmin();
    }

    return (
        <Popper open={isMenuOpened} anchorEl={anchorEl} placement={'bottom-end'} transition className={classes.popper}>
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={150}>
                    <Paper>
                        <ClickAwayListener onClickAway={closeMenu}>
                            <MenuList>
                                <MenuItem onClick={logOut}>Logga ut</MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Fade>
            )}
        </Popper>
    )
}

const mapStateToProps = state => {
    return {
        anchorEl: state.appUI.anchorEl,
    };
};

const dispatchToProps = { closeMenu, logOutAdmin };

export default connect(mapStateToProps, dispatchToProps)(UserMenu);