import React from 'react';
import { connect } from "react-redux";
import { showAdminLoginDialog } from '../../../redux/actions/loginDialog';

class Login extends React.Component {
    componentDidMount() {       
        const { state } = this.props.location;       
        const { authRedirect } = state || { authRedirect : { pathname: "/admin" } };
        this.props.showAdminLoginDialog(authRedirect);
    }

    render() {
        return (<></>)
    }
}

export default connect(null, { showAdminLoginDialog })(Login);