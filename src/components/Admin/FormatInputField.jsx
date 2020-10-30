import React, { useState } from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { changeCategoryText } from '../../redux/actions/admin';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        position: 'relative'
    },
    quill: {
        '& .ql-toolbar': {
            'border-top-left-radius': theme.spacing(0.5),
            'border-top-right-radius': theme.spacing(0.5),
        },
        '& .ql-container': {
            height: "300px",
            'border-bottom-left-radius': theme.spacing(0.5),
            'border-bottom-right-radius': theme.spacing(0.5),
            '& .ql-editor': {
                '& h1': theme.typography.h4,
                '& h2': theme.typography.h5,
                '& h3': theme.typography.h6,
                '& p': theme.typography.body1,
                '& li': theme.typography.body1,
            }
        },
    },
    iconButton: {
        margin: theme.spacing(1),
    },
    rightBottomContainer: {
        position: "absolute", bottom: "0", right: "0"
    },
}));

function FormatInputField({ categoryText, userAllowed, changeCategoryText }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <ReactQuill className={classes.quill}
                readOnly={!userAllowed}
                modules={{
                    clipboard: { matchVisual: false } // remove extra tag <br/> before <ul> when init component, this parameter is removed in react-quill v2, need to investigate
                }}
                theme="snow"
                value={categoryText}
                placeholder={'Kategori text'}
                onChange={(value, delta, source, editor) => changeCategoryText(value)}
            />
        </div>
    )
}

const mapStateToProps = state => ({
    categoryText: state.admin.categoryText,
    userAllowed: state.admin.userAllowed
})

export default connect(mapStateToProps, { changeCategoryText })(FormatInputField);
