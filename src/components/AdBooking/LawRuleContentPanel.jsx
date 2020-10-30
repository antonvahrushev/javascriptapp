import React from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { hideLawRuleContent } from '../../redux/actions/advert';
import { Typography, Fab } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        position: "relative",
        paddingTop: theme.spacing(5),
    },
    innerHtml: {
        '& a': {
            color: theme.palette.primary.main,
        }
    },
    closeIcon: {
        position: "absolute", top: "0", right: "0",
        cursor: 'pointer'
    }
}));

function LawRuleContentPanel({ lawRuleContent, hideLawRuleContent }) {
    const classes = useStyles();
    const htmlText = (lawRuleContent || '').replace(/(?:\r\n|\r|\n)/g, '<br />');
    return (
        <div className={classes.root}>
            <CloseIcon className={classes.closeIcon} fontSize='large' color="action" onClick={() => hideLawRuleContent()}/>
            <Typography>
                <span className={classes.innerHtml} dangerouslySetInnerHTML={{ __html: htmlText }} />
            </Typography>
        </div>
    )
}

const mapStateToProps = state => ({
    lawRuleContent: state.advert.lawRuleContent
})

export default connect(mapStateToProps, { hideLawRuleContent })(LawRuleContentPanel);
