import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuIcon from '@material-ui/icons/Menu';
import { openMenu, openDrawer } from '../../redux/actions/appUI';
import Admin from '../../services/admin'

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary
    },
    toolbar: {
        [theme.breakpoints.up('lg')]: {
            width: theme.breakpoints.values.lg,
            marginLeft: 'auto',
            marginRight: 'auto',
        }
    },
    toolbarLogo: {
        flexGrow: 1,
    },
    logo: {
        width: 180,
    },
    toolbarMenu: {       
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'block'
        },
    },
    iconMenu: {
        [theme.breakpoints.up('md')]: {
            display: 'none'
        },
    },
    menuItem: {
        paddingRight: theme.spacing(3)
    },
    userName: {
        marginLeft: theme.spacing(1),
    }
}));

function NavigationBar({ anchorEl, isProgress, userDisplayedName, openMenu, openDrawer }) {
    const classes = useStyles();
    const isMenuOpen = Boolean(anchorEl);
    return (
        <AppBar position="fixed" className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <div className={classes.toolbarLogo}>
                </div>
                <div className={classes.iconMenu}>
                    <IconButton className={classes.menuButton} 
                        color="inherit" 
                        aria-label="Menu"
                        onClick={openDrawer}
                        >
                        <MenuIcon />
                    </IconButton>
                </div>
                <div className={classes.toolbarMenu}>
                    <IconButton 
                        aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                        aria-haspopup="true"
                        onClick={(event) => openMenu(event.currentTarget)}
                        color="inherit"
                    >
                        <AccountCircle />
                        <Typography variant="subtitle2" className={classes.userName}>
                            {userDisplayedName}
                        </Typography>
                        <ExpandMoreIcon />
                    </IconButton>
                </div>
            </Toolbar>
            { isProgress ? <LinearProgress /> : null }
        </AppBar>
    )
}

const mapStateToProps = (state) => ({
    anchorEl: state.appUI.anchorEl,
    isProgress: state.appUI.isProgress,
    userDisplayedName: state.loginDialog.userDisplayedName || Admin.getUserName()
});

const dispatchToProps = { openMenu, openDrawer };

export default connect(mapStateToProps, dispatchToProps)(withRouter(NavigationBar));