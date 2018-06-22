import React from 'react';
import { Button,Toast,Card } from 'antd-mobile';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import Notification from '../../common/loopringui/components/Notification'
import intl from 'react-intl-universal';
import {toBig,toFixed} from "LoopringJS/common/formatter";
import {getBalanceBySymbol} from "../../modules/tokens/TokenFm";
import TokenFormatter from '../../modules/tokens/TokenFm';
import config from '../../common/config'
import {connect} from 'dva'
import routeActions from 'common/utils/routeActions'

export default class Receive extends React.Component {
  state = {
    symbol: null,
    amount: toBig(0),
    address:''
  };

  componentDidMount(){
    const {receiveToken} = this.props;
    const {symbol} = receiveToken;
    const _this = this;
    window.Wallet.getCurrentAccount().then(res => {
      if(res.result){
        this.setState({address:res.result})
        if (symbol) {
          const tf = new TokenFormatter({symbol});
          const owner = res.result;
          window.RELAY.account.getEstimatedAllocatedAllowance({owner,token:symbol.toUpperCase(),delegateAddress:config.getDelegateAddress()}).then(res => {
            if (!res.error) {
              const orderAmount = res.result;
              if (symbol.toUpperCase() === "LRC") {
                window.RELAY.account.getFrozenLrcFee(owner).then(response => {
                  let amount;
                  if (!response.error) {
                    const lrcFee = response.result;
                    amount = tf.getUnitAmount(toBig(orderAmount).plus(toBig(lrcFee)));
                  } else {
                    amount = tf.getUnitAmount(toBig(orderAmount));
                  }
                  _this.setState({symbol, amount});
                })
              } else {
                const amount = tf.getUnitAmount(toBig(orderAmount));
                _this.setState({symbol, amount});
              }
            }
          });
        }
      }
    })
  }

  getNeeded = () => {
    const {symbol,amount} = this.state;
    if(symbol && window.WALLET){
      const {balance} = this.props;
      const asset = getBalanceBySymbol({balances: balance.items, symbol, toUnit: true});
      if(!asset){ return toFixed(toBig(0),8) }
      return  toFixed(toBig(amount).minus(asset.balance).isPositive() ? toBig(amount).minus(asset.balance) : toBig(0),8,true);
    }
    return toFixed(toBig(0),8);
  };


  render(){
    const {address,symbol,amount} =  this.state
    const copyAddress = ()=>{ copy(address) ?  Toast.info('复制成功') : Toast.fail(' 复制失败') }
    return (
      <Card >
        <Card.Header  title = {<div className="fs18">{intl.get('receive.receive_title')}</div>}/>
        <Card.Body className="text-center">
          <QRCode value={address} size={240} level='H'/>
          {symbol  && toBig(amount).gt(0) && toBig(this.getNeeded()).gt(0) && <div className='fs3 color-black-1 text-center mt10 mb10'>
            {intl.get('receive.receive_value_tip')} {this.getNeeded()}  {symbol.toUpperCase()}
          </div>}

          <div className="pt10 fs14 text-left" style={{width:'240px',margin:'0 auto',whiteSpace:'wrap',wordBreak:'break-all'}}>
            {address}
            <Button type="primary" size="" className="d-block w-100 mt10" onClick={copyAddress}>{intl.get('common.copy')}</Button>
          </div>
        </Card.Body>
      </Card>
    )
  }
}

