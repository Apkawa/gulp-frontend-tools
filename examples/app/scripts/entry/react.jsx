import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

import {
  HashRouter as Router,
  Route,
  Link,
} from 'react-router-dom'

import PAGES from '../pages'

const isReactComponent = (obj) => Boolean(obj && obj.prototype && Boolean(obj.prototype.isReactComponent))

class LazyPage extends React.Component {
  state = {
    component: null,
  }

  componentWillMount () {
    this.loadComponent(this.props)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.match.params.page !== this.props.match.params.page) {
      this.loadComponent(nextProps)
    }
  }

  loadComponent ({match: {params: {page}}}) {
    this.setState({
      component: null,
    })
    const Component = PAGES[page]
    if (isReactComponent(Component)) {
      this.setState({
        // handle both es imports and cjs
        component: Component,
      })
    }
    else {
      Component.then(mod => {
        console.log('Load', page)
        this.setState({
          // handle both es imports and cjs
          component: mod.default ? mod.default : mod,
        })
      })
        .catch(err => {
          console.error(err)
        })
    }
  }

  render () {
    const {component: Component} = this.state
    if (!Component) {
      return null
    }
    const {...props} = this.props
    if (_.isFunction(this.props.children)) {
      return this.props.children(Component, props)
    }

    return <Component {...props}/>
  }

}

const App = () => (
  <Router>
    <div>
      <ul>
        {_.map(PAGES, (page, key) => (
          <li><Link to={`/${key}`}>{key}</Link></li>
        ))}
      </ul>
      <hr/>

      <Route path="/:page" component={LazyPage}/>
    </div>
  </Router>
)

$(() => {
  ReactDOM.render(<App/>, document.getElementById('content'))
})
