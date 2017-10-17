"use strict"

import React from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import FlatButton from 'material-ui/FlatButton'
import MenuItem from 'material-ui/MenuItem'
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux'
import { FormattedMessage as Fm } from 'react-intl'

const styles = {
	dialog: {
		width: 600
	},
	textbox: {
		width: 540
	},
	fieldTextbox: { 
		width: 340
	},
	fieldCopyButton: {
		verticalAlign: 'text-bottom',
		marginLeft: 16
	},
	customFieldTextbox: {
		width: 220
	},
	customFieldNameTextbox: {
		width: 120
	}
}

let group = {
	name: '',
	fields: []
}
let account = {
	name: '',
	fields: []
}

class AccountDialog extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			open: props.open,
			group: Object.assign({}, group, props.group),
			account: Object.assign({}, account, props.account)
		}
	}

	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.open !== this.state.open) {
			this.setState({ open: nextProps.open })
		}
		if (nextProps.group !== this.state.group) {
			this.setState({ group: Object.assign({}, group, nextProps.group) })
		}
		if (nextProps.account !== this.state.account) {
			this.setState({ account: Object.assign({}, account, nextProps.account) })
		}
	}

	cancel() {
		this.setState({ open: false })
		if (this.props.onCancelRequest) {
			this.props.onCancelRequest()
		}
	}

	save() {
		const { state } = this
		const { account } = state 

		if (account.name === null || account.name.length === 0) {
			account.nameError = <Fm id="app.label.required" defaultMessage="Required." />
		}
		else {
			delete account.nameError
		}
		// I campi possono essere null.
		/*
		account.fields.forEach(field => {
			if (field.value === null || field.value.length === 0) {
				field.error = <Fm id="app.label.required" defaultMessage="Required." />
			}
			else {
				delete field.error
			}
		})
		*/
		this.setState({ account })
		
		var valid = account.nameError === undefined/* && account.fields.filter(f => f.error !== undefined).length === 0*/
		if (valid && this.props.onSaveRequest) {
			this.props.onSaveRequest(Object.assign({}, account))
		}
	}

	updateName(e, value) {
		const { state } = this 
		const { account } = state 
		this.setState({
			account: Object.assign(account, {
				name: value,
				nameError: (value === null || value.length === 0) 
					? <Fm id="app.label.required" defaultMessage="Required." />
					: null
			})
		})
	}

	createField(e) {
		const { state } = this 
		const { account } = state 
		const { fields } = account 
		var field = {
			name: 'Field' + fields.length,
			type: 'text',
			value: ''
		}
		fields.push(field)
		this.setState({
			account: Object.assign({}, account, {
				fields: fields
			})
		})
	}

	updateField(field, e, value) {
		const { state } = this 
		const { account } = state 
		const { fields } = account
		var field = fields.find(f => f.name === field.name)
		if (!field || field === null) {
			field = {
				name: field.name,
				type: field.type,
				value: value,

			}
			fields.push(field)
		}
		else {
			field.value = value
		}
		// I campi possono essere impostati come vuoti
		/*field.error = (value === null || value.length === 0)
			? <Fm id="app.label.required" defaultMessage="Required." />
			: null*/

		this.setState({
			account: Object.assign(account, {
				fields: fields 
			})
		})
	}


	updateCustomField(index, e, value) {
		const { state } = this 
		const { account } = state 
		const { fields } = account 
		var field = fields[index]
		field.value = value 

		// I campi possono essere impostati come vuoti.
		/*field.error = (value === null || value.length === 0) 
			? <Fm id="app.label.required" defaultMessage="Required." />
			: null 
		field.nameError = field.error === null ? null : <Fm id='app.label.error_helper' defaultMessage="" />*/
		this.setState({
			account: Object.assign({}, account, {
				fields: fields 
			})
		})
	}

	removeCustomField(index, e) {
		const { state } = this 
		const { account } = state 
		const { fields } = account 
		fields.splice(index, 1)

		this.setState({
			account: Object.assign({}, account, {
				fields: fields
			})
		})
	}

	updateFieldName(index, e, value) {
		const { state } = this 
		const { account } = state 
		const { fields } = account 
		var field = fields[index]
		field.name = value 

		field.nameError = value === null || value.length == 0
			? <Fm id="app.label.required" defaultMessage="Required." />
			: null 
		field.error = field.nameError === null ? null : <Fm id='app.label.error_helper' defaultMessage="" />
		this.setState({
			account: Object.assign({}, account, {
				fields: fields
			})
		})
	}

	render() {
		let actions = [
			<FlatButton 
				label={<Fm id="app.label.cancel" defaultMessage="Cancel" />}
				secondary={true}
				onTouchTap={this.cancel.bind(this)} />,
			<FlatButton 
				label={<Fm id="app.label.add_field" defaultMessage="Add Field" />}
				onTouchTap={this.createField.bind(this)} />,						
			<FlatButton 
				label={<Fm id="app.label.save" defaultMessage="Save" />}
				primary={true}
				onTouchTap={this.save.bind(this)} />				
		]

		return (
			<Dialog 
				open={this.state.open}
				title={this.state.group ? this.state.group.name : ''}
				contentStyle={styles.dialog}
				autoScrollBodyContent={true}
				actions={actions}>
				<TextField 
					style={styles.textbox}
					type="text"
					value={this.state.account.name}
					onChange={this.updateName.bind(this)}
					errorText={this.state.account.nameError}
					floatingLabelText={<Fm id="app.label.name" defaultMessage="Name" />}
					hintText={<Fm id="app.label.account.placeholder" defaultMessage="Account name..." />} 								
				/> 
				{this.state.account.fields.map((data, index) => {
					var field = this.state.group.fields.find(f => f.name === data.name)
					var isCustom = field === undefined || field === null 
					if (isCustom) {
						field = {
							name: data.name,
							type: data.type
						}
					}
					data = Object.assign({ value: '' }, data)
					if (!isCustom) {
						return (
							<CopyToClipboard key={index} text={data.value}>
								<div key={index}>
									<TextField
										style={styles.fieldTextbox}
										type={field.type}
										value={data.value}
										errorText={data.error}
										floatingLabelText={field.name}
										onChange={this.updateField.bind(this, field)}
										hintText={field.name + '...'}
										/>
									<FlatButton 
										style={styles.fieldCopyButton}
										secondary={true} 
										label={<Fm id="app.label.copy" defaultMessage="Copy" />}/>
								</div>
							</CopyToClipboard>
						)
					}
					else {
						return (
							<CopyToClipboard key={index} text={data.value}>
								<div key={index}>
									<TextField 
										style={styles.customFieldNameTextbox}
										type='text'
										value={data.name}
										onChange={this.updateFieldName.bind(this, index)}
										errorText={data.nameError}
										floatingLabelText={<Fm id="app.label.name" defaultMessage="Name" />}
								 	/>
									<TextField
										style={styles.customFieldTextbox}
										type={field.type}
										value={data.value}
										floatingLabelText={field.name || 'Undefined name'}
										onChange={this.updateCustomField.bind(this, index)}
										errorText={data.error}
										hintText={<Fm id="app.label.value" defaultMessage="Value" />}
									/>

									<FlatButton 
										style={styles.fieldCopyButton}
										secondary={true} 
										label={<Fm id="app.label.copy" defaultMessage="Copy" />}/>									
									<FlatButton 
										style={styles.fieldCopyButton}
										secondary={true} 
										onTouchTap={this.removeCustomField.bind(this, index)}
										label={<Fm id="app.label.remove" defaultMessage="Remove" />}/>																			
								</div>
							</CopyToClipboard>
						)
					}
				})}
			</Dialog>			
		)
	}
}

AccountDialog.propTypes = {
	group: React.PropTypes.object,
	account: React.PropTypes.object,
	open: React.PropTypes.bool.isRequired,
	onSaveRequest: React.PropTypes.func.isRequired,
	onCancelRequest: React.PropTypes.func
}

export default connect(state => { return {state}})(AccountDialog)