import React from 'react'

import {connect} from 'dva'
import {injectIntl, IntlProvider, FormattedMessage} from 'react-intl'
import '../global.less'
import pathToRegexp from 'path-to-regexp'

import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';

import {Row, Col, LocaleProvider, Button, Drawer} from 'antd'

import Header from '@pages/header/Header'
import ApiList from '@pages/api-list/ApiList'
import ApiTest from '@pages/api-test/ApiTest'

addLocaleData([...en, ...zh]);

// 业务组件
const Index = (props) => {
    console.log('Index', props)
    const {pathname} = props.location;
    const {IndexModel: {leftColSpan, centerColSpan, defaultTheme, showDrawer}, dispatch} = props;
    let re = pathToRegexp("/:type/:url/:tagKey/:apiKey");
    let matchedArr = re.exec(pathname);
    let type = null, url = null, tagId = null, operateId = null
    if (null !== matchedArr && matchedArr.length === 5) {
        type = matchedArr[1].trim();
        url = decodeURIComponent(matchedArr[2].trim());
        tagId = matchedArr[3].trim();
        operateId = matchedArr[4].trim();
    } else {
        re = pathToRegexp("/:tagId/:operateId");
        matchedArr = re.exec(pathname);
        if (null !== matchedArr && matchedArr.length === 3) {
            type = matchedArr[1].trim();
            url = decodeURIComponent(matchedArr[2].trim());
        }
    }
    const {I18nModel: {lang}} = props;
    return (
        <IntlProvider locale={lang.flag} messages={lang.intl}>
            <LocaleProvider locale={lang.antd}>
                <div id='rootContainer'>
                    <Header type={type} url={url} operateId={operateId}/>
                    <div className='mainBody'>
                        <Row className='maxHeight'>
                            <Col span={leftColSpan} className='maxHeight'><ApiList tagId={tagId} operateId={operateId}
                                                                                   type={type}
                                                                                   url={url}/></Col>
                            <Col span={centerColSpan} className='maxHeight'>{props.children}</Col>
                        </Row>
                    </div>
                    <div id='_testDocContainer'>
                        <Drawer
                            title={false}
                            width={'33%'}
                            placement="right"
                            closable={false}
                            getContainer={() => document.getElementById('_testDocContainer')}
                            mask={false}
                            className='apiTestPanel'
                            maskClosable={false}
                            visible={showDrawer}
                            style={{
                                height: 'calc(100%)',
                                overflow: 'auto',
                                backgroundColor: "#fcf9fc"
                            }}
                        >
                            <ApiTest />
                        </Drawer>
                    </div>
                </div>
            </LocaleProvider>
        </IntlProvider>
    );
}

// 复制全局state中的属性到组件的props中
function mapStateToProps(state) {
    console.log('Index', '监听到全局状态改变')
    return {I18nModel: state.I18nModel, IndexModel: state.IndexModel};
}

export default connect(mapStateToProps)(Index);
