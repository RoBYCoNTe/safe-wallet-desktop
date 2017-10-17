"use strict"

import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux'
import { closeConfirm } from '../../actions/Alerts'
import { FormattedMessage as Fm } from 'react-intl'

class ConfirmDialog extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			message: this.props.message
		}
	}
	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.message !== this.state.message) {
			this.setState({ message: nextProps.message })
		}
	}

	cancel() {
		const { dispatch } = this.props 
		dispatch(closeConfirm())

		this.setState({ message: null })
		if (this.props.onCancel) {
			this.props.onCancel()
		}
	}
	confirm() {
		const { dispatch } = this.props 
		dispatch(closeConfirm())

		this.setState({ message: null })
		if (this.props.onConfirm) {
			this.props.onConfirm()
		}
	}
	render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.cancel.bind(this)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.confirm.bind(this)}
      />,
    ];

    return (
      <Dialog
      	title={this.props.state.intl.messages['app.label.warning'] || 'Warning'}
        actions={actions}
        modal={false}
        open={this.state.message !== null}
        onRequestClose={this.cancel.bind(this)}>
        {this.props.message}
      </Dialog>
    );
	}
}

ConfirmDialog.propTypes = {
	message: React.PropTypes.any,
	onConfirm: React.PropTypes.func,
	onCancel: React.PropTypes.func
}
export default connect(state => { return { state } })(ConfirmDialog)