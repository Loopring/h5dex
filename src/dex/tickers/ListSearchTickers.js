import React from 'react'
import {connect} from 'dva'
import {TickersFm,TickerFm} from 'modules/tickers/formatters'
import intl from 'react-intl-universal'
import routeActions from 'common/utils/routeActions'
import { Spin } from 'antd'
import { Tabs,SearchBar,NavBar,Icon} from 'antd-mobile'
import { getMarketTickersBySymbol } from './formatters'
import { TickerHeader } from './ListMarketTickers'
import {formatPrice} from 'modules/orders/formatters'

const TickerItem = ({item,actions,key,dispatch})=>{
    if(!item){ return null }
    const tickerFm = new TickerFm(item)
    const changeMarket = ()=>{
      routeActions.gotoPath(`/dex/placeOrder/${item.market}`)
      dispatch({
        type:"layers/hideLayer",
        payload:{
          id:"helperOfMarket"
        }
      })
    }
    const tokens = tickerFm.getTokens()
    const direction = tickerFm.getChangeDirection()
    return (
      <div className="row ml0 mr0 p10 align-items-center zb-b-b no-gutters hover-default" onClick={changeMarket}>
        <div className="col-5 text-left">
          <span className="fs14 color-black-2 ">{tokens.left}-{tokens.right}</span>
        </div>
        <div className="col-4 text-left">
          <div className="fs14 color-black-2 ">{formatPrice(tokens.left, tokens.right, tickerFm.getLast())}</div>
        </div>
        <div className="col-3 text-right">
          {
            direction === 'up' &&
            <span className="border-none fs14 color-success">
             +{tickerFm.getChange()}
            </span>
          }
          {
            direction === 'down' &&
            <span className="border-none fs14 color-error">
             {tickerFm.getChange()}
            </span>
          }
          {
            direction === 'none' &&
            <span className="border-none fs14 color-grey-500">
             {tickerFm.getChange()}
            </span>
          }
        </div>
      </div>
    )
}

export const TickerList = ({items,loading,dispatch,market})=>{
  return (
    <div className="bg-white">
      <Spin spinning={loading}>
        <div className="divider 1px zb-b-t"></div>
        <div className="p10 text-left color-black-1">
          Current: {market}
        </div>
        <div className="divider 1px zb-b-t"></div>
        {items.map((item,index)=><TickerItem key={index} item={item} dispatch={dispatch}/>)}
        {items.length === 0 &&
          <div className="p10 text-center color-black-3">
            {intl.get('common.list.no_data')}
          </div>
        }
      </Spin>
    </div>
  )
}

class ListPlaceOrderTickers extends React.Component {
  state={
    keyword:''
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
      this.autoFocusInst.focus();
  }
  render(){
      const {loopringTickers:list,dispatch,market} = this.props
      const tickersFm = new TickersFm(list)

      const {extra:{favored={},keywords}} = list

      const recentTickers = tickersFm.getRecentTickers()
      const filtedTickers = this.state.keyword ? tickersFm.getSearchTickers(this.state.keyword) : []

      const search = (value) => {
        this.setState({keyword:value})
      }

      return (
        <div className="">
          <NavBar
            mode="light"
            icon={<Icon onClick={()=>{routeActions.goBack()}} type="left" />}
            leftContent={ [
            ]}
          >
            {intl.get('common.search')}搜索
          </NavBar>
          <SearchBar
            placeholder="Search"
            ref={ref => this.autoFocusInst = ref}
            onChange={search}
          />
          <div className="divider 1px zb-b-t"></div>
          <TickerList items={filtedTickers} loading={list.loading} dispatch={dispatch} market={market} />
        </div>
      )
  }
}
export default connect(
  ({sockets:{loopringTickers,tickers}})=>({
    loopringTickers,
    market:tickers.filters && tickers.filters.market
  })
)(ListPlaceOrderTickers)

