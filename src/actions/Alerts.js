export const CONFIRM = "ALERTS_REQUEST_CONFIRM"
export const CONFIRM_CLOSE = "ALERT_REQUEST_CONFIRM_CLOSE"
export const NOTIFY = "ALERTS_REQUEST_NOTIFY"
export const NOTIFY_CLOSE = "ALERTS_REQUEST_NOTIFY_CLOSE"

export function confirm(message, callback) {
	return { type: CONFIRM, message, callback }
}
export function closeConfirm() {
	return { type: CONFIRM_CLOSE }
}
export function notify(code, message) {
	return { type: NOTIFY, code, message }
}
export function closeNotify() {
	return { type: NOTIFY_CLOSE }
}