import { LocalStorage } from 'node-localstorage'
import CryptoJS from 'crypto-js'
import fs from 'fs'

let guid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return [s4(), s4(), s4(), s4(), s4(), s4(), s4(), s4()].join();
}

class Store {
	constructor() {
		this.filename = null
		this.password = null
		this.data = null
	}

	open(filename, password) {
		return new Promise((resolve, reject) => {
			fs.readFile(filename, 'utf-8', (error, data) => {
				if (error) {
					resolve({ error: true, message: error })
				}
				else {
					try {
						var plainText = CryptoJS.AES.decrypt(data, password).toString(CryptoJS.enc.Utf8)
						var json = JSON.parse(plainText)

						this.filename = filename
						this.password = password
						this.data = json
						resolve({ error: false, data: this.data })
					}
					catch(e) {
						this.filename = null 
						this.password = null 
						this.data = null
						reject({ error: true, message: e, code: 'file.unable_to_open' })
					}
				}
			})
		})
	}

	create(filename, password) {
		return new Promise((resolve, reject) => {
			this.filename = filename
			this.password = password
			this.data = {
				password: password,
				accounts: [],
				groups: [{
					id: guid(),
					name: 'Credit Card',
					fields: [{
						name: 'Number', type: 'text'
					}, {
						name: 'CVV', type: 'password'
					}]
				}, {
					id: guid(),
					name: 'Bank Accounts',
					fields: [{
						name: 'Number', type: 'text'
					}, {
						name: 'Username', type: 'text'
					}, {
						name: 'Password', type: 'password'
					}, {
						name: 'PIN', type: 'password'
					}]
				}]
			}
			this.save().then(response => resolve(response)).catch(error => reject(error))
		})
	}

	saveGroup(group) {
		return new Promise((resolve, reject) => {
			this.data.groups = this.createOrUpdate(this.data.groups, group)
			this.save().then(response => resolve(response)).catch(error => reject(error))
		})
	}

	removeGroup(group) {
		return new Promise((resolve, reject) => {
			var associatedAccounts = this.data.accounts.filter(account => account.group === group.id)
			if (associatedAccounts.length > 0) {
				resolve({ 
					message: 'This group has associated accounts and cannot be deleted.',
					error: true, 
					code: 'error.group.associated_accounts_exists', 
					data: this.data
				})
			}
			else {
				this.data.groups = this.remove(this.data.groups, group)
				this.save().then(response => resolve(response)).catch(error => reject(error))
			}
		})
	}

	saveAccount(account) {
		return new Promise((resolve, reject) => {
			this.data.accounts = this.createOrUpdate(this.data.accounts, account)
			this.save().then(response => resolve(response)).catch(error => reject(error))
		})
	}

	removeAccount(account) {
		return new Promise((resolve, reject) => {
			this.data.accounts = this.remove(this.data.accounts, account)
			this.save().then(response => resolve(response)).catch(error => reject(error))
		})
	}

	save() {
		return new Promise((resolve, reject) => {
			var plainText = JSON.stringify(this.data)

			var encryptedText = CryptoJS.AES.encrypt(plainText, this.password)
			
			fs.writeFile(this.filename, encryptedText, (error) => {
				if (error) {
					resolve({ 
						error: true, 
						code: 'File write error',
						message: error, 
						data: this.data 
					})
				}
				else {
					resolve({ error: false, message: null, data: this.data })
				}
			})
		})
	}

	createOrUpdate(store, item) {
		if (this.isNew(item)) {
			item.id = guid()
		}
		return (store ? store.filter(storeItem => storeItem.id != item.id) : []).concat([item]).sort((a, b) => {
	    if(a.name < b.name) return -1;
			if(a.name > b.name) return 1;
			return 0
		})
	}

	isNew(item) {
		return !item.id || item.id === null || item.id === 0 
	}

	remove(store, item) {
		return store ? store.filter(s => s.id !== item.id) : []
	}
}

export default Store