import React from 'react'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import { Card, CardTitle, CardActions, CardHeader, CardText } from 'material-ui/Card';
import { connect } from 'react-redux'
import { push } from '../actions/Router'
import { 
	close, 
	
	cancelEditing, 
	
	saveGroup,
	viewGroup, 
	editGroup, 
	createGroup, 
	removeGroup,
	
	saveAccount,
	viewAccount,
	editAccount,
	createAccount,
	removeAccount,

	clearOperation
	
} from '../actions/Wallet'
import { confirm, notify, closeNotify } from '../actions/Alerts'
import { FormattedMessage as Fm } from 'react-intl'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import ContentAdd from 'material-ui/svg-icons/content/add'
import AddCircle from 'material-ui/svg-icons/content/add-circle'
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app'
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right'

import GroupDialog from './dialogs/Group'
import AccountDialog from './dialogs/Account'
import ConfirmDialog from './dialogs/Confirm'



class HomePage extends React.Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
		const { state, dispatch } = this.props 
		const { wallet } = state 
		const { opened } = wallet 
		if (!opened) {
			dispatch(push('/login'))
		}
	}
	componentWillReceiveProps(nextProps) {
		const { dispatch } = this.props
		const { state } = nextProps
		const { wallet } = state 
		const { opened } = wallet

		if (!opened) {
			dispatch(push('/login'))
		}

		let operation = nextProps.state.wallet.operation 
		let processing = this.props.state.wallet.processing
		let lastNotificationCode = nextProps.state.alerts.notificationCode

		if (!processing && operation) {
			switch(operation) {
				case "save.group":
					if (lastNotificationCode !== 'sg') {
						dispatch(notify('sg', <Fm id="app.label.group_saved" defaultMessage="Group saved with success!" />))	
					}
					break
				case "save.account":
					if (lastNotificationCode !== 'sa') {
						dispatch(notify('sa', <Fm id="app.label.account_saved" defaultMessage="Account saved with success!" />))	
					}
					break
				case "remove.group":
					if (wallet.error && wallet.error !== null && wallet.error !== false && lastNotificationCode !== 'rge') {
						dispatch(notify('rge', <Fm id={wallet.error} defaultMessage={wallet.error} />))
					}
					else if (lastNotificationCode !== 'rg') {
						console.warn('Group removed!')
						dispatch(notify('rg', <Fm id="app.label.group_removed" defaultMessage="Group removed with success!" />))
					}
					break
			}
			dispatch(clearOperation())
		}
	}
	exit() {
		const { dispatch } = this.props
		dispatch(close())
	}
	createGroup() {
		const { dispatch } = this.props
		dispatch(createGroup())
	}
	saveGroup(group) {
		const { dispatch } = this.props 
		dispatch(saveGroup(group))
	}
	editGroup(group) {
		const { dispatch } = this.props
		dispatch(editGroup(group))
	}
	removeGroup(group) {
		const { dispatch } = this.props 
		dispatch(confirm(<Fm id="app.label.ask_to_remove_group" defaultMessage="Do you want to delete this group?" />, () => {
			dispatch(removeGroup(group))	
		}))		
	}
	viewGroup(group) {
		const { dispatch } = this.props 
		dispatch(viewGroup(group))
	}



	createAccount() {
		const { dispatch, state } = this.props 
		const { wallet } = state 
		const { viewingGroup } = wallet
		dispatch(createAccount(viewingGroup))
	}
	removeAccount(account) {
		const { dispatch } = this.props 

		dispatch(confirm(<Fm id="app.label.ask_to_remove_account" defaultMessage="Do you want to delete this account?" />, () => {
			dispatch(removeAccount(account))	
		}))
	}

	saveAccount(account) {
		const { dispatch } = this.props 
		dispatch(saveAccount(account))
	}
	editAccount(account) {
		const { dispatch } = this.props 
		dispatch(editAccount(account))
	}

	cancelEditing() {
		const { dispatch } = this.props
		dispatch(cancelEditing())
	}

	closeNotify() {
		const { dispatch } = this.props 
		dispatch(closeNotify())
	}
	
	render() {
		const { state } = this.props 
		const { wallet, alerts } = state 
		const { path } = wallet

		var leftMenu = null;
		if (wallet.viewingGroup !== null) {
			leftMenu = (
				<IconMenu
			    iconButtonElement={
			      <IconButton><MoreVertIcon /></IconButton>
			    }
			    targetOrigin={{horizontal: 'right', vertical: 'top'}}
			    anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
			    <MenuItem primaryText="Edit" onTouchTap={this.editGroup.bind(this, wallet.viewingGroup)} />
					<MenuItem primaryText="Remove" onTouchTap={this.removeGroup.bind(this, wallet.viewingGroup)} />
			  </IconMenu>				
			)
		}

		return (
			<MuiThemeProvider>
				<div>
					<AppBar title="SafeWallet" iconElementRight={leftMenu} />
					<Drawer open={true}>
						<AppBar title="SafeWallet" />
						{wallet.groups.map(g => 
							<MenuItem 
								key={g.id} 
								rightIcon={(wallet.groups.length === 0 || wallet.viewingGroup === g) && <ChevronRight /> || null}
								onTouchTap={this.viewGroup.bind(this, g)}>
								{g.name}
							</MenuItem>)
						}
						<Divider />
						<MenuItem rightIcon={<AddCircle />} onTouchTap={this.createGroup.bind(this)}>
							<Fm id="app.label.add_group" defaultMessage="Add Group" />
						</MenuItem>
						<MenuItem rightIcon={<ExitToApp />} onTouchTap={this.exit.bind(this)}>
							<Fm id="app.label.exit" defaultMessage="Exit" />
						</MenuItem>
					</Drawer>				
					<div style={{ marginLeft: 270, marginRight: 10 }}>
						<GroupDialog 
							open={wallet.editingGroup !== null} 
							group={wallet.editingGroup}
							onSaveRequest={this.saveGroup.bind(this)}
							onCancelRequest={this.cancelEditing.bind(this)}
						/>
						<AccountDialog 
							open={wallet.editingAccount !== null && wallet.viewingGroup !== null}
							group={wallet.viewingGroup}
							account={wallet.editingAccount}
							onSaveRequest={this.saveAccount.bind(this)}
							onCancelRequest={this.cancelEditing.bind(this)} />
						<ConfirmDialog
							message={alerts.confirmMessage}
							onConfirm={alerts.confirmCallback ? alerts.confirmCallback.bind(this) : null}
							onCancel={alerts.cancelCallback ? alerts.cancelCallback.bind(this) : null} />

						{wallet.accounts.filter(a => wallet.viewingGroup === null || a.group === wallet.viewingGroup.id).map((account, index) => 
							<Card key={index} expanded={true} style={{ marginTop: 10 }}>
				        <CardTitle title={account.name} expandable={true} subtitle={wallet.groups.find(g => g.id === account.group).name} />
                <CardActions>
				          <FlatButton label="View" primary={true} onTouchTap={this.editAccount.bind(this, account)} />
				          <FlatButton label="Remove" secondary={true} onTouchTap={this.removeAccount.bind(this, account)} />
				        </CardActions>
				      </Card>							
						)}
						{wallet.viewingGroup !== null && 
							<FloatingActionButton 
								onTouchTap={this.createAccount.bind(this)}
								style={{ position: 'absolute', bottom: 32, right: 32 }}>
								<ContentAdd />
							</FloatingActionButton>
						}
		        <Snackbar
		          open={alerts.notificationMessage !== null}
		          message={alerts.notificationMessage || ''}
		          autoHideDuration={4000}
		          bodyStyle={{ textAlign: 'center' }}
		          onRequestClose={this.closeNotify.bind(this)}
		        />
					</div>
				</div>
			</MuiThemeProvider>
		)
	}
}

export default connect(state => { return { state } })(HomePage)