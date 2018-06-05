import React from 'react';
import { List, InputItem,Button,WingBlank,Slider, Tabs, WhiteSpace, Badge,SegmentedControl, NavBar, Icon,Modal,Switch } from 'antd-mobile';
import { Icon as WebIcon,Switch as WebSwitch } from 'antd';
import { createForm } from 'rc-form';
import PlaceOrerConfirm from './PlaceOrderConfirm';
const Item = List.Item;
const Brief = Item.Brief;

const tabs = [
  { title: <Badge count={2}>Balances</Badge> },
  { title: <Badge >Open Orders</Badge> },
  { title: <Badge >My Fills</Badge> },
];

// 通过自定义 moneyKeyboardWrapProps 修复虚拟键盘滚动穿透问题
// https://github.com/ant-design/ant-design-mobile/issues/307
// https://github.com/ant-design/ant-design-mobile/issues/163
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class PlaceOrder extends React.Component {
  state = {
    type: 'money',
  }
  render() {
    const { getFieldProps } = this.props.form;
    const { type } = this.state;
    return (
      <div className="bg-grey-100">
        <NavBar
          mode="light"
          icon={null && <Icon type="left" />}
          onLeftClick={() => console.log('onLeftClick')}
          rightContent={null && [
            <Icon key="1" type="ellipsis" />,
          ]}
          leftContent={[
            <WebIcon key="1" type="menu-fold" />,
          ]}
        >
        LRC-WETH
        </NavBar>
        <div className="row ml0 mr0 bg-white zb-b-t" style={{positiom:'relative',zIndex:'10'}}>
          <div className="col-6 text-center fs20 color-black pt15 pb15 zb-b-b " >Buy LRC</div>
          <div className="col-6 text-center fs20 pt15 pb15 zb-b-l font-weight-bold color-red-500 " >Sell LRC</div>
        </div>
        <List className="bg-none no-border">
          <InputItem
            {...getFieldProps('money3')}
            type={type}
            placeholder="0.00000000"
            clear
            moneyKeyboardAlign="left"
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            extra={<WebIcon type="profile" />}
          >Price</InputItem>
          <InputItem
            type={type}
            placeholder="0.00000000"
            clear
            moneyKeyboardAlign="left"
            onChange={(v) => { console.log('onChange', v); }}
            onBlur={(v) => { console.log('onBlur', v); }}
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            extra={<WebIcon type="profile" />}
          >Amount</InputItem>
          {
            true &&
            <InputItem
              type={type}
              placeholder="0.00000000"
              extra={<span className="fs16 color-black-4">{null && "WETH"}</span>}
              clear
              moneyKeyboardAlign="left"
              onChange={(v) => { console.log('onChange', v); }}
              onBlur={(v) => { console.log('onBlur', v); }}
              moneyKeyboardWrapProps={moneyKeyboardWrapProps}
              editable={false}
            >Total</InputItem>
          }
          {
            false &&
            <InputItem
              type={type}
              placeholder="0.00000000"
              extra={<span className="fs16 color-black-4">{null && "LRC"}</span>}
              clear
              moneyKeyboardAlign="left"
              onChange={(v) => { console.log('onChange', v); }}
              onBlur={(v) => { console.log('onBlur', v); }}
              moneyKeyboardWrapProps={moneyKeyboardWrapProps}
              editable={false}
            >LRC Fee</InputItem>
          }
          {
            false &&
            <InputItem
              type={type}
              placeholder="06-10 12:00"
              extra={<span className="fs16 color-black-4">{null && "WETH"}</span>}
              clear
              moneyKeyboardAlign="left"
              onChange={(v) => { console.log('onChange', v); }}
              onBlur={(v) => { console.log('onBlur', v); }}
              moneyKeyboardWrapProps={moneyKeyboardWrapProps}
              editable={false}
            >TTL</InputItem>
          }
          <Item>
            <div className="row align-items-center ml0 mr0 mb15 mt10">
              <div className="col color-black-3 fs16 pl0">Advanced</div>
              <div className="col-auto color-black-3 fs16 pr0"><WebSwitch size="" /></div>
            </div>
            <Button className="w-100 d-block mb10" type="warning">Place Sell Order</Button>
          </Item>
        </List>
        <div className="bg-grey-100 mt20">
          <Tabs tabs={tabs}
            initialPage={0}
            onChange={(tab, index) => { console.log('onChange', index, tab); }}
            onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
          >
            <div className="">
              <table className="w-100">
                <thead>
                  <tr className="">
                    <th className="text-right bg-grey-100 pl10 pr10 pt5 pb5 font-weight-normal color-black-3">Token</th>
                    <th className="text-right bg-grey-100 pl10 pr10 pt5 pb5 font-weight-normal color-black-3">Balance</th>
                    <th className="text-right bg-grey-100 pl10 pr10 pt5 pb5 font-weight-normal color-black-3">OrderRequired</th>
                    <th className="text-center bg-grey-100 pl10 pr10 pt5 pb5 font-weight-normal color-black-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                    <tr >
                      <td className="p10 color-black-2 text-right">LRC</td>
                      <td className="p10 color-black-2 text-right">12680.0000</td>
                      <td className="p10 color-black-2 text-right">1000.0000</td>
                      <td className="p10 color-black-2 text-center">
                        {false && <a className="mr10" >转入</a> }
                        {false && <a className="ml5" >买入</a> }
                        <WebIcon className="text-warning" type="exclamation-circle" />
                      </td>
                    </tr>
                    <tr >
                      <td className="p10 color-black-2 text-right">ETH</td>
                      <td className="p10 color-black-2 text-right">85.0000</td>
                      <td className="p10 color-black-2 text-right">45.0000</td>
                      <td className="p10 color-black-2 text-center">
                        {false && <a className="mr10" >转入</a> }
                        {false && <a className="ml5" >买入</a> }
                        <WebIcon className="text-success" type="check-circle" />
                      </td>
                    </tr>
                    <tr >
                      <td className="p10 color-black-2 text-right">WETH</td>
                      <td className="p10 color-black-2 text-right">21.3652</td>
                      <td className="p10 color-black-2 text-right">26.1278</td>
                      <td className="p10 color-black-2 text-center">
                        { false && <a className="mr10" >转换</a> }
                        { false && <a className="ml5" >买入</a> }
                        { false && <WebIcon className="text-down" type="exclamation-circle" />}
                        <WebIcon className="text-success" type="check-circle" />
                      </td>
                    </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-100">
                <thead>
                  <tr>
                    <th className="text-center bg-grey-100 pl10 pr10 pt5 pb5 font-weight-normal color-black-3">Side</th>
                    <th className="text-right bg-grey-100 pl10 pr10 pt5 pb5 font-weight-normal color-black-3">Price</th>
                    <th className="text-right bg-grey-100 pl10 pr10 pt5 pb5 font-weight-normal color-black-3">Amount</th>
                    <th className="text-right bg-grey-100 pl10 pr10 pt5 pb5 font-weight-normal color-black-3">Filled</th>
                    <th className="text-center bg-grey-100 pl10 pr10 pt5 pb5 font-weight-normal color-black-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    [1,2,3,4,5].map((item,index)=>
                      <tr key={index} className="color-black-2">
                        { index%2 == 0 && <td className="p10 text-center text-up">Buy</td> }
                        { index%2 == 1 && <td className="p10 text-center text-down">Sell</td> }
                        <td className="p10 text-right">0.00095</td>
                        <td className="p10 text-right">1000</td>
                        <td className="p10 text-right">80%</td>
                        <td className="p10 text-center">
                        { index === 0 && <WebIcon className="text-warning" type="exclamation-circle" /> }
                        { index === 1 && <WebIcon className="text-primary" type="clock-circle" /> }
                        { index === 2 && <WebIcon className="text-success" type="check-circle" /> }
                        { index === 3 && <WebIcon className="color-grey-300" type="close-circle" /> }
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
            </div>
            <div style={{minHeight: '150px'}}>

            </div>
          </Tabs>
        </div>

        {
          false &&
          <div className="p10 bg-white" style={{position:'absolute',bottom:'0',left:'0',right:'0'}}>
            <Button className="w-100 d-block" type="primary">Place Buy Order</Button>
          </div>
        }
        <PlaceOrderConfirmPopup />
      </div>
    );
  }
}

const PlaceOrderConfirmPopup = ()=>{
  return (
    <Modal
      popup
      visible={false}
      onClose={()=>{}}
      animationType="slide-up"
    >
      <PlaceOrerConfirm />
    </Modal>
  )
}

const PlaceOrderForm = createForm()(PlaceOrder);
export default PlaceOrderForm

