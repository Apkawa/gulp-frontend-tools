'use strict'
import React from 'react'
import _ from 'lodash'
import style from './page_2.scss'

export default class PageTwo extends React.Component {
  render () {

    return (
      <div>
        <h1 className={style.head}>Page two</h1>
        <ul className={style.example}>
          {_.map([1, 2, 3], v => <li>{v}</li>)}
        </ul>
      </div>
    )
  }
}