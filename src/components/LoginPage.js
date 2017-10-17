import React from 'react'
import { FormattedMessage as Fm } from 'react-intl'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import { remote } from 'electron'
import { openFile, createFile } from '../actions/Wallet'
import { push } from '../actions/Router'
import { connect } from 'react-redux'

let styles = {
	container: {
		marginTop: '20%',
		textAlign: 'center'
	},
	item: {
		width: 300
	},
	itemContentFixed: {
		width: 250,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		display: 'inline-block',
		marginBottom: -10
	},
	help: {
		marginTop: 32,
		fontFamily: 'Roboto'
	}
}
let isValid = (v) => v && v !== null && v.trim().length > 0

class LoginPage extends React.Component {
	constructor(props) {
		super(props)

		const { state } = props 
		const { wallet } = state 
		this.state = {
			filename: wallet.lastOpenedFile,
			filenameError: false,
			password: null,
			passwordError: null,

			create: false,
			createPassword: null,
			createPasswordConfirm: null,
			createFilename: null,
			createFilenameError: null
		}
	}

	componentDidMount() {
		const { state, dispatch } = this.props 
		const { wallet } = state 
		const { opened, openKeys } = wallet 
		if (opened) {
			dispatch(push('/home'))
		}
		else if (openKeys.filename && openKeys.password) {
			// Questa IF deve funzionare solo in DEBUG. 
			// Va disabilitato tutto in produzione.
			dispatch(openFile(openKeys.filename, openKeys.password))
		}
	}

	componentWillReceiveProps(nextProps, nextState) {
		const { wallet } = nextProps.state
		var wasOpened = this.props.state.wallet.opened 
		var nowOpened = nextProps.state.wallet.opened
		
		if (!wasOpened && nowOpened) {
			const { dispatch } = this.props 
			dispatch(push('/home'))
		}
		else if (wallet.error && wallet.error !== null && wallet.error.code === 'file.unable_to_open') {
			this.setState({
				passwordError: <Fm id="app.label.invalid_password" defaultMessage="Invalid Password" />
			})
		}
	}

	createFile(e) {
		const { state } = this
		const { createPassword, createPasswordConfirm, createFilename } = state 
		
		this.setState({
			createPasswordError: isValid(createPassword) 
				? null 
				: <Fm id="app.label.required" defaultMessage="Required." />,
			createPasswordConfirmError: isValid(createPasswordConfirm) 
				? createPasswordConfirm !== createPassword 
					? <Fm id="app.label.password.not_match" defaultMessage="Password does't match." />
					: null
				: <Fm id="app.label.required" defaultMessage="Required." />,
		})
		
		var valid = isValid(createPassword) && isValid(createPasswordConfirm) && createPassword === createPasswordConfirm
		if (valid === false) {
			return 
		}

		const { dispatch } = this.props 
		const { dialog } = require('electron').remote 
		dialog.showSaveDialog(filename => {
			if (!filename) {
				return 
			}
			dispatch(createFile(filename, createPassword))
		})
	}

	openFile(e) {
		const { dialog } = require('electron').remote
		dialog.showOpenDialog(filenames => {
			if (!filenames) {
				return 
			}
			
			this.setState({ filename: filenames[0] })
		})
	}

	login(e) {
		e.preventDefault()
		
		const { state } = this 
		const { filename, password } = state 
		const validFilename = isValid(filename)

		this.setState({ filenameError: !validFilename })
		if (!validFilename) {
			return 
		}

		var validPassword = isValid(password)
		this.setState({ passwordError: validPassword ? null : <Fm id="app.label.required" defaultMessage="Required." />})
		if (!validPassword) {
			return
		}

		const { dispatch } = this.props 
		dispatch(openFile(filename, password))
	}

	handleKeyPress(e) {
		if (e.charCode === 13 || e.keyCode === 13) {
			this.login(e)
			return false
		}
		return true 
	}

	render() {
		let filename = this.state.filename
		if (!filename) {
			filename = (<Fm id="app.label.choose_file" defaultMessage="Choose File" />)
		}
		else {
			filename = (<span style={styles.itemContentFixed}>{filename}</span>)
		}
		return (
      <MuiThemeProvider>
	      <form style={styles.container}>
	      	<h1 style={{ fontFamily: 'Roboto' }}>	
	      		<Fm 
	      			id="app.name" 
	      			defaultMessage="SafeWallet" />
	      	</h1>
	      	<RaisedButton 
	      		onTouchTap={this.openFile.bind(this)}
	      		style={styles.item}
	      		label={filename} />
      		<Dialog 
      			title={this.props.state.intl.messages['app.label.filename.required']}
      			modal={true}
      			actions={[<FlatButton label={<Fm id="app.label.ok" defaultMessage="OK" />} onTouchTap={() => this.setState({ filenameError: false })} />]}
      			onRequestClose={() => this.setState({ filenameError: false })}
      			open={this.state.filenameError}>
      			<Fm 
      				id="app.label.filename.required.explained" 
      				defaultMessage="Please choose valid file to decrypt with your personal password." />
      		</Dialog>
        	<br />
					<TextField 
						style={styles.item}
						type="password"
						onChange={(e) => this.state.password = e.target.value}
						onKeyPress={this.handleKeyPress.bind(this)}
						errorText={this.state.passwordError}
						floatingLabelText={<Fm id="app.label.password" defaultMessage="Password" />}
						hintText={<Fm id="app.label.password_placeholder" defaultMessage="Password..." />}/>
					<br />
					<RaisedButton
						onTouchTap={this.login.bind(this)}
						style={styles.item}
						label={<Fm id="app.label.login" defaultMessage="Login" />} />
					
					<FloatingActionButton 
						onTouchTap={() => this.setState({ create: true })}
						style={{ position: 'absolute', bottom: 32, right: 32 }}>
						<ContentAdd />
					</FloatingActionButton>
					<Dialog 
						title={this.props.state.intl.messages['app.label.create_file']}
						onRequestClose={() => this.setState({ create: false })}
						contentStyle={{ width: 350 }}
						actions={[
							<FlatButton 
								label={<Fm id="app.label.create" defaultMessage="Create" />}
								onTouchTap={this.createFile.bind(this)} />,
							<FlatButton 
								label={<Fm id="app.label.cancel" defaultMessage="Cancel" />}
								onTouchTap={() => this.setState({ create: false })} />
						]}
						modal={true}
						open={this.state.create}>
						<p style={styles.help}>
							<Fm 
								id="app.label.password.help" 
								defaultMessage="Provide valid password to encrypt your data into a secure file." />
						</p>
						<TextField 
							style={styles.item}
							type="password"
							onChange={(e) => this.state.createPassword = e.target.value}
							errorText={this.state.createPasswordError}
							floatingLabelText={<Fm id="app.label.password" defaultMessage="Password" />}
							hintText={<Fm id="app.label.password.placeholder" defaultMessage="Password..." />} 
						/>
						<TextField 
							style={styles.item}
							type="password"
							onChange={(e) => this.state.createPasswordConfirm = e.target.value}
							errorText={this.state.createPasswordConfirmError}
							floatingLabelText={<Fm id="app.label.password.confirm" defaultMessage="Confirm password" />}
							hintText={<Fm id="app.label.password.confirm.placeholder" defaultMessage="Confirm password..." />} />
					</Dialog>

				</form>
      </MuiThemeProvider>
		)
	}
}

export default connect(state => { return { state } })(LoginPage)