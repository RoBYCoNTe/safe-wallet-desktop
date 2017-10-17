import { LocalStorage } from 'node-localstorage'
import {
	REQUEST_OPEN_FILE,
	RECEIVE_OPEN_FILE,
	REQUEST_CREATE_FILE,
	RECEIVE_CREATE_FILE,
	REQUEST_SAVE_ACCOUNT,
	RECEIVE_SAVE_ACCOUNT,
	REQUEST_SAVE_GROUP,
	RECEIVE_SAVE_GROUP,
	REQUEST_REMOVE_ACCOUNT,
	RECEIVE_REMOVE_ACCOUNT,
	REQUEST_REMOVE_GROUP,
	RECEIVE_REMOVE_GROUP,
	CLOSE_WALLET,

	REQUEST_CANCEL_EDITING,
	REQUEST_CLEAR_OPERATION,
	
	REQUEST_EDIT_GROUP,
	REQUEST_VIEW_GROUP,
	REQUEST_CREATE_GROUP,
	
	REQUEST_EDIT_ACCOUNT,
	REQUEST_VIEW_ACCOUNT,
	REQUEST_CREATE_ACCOUNT,

	RECEIVE_GENERIC_ERROR
} from '../actions/Wallet'

var localStorage = new LocalStorage('./data')
let shouldPersist = (state) => {
	localStorage.setItem('wallet.state', JSON.stringify(state))
	return state 
}
let getPersistentData = () => {
	return JSON.parse(localStorage.getItem('wallet.state')) || {}
}

var openKeys = localStorage.getItem('wallet.login')
var lastOpenedFile = localStorage.getItem('wallet.last_opened_file')

var defaultState = Object.assign({
	lastOpenedFile: lastOpenedFile,
	path: null,
	opened: false,
	processing: false,
	operation: null,
	error: null,
	groups: [],
	accounts: [],
	viewingGroup: null,
	editingGroup: null,
	editingAccount: null,
	viewingAccount: null,
	/**
	 * Servono in debug, consentono di aprire automaticamente un file precedentemente aperto.
	 * E' inutile ricordarti che prima di fare un rilascio è obbligatorio disabilitare le openKeys
	 * impostando questo parametro a false
	 * @type {[type]}
	 */
	openKeys: false // openKeys && openKeys !== null ? JSON.parse(openKeys) : {}
})

export default (state = defaultState, action) => {
	switch(action.type) {
		
		case CLOSE_WALLET:
			localStorage.removeItem('wallet.login')
			return shouldPersist(Object.assign({}, state, {
				lastOpenedFile: localStorage.getItem('wallet.last_opened_file'),
				path: null,
				opened: false,
				groups: [],
				accounts: [],
				openKeys: {}
			}))
		
		case REQUEST_CANCEL_EDITING:
			return shouldPersist(Object.assign({}, state, {
				editingGroup: null,
				editingAccount: null
			}))

		// GROUPS
		case REQUEST_VIEW_GROUP:
			return shouldPersist(Object.assign({}, state, {
				viewingGroup: action.group
			}))

		case REQUEST_EDIT_GROUP:
			return shouldPersist(Object.assign({}, state, {
				editingGroup: action.group
			}))

		case REQUEST_CREATE_GROUP:
			return shouldPersist(Object.assign({}, state, {
				editingGroup: {
					name: '', 
					fields: [{
						name: 'Field0',
						type: 'text'
					}] 
				}
			}))

		// ACCOUNTS 
		case REQUEST_VIEW_ACCOUNT:
			return shouldPersist(Object.assign({}, state, {
				viewingAccount: action.account
			}))

		case REQUEST_EDIT_ACCOUNT:
			return shouldPersist(Object.assign({}, state, {
				editingAccount: action.account,
				viewingGroup: state.groups.find(g => g.id === action.account.group)
			}))

		case REQUEST_CREATE_ACCOUNT:
			return shouldPersist(Object.assign({}, state, {
				editingAccount: {
					name: '',
					group: action.group.id,
					fields: action.group.fields.map(field => {
						return {
							name: field.name,
							type: field.type,
							value: ''
						}	
					})
				}
			}))

		case REQUEST_CLEAR_OPERATION:
			return shouldPersist(Object.assign({}, state, {
				operation: null
			}))

		case REQUEST_OPEN_FILE:
			localStorage.setItem('wallet.last_opened_file', action.filename)
			return shouldPersist(Object.assign({}, state, {
				path: action.filename,
				processing: true,
				operation: 'file.open',
				error: null
			}))
		case RECEIVE_OPEN_FILE: 
			// Just for debug:
			if (action.response.error === false) {
				localStorage.setItem('wallet.login', JSON.stringify({ 
					filename: action.filename,
					password: action.password
				}))
			}
			return shouldPersist(Object.assign({}, state, action.response.data, {
				processing: false,
				opened: action.response.error !== true
			}))

		case REQUEST_CREATE_FILE:
			return shouldPersist(Object.assign({}, state, {
				processing: true,
				operation: 'file.create'
			}))

		case RECEIVE_CREATE_FILE:
			return shouldPersist(Object.assign({}, state, action.response.data, {
				processing: false,
				opened: !action.response.error
			}))

		case REQUEST_SAVE_ACCOUNT:
			return shouldPersist(Object.assign({}, state, {
				processing: true,
				operation: 'save.account',
				editingAccount: action.account
			}))

		case RECEIVE_SAVE_ACCOUNT:
			return shouldPersist(Object.assign({}, state, action.response.data, {
				processing: false,
				editingAccount: action.response.error === false ? null : state.editingAccount
			}))

		case REQUEST_SAVE_GROUP:
			return shouldPersist(Object.assign({}, state, {
				processing: true,
				operation: 'save.group',
				editingGroup: action.group
			}))

		case RECEIVE_SAVE_GROUP:
			return shouldPersist(Object.assign({}, state, action.response.data, {
				processing: false,
				editingGroup: action.response.error === false ? null : state.editingGroup
			}))

		case REQUEST_REMOVE_GROUP:
			return shouldPersist(Object.assign({}, state, {
				processing: true,
				operation: 'remove.group'
			}))

		case RECEIVE_REMOVE_GROUP:
			return shouldPersist(Object.assign({}, state, action.response.data, {
				processing: false,
				error: action.response.error ? action.response.code : null
			}))

		case REQUEST_REMOVE_ACCOUNT:
			return shouldPersist(Object.assign({}, state, {
				processing: true,
				operation: 'remove.account'
			}))

		case RECEIVE_REMOVE_ACCOUNT:
			return shouldPersist(Object.assign({}, state, action.response.data, {
				processing: false
			}))

		case RECEIVE_GENERIC_ERROR:
			return shouldPersist(Object.assign({}, state, {
				error: action.error
			}))
		default:
			return state 
	}
}