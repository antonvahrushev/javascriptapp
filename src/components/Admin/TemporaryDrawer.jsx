import React from 'react';
import { connect } from "react-redux";
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import Admin from '../../services/admin'
import { closeDrawer } from '../../redux/actions/appUI';
import { logOutAdmin } from "../../redux/actions/loginDialog";

function TemporaryDrawer({ isDrawerOpened, userDisplayedName, closeDrawer, logOutAdmin }) {

    function logOut() {
        closeDrawer();
        logOutAdmin();
    }

    return (
        <Drawer anchor="right" open={isDrawerOpened} onClose={closeDrawer}>
            <div>
                <IconButton onClick={closeDrawer}>
                    <ChevronRightIcon />
                </IconButton>
                <Typography display="inline" variant="subtitle2" color="inherit">
                    {userDisplayedName}
                </Typography>
            </div>
            <Divider />
            <List>
                <ListItem button onClick={logOut}>
                    <ListItemIcon>
                        <AccountCircle />
                    </ListItemIcon>
                    <ListItemText primary={'Logout'} />
                </ListItem>
            </List>
        </Drawer>
    )
}

const mapStateToProps = state => ({
        isDrawerOpened: state.appUI.isDrawerOpened,
        userDisplayedName: state.loginDialog.userDisplayedName || Admin.getUserName()
})

const dispatchToProps = { closeDrawer, logOutAdmin };

export default connect(mapStateToProps, dispatchToProps)(TemporaryDrawer);