import React from 'react';
import {connect} from 'dva';
import {Select, Row, Col, Button} from 'antd';
import MyTestForm from './TestForm'
import {FormattedMessage} from 'react-intl';

const Option = Select.Option;

function drawTestForm(clickedApi, httpKey, apiUrlPrefix, showDrawer){
    console.log('drawTestForm',showDrawer)
    if(showDrawer){
        return <MyTestForm clickedApi={clickedApi} httpType={httpKey} apiUrlPrefix={apiUrlPrefix}/>
    }
}
function drawTestPanel(clickedApi, httpKey, apiUrlPrefix, showDrawer) {
    if (clickedApi) {
        return (
            <div>
                <Row gutter={16} className='tab'>
                    <Col className="gutter-row" span={20}>
                        <Select defaultValue="doc" style={{width: 'calc(100%)'}}>
                            <Option value="doc">文档环境: {httpKey + apiUrlPrefix+clickedApi.basePath}</Option>
                        </Select>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <Button type="primary" block icon="plus"/>
                    </Col>
                </Row>

                <h3>
                    <strong
                        className={clickedApi.method.toLowerCase()}>{clickedApi.method ? clickedApi.method.toUpperCase() : ''}</strong>
                    <span>{httpKey + apiUrlPrefix +clickedApi.basePath+ clickedApi.path}</span>
                </h3>

                {drawTestForm(clickedApi, httpKey, apiUrlPrefix, showDrawer)}


            </div>
        )
    } else {
        return <h1 style={{height: "100%", width: 30, margin: "40px auto", color: "#8c8c8c"}}>请先选择一个待调试接口</h1>
    }
}

function ApiTest(props) {

    const {DocInfoModel: {clickedApi, docUrlHttpType, docUrlSuffix}, showDrawer} = props;
    let serverResp = '';
    let apiUrlPrefix = docUrlSuffix;
    let httpKey = docUrlHttpType === '1' ? 'http://' : 'https://';
    if (typeof (apiUrlPrefix) !== 'undefined' && null !== apiUrlPrefix) {
        const pos = apiUrlPrefix.indexOf('/');
        if (-1 !== pos) {
            apiUrlPrefix = apiUrlPrefix.substr(0, pos);
        }
    }
    if (typeof (serverResp) !== 'undefined' && null !== serverResp && '' !== serverResp) {
        serverResp = JSON.stringify(serverResp, null, 3);
    }
    return (
        <div>
            {drawTestPanel(clickedApi, httpKey, apiUrlPrefix, showDrawer)}
        </div>
    );
}

function mapStateToProps(state) {
    return {DocInfoModel: state.DocInfoModel, showDrawer: state.IndexModel.showDrawer};
}

export default connect(mapStateToProps)(ApiTest);
