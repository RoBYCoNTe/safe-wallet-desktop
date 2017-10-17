import Store from '../middlewares/Store'

export const REQUEST_OPEN_FILE = "WALLET_REQUEST_OPEN_FILE"
export const RECEIVE_OPEN_FILE = "WALLET_RECEIVE_OPEN_FILE"
export const REQUEST_CREATE_FILE = "WALLET_REQUEST_CREATE_FILE"
export const RECEIVE_CREATE_FILE = "WALLET_RECEIVE_CREATE_FILE"
export const REQUEST_SAVE_ACCOUNT = "WALLET_REQUEST_SAVE_ACCOUNT"
export const REQUEST_SAVE_GROUP = "WALLET_REQUEST_SAVE_GROUP"
export const RECEIVE_SAVE_ACCOUNT = "WALLET_RECEIVE_SAVE_ACCOUNT"
export const RECEIVE_SAVE_GROUP = "WALLET_RECEIVE_SAVE_GROUP"
export const REQUEST_REMOVE_ACCOUNT = "WALLET_REQUEST_REMOVE_ACCOUNT"
export const RECEIVE_REMOVE_ACCOUNT = "WALLET_RECEIVE_REMOVE_ACCOUNT"
export const REQUEST_REMOVE_GROUP = "WALLET_REQUEST_REMOVE_GROUP"
export const RECEIVE_REMOVE_GROUP = "WALLET_RECEIVE_REMOVE_GROUP"
export const RECEIVE_GENERIC_ERROR = "WALLET_RECEIVE_GENERIC_ERROR"
export const REQUEST_CANCEL_EDITING = "WALLET_REQUEST_CANCEL_EDITING"
export const REQUEST_CLEAR_OPERATION = "REQUEST_CLEAR_OPERATION"

export const REQUEST_EDIT_GROUP = "WALLET_REQUEST_EDIT_GROUP"
export const REQUEST_VIEW_GROUP = "WALLET_REQUEST_VIEW_GROUP"
export const REQUEST_CREATE_GROUP = "WALLET_REQUEST_CREATE_GROUP"

export const REQUEST_VIEW_ACCOUNT = "WALLET_REQUEST_VIEW_ACCOUNT"
export const REQUEST_EDIT_ACCOUNT = "WALLET_REQUEST_EDIT_ACCOUNT"
export const REQUEST_CREATE_ACCOUNT = "WALLET_REQUEST_CREATE_ACCOUNT"

export const CLOSE_WALLET = "WALLET_CLOSE"


let r = (data) => {
	return data
}

const store = new Store()

export function close() {
	return { type: CLOSE_WALLET }
}
export function viewAccount(account) {
	return { type: REQUEST_VIEW_ACCOUNT, account }
}
export function editAccount(account) {
	return { type: REQUEST_EDIT_ACCOUNT, account }
}

export function createAccount(group, account = {}) {
	return { type: REQUEST_CREATE_ACCOUNT, group, account }
}
export function viewGroup(group) {
	return { type: REQUEST_VIEW_GROUP, group }
}
export function editGroup(group) {
	return { type: REQUEST_EDIT_GROUP, group }
}

export function createGroup(group = {}) {
	return { type: REQUEST_CREATE_GROUP, group }
}

export function clearOperation() {
	return { type: REQUEST_CLEAR_OPERATION }
}

export function cancelEditing() {
	return { type: REQUEST_CANCEL_EDITING }
}
export function openFile(filename, password) {
	return dispatch => {
		dispatch({ type: REQUEST_OPEN_FILE, filename })
		store.open(filename, password)
			.then(response => dispatch(r({
				type: RECEIVE_OPEN_FILE,
				filename,
				password,
				response
			})))
			.catch(error => dispatch(r({
				type: RECEIVE_GENERIC_ERROR,
				filename,
				error
			})))
	}
}

export function createFile(filename, password) {
	return dispatch => {
		dispatch({ type: REQUEST_CREATE_FILE, filename })
		store.create(filename, password)
			.then(response => dispatch(r({
				type: RECEIVE_CREATE_FILE,
				filename,
				response
			})))
			.catch(error => dispatch(r({
				type: RECEIVE_GENERIC_ERROR,
				filename,
				error
			})))
	}
}

export function saveAccount(account) {
	return dispatch => {
		dispatch({ type: REQUEST_SAVE_ACCOUNT, account })
		store
			.saveAccount(account)
			.then(response => dispatch(r({ 
				type: RECEIVE_SAVE_ACCOUNT,
				response
			})))
			.catch(error => dispatch(r({
				type: RECEIVE_GENERIC_ERROR,
				error
			})))
	}
}

export function saveGroup(group) {
	return dispatch => {
		dispatch({ type: REQUEST_SAVE_GROUP, group })
		store
			.saveGroup(group)
			.then(response => dispatch(r({
				type: RECEIVE_SAVE_GROUP,
				response
			})))
			.catch(error => dispatch(r({
				type: RECEIVE_GENERIC_ERROR,
				error
			})))
	}
}

export function removeAccount(account) {
	return dispatch => {
		dispatch({ type: REQUEST_REMOVE_ACCOUNT, account })
		store 
			.removeAccount(account)
			.then(response => dispatch(r({
				type: RECEIVE_REMOVE_ACCOUNT,
				response
			})))
			.catch(error => dispatch(r({
				type: RECEIVE_GENERIC_ERROR,
				error
			})))
	}
}

export function removeGroup(group) {
	return dispatch => {
		dispatch({ type: REQUEST_REMOVE_GROUP, group })
		store 
			.removeGroup(group)
			.then(response => dispatch(r({
				type: RECEIVE_REMOVE_GROUP,
				response
			})))
			.catch(error => dispatch(r({
				type: RECEIVE_GENERIC_ERROR,
				error
			})))
	}
}

