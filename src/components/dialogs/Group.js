"use strict"

import React from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import FlatButton from 'material-ui/FlatButton'
import MenuItem from 'material-ui/MenuItem'
import ContentAdd from 'material-ui/svg-icons/content/add'
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
		width: 250
	},
	fieldSelect: { 
		width: 154, 
		verticalAlign: 'bottom', 
		marginLeft: 16 
	},
	fieldRemoveButton: {
		verticalAlign: 'text-bottom',
		marginLeft: 16
	}
}

const types = ['text', 'password']
const group = {
	name: null,
	fields: [{ 
		name: 'Field0', 
		type: 'text' 
	}] 
}

class GroupDialog extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			open: props.open,
			// Un gruppo deve avere almeno il nome e un campo.
			group: Object.assign({}, group, props.group || {})
		}
	}
	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.open !== this.state.open) {
			this.setState({ open: nextProps.open })
		}
		if (nextProps.group !== this.state.group) {
			this.setState({ 
				group: Object.assign({}, group, nextProps.group) 
			})
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
		const { group } = state 
		const { name } = group 
		if (name === null || name.length === 0) {
			this.setState({ 
				group: Object.assign(group, {
					nameError: <Fm id="app.label.required" defaultMessage="Required." />
				})
			})
			return 
		}
		else {
			// Sanytize
			delete this.state.group.nameError
		}
		this.props.onSaveRequest(Object.assign({}, this.state.group))
	}
	addField() {
		const { state } = this 
		const { group } = state 
		const { fields } = group 
		this.setState({
			group: Object.assign(group, {
				fields: fields.concat([{ 
					name: 'Field' + fields.length, 
					type: 'text' 
				}])
			})
		})
	}
	removeField(index) {
		const { state } = this
		const { group } = state 
		const { fields } = group 
		
		if (fields.length === 1) {
			return 
		}

		fields.splice(index, 1)
		this.setState({
			group: Object.assign(group, {
				fields: fields
			})
		})
	}
	updateName(e, value) {
		const { state } = this
		const { group } = state
		this.setState({
			group: Object.assign(group, {
				name: value,
				nameError: (value === null || value.length === 0) 
					? <Fm id="app.label.required" defaultMessage="Required." />
					: null
			})
		})
	}
	updateField(index, prop, e, value) {
		const { state } = this 
		const { group } = state 
		const { fields } = group 
		if (prop === 'type') {
			value = types[value]
		}

		fields[index][prop] = value 

		this.setState({
			group: Object.assign(group, {
				fields: fields 
			})
		})
	} 
	assignFieldName(index) {
		const { state } = this 
		const { group } = state 
		const { fields } = group 
		const { name } = fields[index]
		
		if (name === null || name.length === 0) {
			fields[index].name = 'Field' + index
			this.setState({
				group: Object.assign(group, {
					fields: fields
				})
			})
		}
	}

	render() {
		let actions = [
			<FlatButton 
				label={<Fm id="app.label.cancel" defaultMessage="Cancel" />}
				onTouchTap={this.cancel.bind(this)} />,
			<FlatButton 
				label={<Fm id="app.label.add_field" defaultMessage="Add Field" />}
				onTouchTap={this.addField.bind(this)} />,									
			<FlatButton 
				label={<Fm id="app.label.save" defaultMessage="Save" />}
				onTouchTap={this.save.bind(this)} />				
		]
		return (
			<Dialog 
				open={this.state.open}
				autoScrollBodyContent={true}
				title={this.props.state.intl.messages['app.label.group'] || 'Group'}
				contentStyle={styles.dialog}
				actions={actions}>
				<TextField 
					style={styles.textbox}
					type="text"
					value={this.state.group.name}
					onChange={this.updateName.bind(this)}
					errorText={this.state.group.nameError}
					floatingLabelText={<Fm id="app.label.name" defaultMessage="Name" />}
					hintText={<Fm id="app.label.name.placeholder" defaultMessage="Name..." />} 								
				/> 

				{this.state.group != null && this.state.group.fields.map((field, index) => 
					<div key={index}>
						<TextField 
							key={'input-' + index}
							style={styles.fieldTextbox}
							type="text"
							value={field.name}
							onBlur={this.assignFieldName.bind(this, index)}
							onChange={this.updateField.bind(this, index, 'name')}
							floatingLabelText={<Fm id="app.label.field_name" defaultMessage="Field name" />}
							hintText={<Fm id="app.label.field_name" defaultMessage="Field name..." />} />
						<SelectField 
							key={'select-' + index}
							style={styles.fieldSelect}
							value={field.type}
							onChange={this.updateField.bind(this, index, 'type')}
							floatingLabelText="Type">
							{types.map(type => <MenuItem key={type} value={type} primaryText={type} />)}
						</SelectField>
						<FlatButton 
							style={styles.fieldRemoveButton} 
							secondary={true}
							onTouchTap={this.removeField.bind(this, index)}
							label={<Fm id="app.label.remove" defaultMessage="Remove" />} />
					</div>
				)}
			</Dialog>			
		)
	}
}

GroupDialog.propTypes = {
	open: React.PropTypes.bool.isRequired,
	onSaveRequest: React.PropTypes.func.isRequired,
	onCancelRequest: React.PropTypes.func
}

export default connect(state => { return {state}})(GroupDialog)