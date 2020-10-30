import React from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import GroupingSelectField from '../common/GroupingSelectField';
import ImageInputField from './ImageInputField';

import { changeCategory, changeCategoryImage } from '../../redux/actions/admin';
import FormatInputField from './FormatInputField';
import ButtonsPanel from './ButtonsPanel';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
        marginTop: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            marginTop: theme.spacing(8),
        }
    },
    header: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    category: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    divider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}))

function AdminPage({ categories, advertGroupId, categoryImageUrl, userAllowed, changeCategory, changeCategoryImage }) {
    const classes = useStyles();

    return (
        <Paper className={classes.root} elevation={0} square>
            <Typography variant="h6" className={classes.header} >
                Inställningar av kategori
            </Typography>
            <GroupingSelectField className={classes.category}
                label="Kategori"
                value={advertGroupId}
                items={categories}
                onChange={(category) => changeCategory(category)}
            />
            <ImageInputField 
                source={categoryImageUrl}
                disabled={!userAllowed}
                onChange={(imageAsBase64, file) => changeCategoryImage(imageAsBase64, file)}
            />
            <FormatInputField />
            <Divider className={classes.divider} />
            <ButtonsPanel />
        </Paper>
    )
}

const mapStateToProps = state => ({
    categories: state.admin.categories,
    advertGroupId: state.admin.advertGroupId,
    categoryImageUrl: state.admin.categoryImageUrl,
    userAllowed: state.admin.userAllowed
})

export default connect(mapStateToProps, { changeCategory, changeCategoryImage })(AdminPage);