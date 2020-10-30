import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        // minHeight: 'calc(100vh - ' + theme.spacing(7 * 2) + 'px)',
        // [theme.breakpoints.up('sm')]: {
        //     minHeight: 'calc(100vh - ' + theme.spacing(8 * 2) + 'px)',
        //     marginTop: theme.spacing(8),
        // },
        maxWidth:  theme.breakpoints.values.sm,
        marginLeft: 'auto',
        marginRight: 'auto',
    }
});

class ContentBoundary extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                {this.props.children}
            </div>
        );
    }
}

export default withStyles(styles)(ContentBoundary);