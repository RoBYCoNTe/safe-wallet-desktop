"use strict"
import {
	CONFIRM,
	CONFIRM_CLOSE,
	NOTIFY,
	NOTIFY_CLOSE
} from '../actions/Alerts'

var defaultState = {
	confirmMessage: null,
	confirmCallback: null,
	notificationMessage: null
}

export default (state = defaultState, action) => {
	switch(action.type) {
		case NOTIFY:
			return Object.assign({}, state, {
				notificationCode: action.code,
				notificationMessage: action.message
			})
		case NOTIFY_CLOSE:
			return Object.assign({}, state, {
				notificationCode: null,
				notificationMessage: null
			})
		case CONFIRM:
			return Object.assign({}, state, {
				confirmMessage: action.message,
				confirmCallback: action.callback
			})

		case CONFIRM_CLOSE:
			return Object.assign({}, state, {
				confirmMessage: null,
				confirmCallback: null
			})
		default:
			return Object.assign({}, state)
	}
}