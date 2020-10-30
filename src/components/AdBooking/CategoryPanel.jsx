import React from 'react';
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/styles';
import { Typography, Link } from '@material-ui/core';
import GroupingSelectField from '../common/GroupingSelectField';
import LawRulesPanel from './LawRulesPanel';

import { changeCategory } from '../../redux/actions/advert';

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    header: {
        paddingBottom: theme.spacing(2),
    },
    category: {
        marginBottom: theme.spacing(1),
    },
    container: {
        display: 'flex',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    growItem: {
        flexGrow: 1,
    },
    imageStyle: {
        width: '140px'
    },
    innerHtml: {
        '& h1': {
            ...theme.typography.h4,
            margin: 0
        },
        '& h2': {
            ...theme.typography.h5,
            margin: 0
        },
        '& h3': {
            ...theme.typography.h6,
            margin: 0
        },
        '& p': {
            ...theme.typography.body1,
            margin: 0
        },
        '& ol': {
            margin: 0
        },
        '& ul': {
            margin: 0
        },
        '& li': {
            ...theme.typography.body1,
        },
        '& a': {
            color: theme.palette.primary.main,
        }
    }
}))

function CategoryPanel({ categories, advertGroupId, categoryImageUrl, categoryText, changeCategory }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography variant="h6" className={classes.header} >
                Välj kategori
            </Typography>
            <GroupingSelectField className={classes.category}
                label="Kategori"
                value={advertGroupId}
                items={categories}
                onChange={(category) => changeCategory(category)}
            />
            {categoryText &&
                <div className={classes.container}>
                    <div className={classes.growItem}>
                        <div className={classes.innerHtml} dangerouslySetInnerHTML={{ __html: categoryText }} />
                    </div>
                    <div>
                        {categoryImageUrl ?
                            <img alt="Bild" src={categoryImageUrl} className={classes.imageStyle} />
                            : null
                        }
                    </div>
                </div>
            }
            <LawRulesPanel />
        </div>
    )
}

const mapStateToProps = state => ({
    categories: state.advert.categories,
    advertGroupId: state.advert.advertGroupId,
    categoryImageUrl: state.advert.categoryImageUrl,
    categoryText: state.advert.categoryText,
})

export default connect(mapStateToProps, { changeCategory })(CategoryPanel);