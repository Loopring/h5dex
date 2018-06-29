import React from 'react';
import { connect } from 'dva';
import { Button,NoticeBar } from 'antd-mobile';
import { Switch,Icon as WebIcon } from 'antd';
import routeActions from 'common/utils/routeActions'
import {getTokensByMarket} from 'modules/formatter/common'
import * as tokenFormatter from 'modules/tokens/TokenFm'
import {FormatAmount} from 'modules/formatter/FormatNumber'
import {toNumber,toBig,toFixed} from "LoopringJS/common/formatter";
import intl from 'react-intl-universal'

const HelperOfBalance = (props)=>{
  const {dispatch,pair,balance} = props
  const marketTokens = getTokensByMarket(pair)
  const showLayer = (payload={})=>{
    dispatch({
      type:'layers/showLayer',
      payload:{
        ...payload
      }
    })
  }
  const tokens = getTokensByMarket(pair)
  const relatedTokens = new Array()
  const balanceL = {
    symbol:tokens.left,
    name:tokens.left,
    ...tokenFormatter.getBalanceBySymbol({balances:balance, symbol:tokens.left, toUnit:true}),
  }
  const balanceR = {
    symbol:tokens.right,
    name:tokens.right,
    ...tokenFormatter.getBalanceBySymbol({balances:balance, symbol:tokens.right, toUnit:true})
  }
  relatedTokens.push(balanceL)
  relatedTokens.push(balanceR)
  // if(tokens.right === 'WETH') {
  //   relatedTokens.push({
  //     symbol:'ETH',
  //     name:'ETH',
  //     ...tokenFormatter.getBalanceBySymbol({balances:balance, symbol:'ETH', toUnit:true})
  //   })
  // }
  const gotoReceive = (payload)=>{
    showLayer({id:'receiveToken',...payload})
  }
  const showActions = (payload)=>{
    showLayer({id:'helperOfTokenActions',...payload})
  }

  const gotoConvert = (payload)=>{
    routeActions.gotoPath('/dex/convert')
  }
  const gotoAll = (payload)=>{
    // TODO
    // routeActions.gotoPath('/dex/convert')
  }

  return (
    <div className="fs20">
      <table className="w-100 fs13">
        <thead>
          <tr className="">
            <th className="text-left zb-b-b pl10 pr10 pt5 pb5 font-weight-normal color-black-3 text-nowrap">{intl.get('common.token')}</th>
            <th className="text-left zb-b-b pl10 pr10 pt5 pb5 font-weight-normal color-black-3 text-nowrap">{intl.get('common.balance')}</th>
            <th hidden className="text-left zb-b-b pl10 pr10 pt5 pb5 font-weight-normal color-black-3 text-nowrap">交易授权</th>
            <th hidden className="text-left zb-b-b pl10 pr10 pt5 pb5 font-weight-normal color-black-3">{intl.get('helper_of_market_order.selling')}</th>
            <th className="text-right zb-b-b pl10 pr10 pt5 pb5 font-weight-normal color-black-3">{intl.get('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
            {
              relatedTokens.map((token,index)=>
                <tr key={index} onClick={()=>{}}>
                  <td className="pl10 pr10 pt10 pb10 zb-b-b color-black-2 text-left">
                    {token.symbol}
                    <span hidden className="color-black-3 ml5">{token.name}</span>
                  </td>
                  <td className="pl10 pr10 pt10 pb10 zb-b-b color-black-2 text-left">{toFixed(token.balance, 8)}</td>
                  <td hidden className="pl10 pr10 pt10 pb10 zb-b-b color-black-2 text-left">
                    {
                      token.symbol !== 'ETH' && index === 0 && <Switch size="small" loading={true} />
                    }
                    {
                      token.symbol !== 'ETH' && index === 1 && <Switch size="small" loading={false} checked={true} />
                    }
                  </td>
                  <td hidden className="pl10 pr10 pt10 pb10 zb-b-b color-black-2 text-left">0.00</td>
                  <td className="pl10 pr10 pt10 pb10 zb-b-b color-black-2 text-right text-nowrap">
                    {
                      token.symbol === 'ETH' &&
                      <Button onClick={gotoConvert.bind(this,{type:"eth2weth"})} type="primary" style={{height:'24px',lineHeight:'24px'}} className="d-inline-block" size="small">{intl.get('common.convert')}</Button>
                    }
                    {
                      token.symbol === 'WETH' &&
                      <Button onClick={gotoConvert.bind(this,{type:"weth2eth"})} type="primary" style={{height:'24px',lineHeight:'24px'}} className="d-inline-block" size="small">{intl.get('common.convert')}</Button>
                    }
                    <Button onClick={showActions.bind(this,{symbol:token.symbol})} type="ghost" style={{height:'24px',lineHeight:'24px'}} className="d-inline-block ml10" size="small">
                      <WebIcon type="ellipsis" />
                    </Button>
                  </td>
                </tr>
              )
            }
        </tbody>
      </table>
      <div className="p10 mb15">
        <NoticeBar onClick={routeActions.gotoPath.bind(this,'/dex/usercenter')} className="text-left t-primary s-lg-bak shape-rounded"
                   icon={<WebIcon type="exclamation-circle-o"/>}
                   mode="link" marqueeProps={{loop: true}} action={<span>全部资产<WebIcon type="right"/></span>}>
          当前仅显示{pair}的资产
        </NoticeBar>
      </div>
    </div>
  )
}
export default connect(({
  placeOrder:{pair},
  sockets,
})=>({
  pair,balance:sockets.balance.items
}))(HelperOfBalance)





