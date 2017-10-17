import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-intl-redux'
import { Router, Route, IndexRedirect, hashHistory } from 'react-router'

import configureStore from './stores'
import App from './App';
import { addLocaleData } from 'react-intl'
import itLocaleData from 'react-intl/locale-data/it'
import enLocaleData from 'react-intl/locale-data/en'

import components from './components'

import itTranslation from './locale/it'
import enTranslation from './locale/en'


addLocaleData([
	...itLocaleData,
	...enLocaleData
])

const translations = {
	'it': itTranslation,
	'en': enTranslation
}
const lang = navigator.language.substring(0, 2)
const target = translations[lang] || enTranslation

const store = configureStore({
  intl: target
})

ReactDOM.render(
	<Provider store={store}>
		<Router history={hashHistory}>
			<Route path="/" component={components.LoginPage} />
			<Route path="/home" component={components.HomePage} />
			<Route path="/login" component={components.LoginPage} />
		</Router>
	</Provider>, 
	document.getElementById('spa')
);
