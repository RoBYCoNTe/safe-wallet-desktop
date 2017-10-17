import React from 'react'
import { connect } from 'react-redux'
import { init as appInit } from './actions/App'
import { push } from './actions/Router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

import injectTapEventPlugin from 'react-tap-event-plugin'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends React.Component {
  
  render() {
  	return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        {this.props.children}
      </MuiThemeProvider>
    )  
  }
}

export default connect((state) => { return state })(App)
