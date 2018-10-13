import React from 'react';
import { connect } from 'react-redux';

import { initAuth } from '../actions/SessionActions';
import Root from '../components/Root';

const RootContainer = props => <Root {...props} />;

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(mapStateToProps, {
  initAuth,
})(RootContainer);
