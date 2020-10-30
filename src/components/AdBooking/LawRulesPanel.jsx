import React from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import { Typography, Link } from '@material-ui/core';
import { showLawRuleContent } from '../../redux/actions/advert';

const useStyles = makeStyles(theme => ({
    root: {

    }
}))

function LawRulesPanel({ lawRules, showLawRuleContent }) {
    const classes = useStyles();

    const onShowLawContentClick = (event, content) => {
        event.preventDefault();
        showLawRuleContent(content);
    }

    return (
        <div className={classes.root}>
            {
                lawRules.map(rule => {
                    return (
                        <Typography key={rule.ruleId}>
                            {rule.contentIsUrl ?
                                <Link href={rule.content} target='_blank' rel="noopener">
                                    {rule.heading}
                                </Link>
                                :
                                <Link href="#" onClick={event => onShowLawContentClick(event, rule.content)}>
                                    {rule.heading}
                                </Link>
                            }
                        </Typography>
                    )
                })
            }
        </div>
    )
}

const mapStateToProps = state => ({
    lawRules: state.advert.lawRules || [],
})

export default connect(mapStateToProps, { showLawRuleContent })(LawRulesPanel);