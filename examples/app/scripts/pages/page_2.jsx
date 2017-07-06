'use strict'
import React from 'react'
import _ from 'lodash'
// empty object
import style_no_module from './page_2.scss'

import style from './page_2_module.scss?module'
import style2 from './page_2_module.scss?module'
import style3 from './page_3_same_name_classes.scss?module'

import image from 'app/images/sprites/ok.png'
import image2 from 'images/sprites/ok.png'

export default class PageTwo extends React.Component {
  render () {

    return (
      <div>
        <h1 className={style.head}>Page two</h1>
        <ul className={style.example_2}>
          {_.map([1, 2, 3], v => <li>{v}</li>)}
        </ul>
        <img src={image} alt=""/>
        <div className={style.example_url_global}>
          example_url_global
        </div>

        <h1 className={style2.head}>example "{style.head}" equal "{style2.head}"</h1>
        <h1 className={style3.head}>example "{style.head}" not equal "{style3.head}"</h1>
      </div>
    )
  }
}