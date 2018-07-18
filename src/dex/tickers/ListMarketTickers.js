import React from 'react'
import {connect} from 'dva'
import {TickersFm,TickerFm,sorterByMarket,sorterByPirce,sorterByChange} from 'modules/tickers/formatters'
import storage from '../../modules/storage'
import intl from 'react-intl-universal'
import routeActions from 'common/utils/routeActions'
import { ListView,Button,Tabs } from 'antd-mobile'
import { Spin,Icon } from 'antd'
import { getMarketTickersBySymbol } from './formatters'
import Worth from 'modules/settings/Worth'
import {formatPrice} from 'modules/orders/formatters'
import markets from 'modules/storage/markets'
import {configs} from 'common/config/data'

export const TickerHeader = ({sort,dispatch})=>{
  const sortByType = (type) => {
    dispatch({
      type:'sockets/extraChange',
      payload:{
        id:'loopringTickers',
        extra:{
          sort: {
            sortBy:type ,
            orderBy:sort.orderBy === 'ASC' ? 'DESC' : 'ASC'
          }
        }
      }
    })
  }
  return (
    <div className="row ml0 mr0 pt5 pb5 pl10 pr10 align-items-center no-gutters">
      <div className="col-5 fs13 color-black-4 text-left" onClick={sortByType.bind(this, 'market')}>
        {intl.get('common.market')}{sort.sortBy === 'market' && <Icon type={sort.orderBy === 'ASC' ? 'up' : 'down'} />}
      </div>
      <div className="col text-left pr10">
        <div className="fs13 color-black-4 " onClick={sortByType.bind(this, 'price')}>
          {intl.get('common.price')}{sort.sortBy === 'price' && <Icon type={sort.orderBy === 'ASC' ? 'up' : 'down'} />}
        </div>
      </div>
      <div className="col-3 text-right">
        <div className="fs13 color-black-4" onClick={sortByType.bind(this, 'change')}>
          {intl.get('ticker.change')}{sort.sortBy === 'change' && <Icon type={sort.orderBy === 'ASC' ? 'up' : 'down'} />}
        </div>
      </div>
    </div>
  )
}

export const TickerItem = ({item,actions,key,tickersList,dispatch})=>{
    if(!item){ return null }
    const {extra:{favored={}, sort={}, keywords}} = tickersList
    const tickerFm = new TickerFm(item)
    const tokens = tickerFm.getTokens()
    const direction = tickerFm.getChangeDirection()
    const gotoDetail = ()=>{
      routeActions.gotoPath(`/dex/markets/${item.market}`)
    }
    const toggleTickerFavored = (item, e)=>{
      e.stopPropagation();
      dispatch({
        type:'sockets/extraChange',
        payload:{
          id:'loopringTickers',
          extra:{
            favored:{...favored,[item]:!favored[item]},
          }
        }
      })
      markets.toggleFavor(item)
    }
    return (
      <div className="row ml0 mr0 p10 align-items-center no-gutters hover-default zb-b-b" onClick={gotoDetail}>
        <div className="col-5 text-left">
          <span onClick={toggleTickerFavored.bind(this, item.market)} className="fs16 color-black-1 font-weight-bold-bak lh15">{tokens.left}</span>
          <span onClick={toggleTickerFavored.bind(this, item.market)} className="fs14 color-black-4"> / {tokens.right}</span>
          <br/>
          <span onClick={toggleTickerFavored.bind(this, item.market)} className="fs14 color-black-4">
            <span className="fs14" >
              {
                favored[item.market] &&
                <Icon type="star" className="text-primary"/>
              }
              {
                !favored[item.market] &&
                <Icon type="star-o" className=""/>
              }
              <span className="ml5">Vol {tickerFm.getVol()}</span>
            </span>
          </span>
        </div>
        <div className="col text-left pr10">
          <div className="fs16 color-black-1 font-weight-bold-bak lh15">{formatPrice(tokens.left, tokens.right, tickerFm.getLast())}</div>
          <div className="fs14 color-black-4"><Worth amount={formatPrice(tokens.left, tokens.right, tickerFm.getLast())} symbol={tokens.right}/></div>
        </div>
        <div className="col-3 text-right">
          {
            direction === 'up' &&
            <Button style={{height:'36px',lineHeight:'36px'}} className="border-none radius-4 pl10 pr10 fs16 bg-success color-white">
             +{tickerFm.getChange()}
            </Button>
          }
          {
            direction === 'down' &&
            <Button style={{height:'36px',lineHeight:'36px'}} className="border-none radius-4 pl10 pr10 fs16 bg-error color-white">
             {tickerFm.getChange()}
            </Button>
          }
          {
            direction === 'none' &&
            <Button style={{height:'36px',lineHeight:'36px'}} className="border-none radius-4 pl10 pr10 fs16 bg-grey-500 color-white">
             {tickerFm.getChange()}
            </Button>
          }
          {
            false &&
            <Button style={{height:'36px',lineHeight:'36px'}} className="border-none radius-4 pl10 pr10 fs16 bg-green-300 color-white">+28.2%</Button>
          }
          {
            false &&
            <Button style={{height:'36px',lineHeight:'36px'}} className="border-none radius-4 pl10 pr10 fs16 bg-success color-white">+50.2%</Button>
          }
          {
            false &&
            <Button style={{height:'36px',lineHeight:'36px'}} className="border-none radius-4 pl10 pr10 fs16 bg-green-700 color-white">+158.2%</Button>
          }
        </div>
      </div>
    )
}
export const TickerList = ({items,loading,dispatch, tickersList})=>{
  const {extra:{sort={}, keywords}} = tickersList
  const sortedItems = [...items]
  if(sort.sortBy) {
    switch(sort.sortBy) {
      case 'market':
        sortedItems.sort(sorterByMarket)
        if(sort.orderBy === 'DESC') {
          sortedItems.reverse()
        }
        break;
      case 'price':
        sortedItems.sort(sorterByPirce)
        if(sort.orderBy === 'DESC') {
          sortedItems.reverse()
        }
        break;
      case 'change':
        sortedItems.sort(sorterByChange)
        if(sort.orderBy === 'DESC') {
          sortedItems.reverse()
        }
        break;
    }
  }

  return (
    <div className="">
      <Spin spinning={loading}>
        <TickerHeader sort={sort} dispatch={dispatch}/>
        <div className="divider 1px zb-b-t"></div>
        {sortedItems.map((item,index)=><TickerItem key={index} item={item} dispatch={dispatch} tickersList={tickersList}/>)}
        {!loading && items.length === 0 &&
          <div className="p10 text-center color-black-3">
            {intl.get('common.list.no_data')}
          </div>
        }
      </Spin>
    </div>
  )
}

class ListMarketTickers extends React.Component {
  constructor(props) {
    super(props);
  }
  render(){
      const {loopringTickers:list,dispatch} = this.props
      const tickersFm = new TickersFm(list)
      const {extra:{favored={},keywords}} = list
      const newMarkets = configs.newMarkets ? configs.newMarkets.map(item => item.toLowerCase()) : []
      const allTickers = tickersFm.getAllTickers().filter(item=>!newMarkets.includes(item.market.toLowerCase()))
      const favoredTickers = tickersFm.getFavoredTickers()
      const recentTickers = tickersFm.getRecentTickers()
      const tabs = [
        { title: <div className="fs16">{intl.get('ticker_list.title_favorites')}</div> },
        { title: <div className="fs16">WETH</div> },
        { title: <div className="fs16">LRC</div> },
        // { title: <div className="fs16">{intl.get('ticker_list.title_innovation')}</div> },
      ]
      if(configs.newMarkets && configs.newMarkets.length > 0){
        tabs.push({ title: <div className="fs16">{intl.get('ticker_list.title_innovation')}</div> })
      }
      return (
          <Tabs
            tabs={tabs}
            tabBarTextStyle={{}}
            initialPage={1}
            swipeable={false}
            onChange={(tab, index) => {}}
            onTabClick={(tab, index) => { }}
          >
            <TickerList items={favoredTickers} loading={list.loading} dispatch={dispatch} tickersList={list}/>
            <TickerList items={getMarketTickersBySymbol("WETH",allTickers)} loading={list.loading} dispatch={dispatch} tickersList={list}/>
            <TickerList items={getMarketTickersBySymbol("LRC",allTickers)} loading={list.loading} dispatch={dispatch} tickersList={list}/>
            <TickerList items={newMarkets} loading={list.loading} dispatch={dispatch} tickersList={list}/>
            <TickerList items={[]} loading={list.loading} dispatch={dispatch} />
          </Tabs>
      )
  }
}
export default connect(
  ({sockets:{loopringTickers}})=>({loopringTickers})
)(ListMarketTickers)

