import React from 'react';
import { connect } from "react-redux";
import AdminPage from './AdminPage';
import NavigationBar from './NavigationBar';
import TemporaryDrawer from './TemporaryDrawer';
import UserMenu from './UserMenu'
import { loadCategories } from '../../redux/actions/admin';

class Admin extends React.Component {
    componentDidMount() {
        this.props.loadCategories(this.props.match.params.adParentId);
    }

    render() {
        return (<>
            <NavigationBar />
            <UserMenu />
            <TemporaryDrawer />
            <AdminPage />
        </>)
    }
}

export default connect(null, { loadCategories })(Admin);