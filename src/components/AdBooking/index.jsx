import React from 'react';
import { connect } from "react-redux";
import AdBookingPage from './AdBookingPage';
import { loadCategories } from '../../redux/actions/advert';

class AdBooking extends React.Component {
    componentDidMount() {
        this.props.loadCategories(this.props.match.params.adParentId);
    }

    render() {
        return (
            <AdBookingPage adParentId={this.props.match.params.adParentId} />
        )
    }
}

export default connect(null, { loadCategories })(AdBooking);