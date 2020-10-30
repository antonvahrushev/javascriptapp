import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
    },
    content: {        
        color: theme.palette.error.main
    }
});

class ErrorBoundary extends React.Component {
    state = {
        hasError: false
    };

    componentDidCatch(error, info) {
        this.setState({
            hasError: true
        });
        // You can also log the error to an error reporting service
    }

    render() {
        const { classes } = this.props;
        if (this.state.hasError) {
            return (
                <div className={classes.root}>
                    <Typography className={classes.content} align='center' variant="h6">
                        Okänt fel.
                    </Typography>
                </div>
            )
        }
        // Normally, just render children
        return (
            <div className={classes.root}>
                {this.props.children}
            </div>
        );
    }
}

export default withStyles(styles)(ErrorBoundary);