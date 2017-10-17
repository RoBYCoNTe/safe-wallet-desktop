import {
	SHOW_LOADER,
	HIDE_LOADER,
	INIT
} from '../actions/App'

var defaultState = {
	loading: false,
	init: false 
}
export default (state = defaultState, action) => {
	switch(action.type) {
		case SHOW_LOADER:
			return Object.assign({}, state, {
				loading: true
			})
		case HIDE_LOADER: 
			return Object.assign({}, state, {
				loading: false 
			})
		case INIT:
			return Object.assign({}, state, {
				init: true
			})
		default:
			return state
	}
}