import React, {Component} from 'react';
import PropTypes from 'prop-types'

import styles from './ApiDetail.css'
import {injectIntl, IntlProvider, FormattedMessage} from 'react-intl';

import {Row, Col, Table, BackTop} from 'antd'

// UI组件
class ApiDetailUI extends Component {

    constructor(props) {
        super(props);
        this.state = {clickedApi: props.clickedApi}
        this.drawContent = this.drawContent.bind(this);
        this.drawHeaderParam = this.drawHeaderParam.bind(this);
        this.buildColumnHeaders = this.buildColumnHeaders.bind(this);
        this.drawPathParam = this.drawPathParam.bind(this);
        this.drawFormParam = this.drawFormParam.bind(this);
        this.drawBodyParam = this.drawBodyParam.bind(this);
        this.loadAllKey = this.loadAllKey.bind(this);
        this.drawExtraDesc = this.drawExtraDesc.bind(this);
        this.drawResponseParam = this.drawResponseParam.bind(this);
    }

    componentWillMount(){
        console.log('ApiDetailUI','componentWillMount')
    }

    /**
     * 当组件的props改变时, 会被调用
     * @param nextProps 新的props
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            clickedApi: nextProps.clickedApi
        })
    }

    /**
     * 用于性能优化, 返回false时,表示组件不需要重新render, 返回true说明需要
     * @param nextProps 新props值
     * @param nextState 新state值
     */
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.clickedApi !== this.state.clickedApi || this.props.intl.locale !== nextProps.intl.locale) {
            console.log('ApiDetailUI', 'shouldComponentUpdate', true)
            return true;
        } else {
            return false;
        }
    }

    drawResponseParam() {
        const {clickedApi} = this.state;
        if (typeof (clickedApi) !== 'undefined' && typeof (clickedApi.responseArr) !== 'undefined' && null != clickedApi.responseArr && clickedApi.responseArr.length > 0) {
            const {formatMessage} = this.props.intl;
            const columns = this.buildColumnHeaders();
            const responseContentArr = [];
            let key = 0;
            for (const singleResponse of clickedApi.responseArr) {
                if (typeof (singleResponse.responseStructArr) !== 'undefined' && null != singleResponse.responseStructArr) {
                    const dataSource = singleResponse.responseStructArr;
                    responseContentArr.push(
                        <div key={++key}>
                            <div className='__responseItem'>
                                <strong>{singleResponse.code}</strong><span>{singleResponse.description}</span>
                            </div>
                            <Table dataSource={dataSource} columns={columns} size="small" pagination={false}
                                   defaultExpandAllRows={true}/>
                        </div>
                    )
                } else {
                    responseContentArr.push(
                        <div key={++key} className='__responseItem'>
                            <strong>{singleResponse.code}</strong><span>{singleResponse.description}</span>
                        </div>
                    )
                }
            }
            return (
                <div className='__responseContainer'>
                    {responseContentArr}
                </div>
            )
        }
    }

    drawExtraDesc() {
        const {clickedApi} = this.state;
        if (typeof (clickedApi.description) !== 'undefined') {
            const {formatMessage} = this.props.intl;
            return (
                <div>
                    <h2 className='tabTitle'>{formatMessage({id: 'additional_instructions'})}</h2>
                    <div dangerouslySetInnerHTML={{__html: clickedApi.description}}></div>
                </div>
            )
        }
    }

    loadAllKey(data) {
        let arr = [];
        if (data instanceof Array) {
            for (let item of data) {
                const tmpArr = this.loadAllKey(item);
                arr = [...arr, ...tmpArr];
            }
        } else {
            arr.push(data.key);
            if (typeof (data.children) !== 'undefined') {
                const tmpArr = this.loadAllKey(data.children);
                arr = [...arr, ...tmpArr];
            }
        }
        return arr;
    }

    drawBodyParam() {
        const {clickedApi} = this.state;
        if (typeof (clickedApi) !== 'undefined' && typeof (clickedApi.bodyParams) !== 'undefined' && null != clickedApi.bodyParams && clickedApi.bodyParams.length > 0) {
            const {formatMessage} = this.props.intl;
            const dataSource = clickedApi.bodyParams;
            const columns = this.buildColumnHeaders();
            return (
                <div>
                    <h3>{formatMessage({id: 'req_body'})}</h3>
                    <Table dataSource={dataSource} columns={columns} size="small" pagination={false}
                           defaultExpandAllRows={true} />
                </div>
            )
        }
    }

    buildColumnHeaders() {
        const {formatMessage} = this.props.intl;
        const yes = <span style={{color:'#fa8c16'}}>{formatMessage({id: 'YES'})}</span>;
        const no = formatMessage({id: 'NO'});
        return [{
            title: formatMessage({id: 'paramName'}),
            width: 100,
            dataIndex: 'name',
            key: 'name',
            render: (val, record, index) => {
                return record.required ? <span style={{color:'#fa8c16'}}>{val}</span> : val
            }
        }, {
            title: formatMessage({id: 'paramType'}),
            dataIndex: 'type',
            width: '12%',
            key: 'type',
        }, {
            title: formatMessage({id: 'must'}),
            dataIndex: 'required',
            width: '10%',
            key: 'required',
            render: (val, record, index) => {
                return val ? yes : no
            }
        }, {
            title: formatMessage({id: 'summary'}),
            width: '33%',
            dataIndex: 'description',
            key: 'description',
        }];
    }

    drawFormParam() {
        const {clickedApi} = this.state;
        if (typeof (clickedApi) !== 'undefined' && typeof (clickedApi.formParams) !== 'undefined' && null != clickedApi.formParams && clickedApi.formParams.length > 0) {
            const columns = this.buildColumnHeaders();
            const dataSource = clickedApi.formParams;
            const {intl: {formatMessage}} = this.props;
            return (
                <div>
                    <h3>{formatMessage({id: 'req_form'})}</h3>
                    <Table dataSource={dataSource} columns={columns} size="small" pagination={false}/>
                </div>
            )
        }
    }

    /**
     * 输出路径参数的reactNode
     * @param {array<object>} clickedApi
     */
    drawPathParam() {
        const {clickedApi} = this.state;
        if (typeof (clickedApi) !== 'undefined' && typeof (clickedApi.pathParams) !== 'undefined' && null != clickedApi.pathParams && clickedApi.pathParams.length > 0) {
            const {intl: {formatMessage}} = this.props;
            const dataSource = clickedApi.pathParams;
            const columns = this.buildColumnHeaders();
            return (
                <div>
                    <h3>{formatMessage({id: 'req_path'})}</h3>
                    <Table dataSource={dataSource} columns={columns} size="small" pagination={false}/>
                </div>
            )
        } else {
            return '';
        }
    }

    drawHeaderParam() {
        const {clickedApi} = this.state;
        if (typeof (clickedApi) !== 'undefined' && typeof (clickedApi.headerParams) !== 'undefined' && null != clickedApi.headerParams && clickedApi.headerParams.length > 0) {
            const {intl: {formatMessage}} = this.props;
            const dataSource = clickedApi.headerParams;
            const columns = this.buildColumnHeaders();
            return (
                <div>
                    <h3>{formatMessage({id: 'req_header'})}</h3>
                    <Table dataSource={dataSource} columns={columns} size="small" pagination={false}/>
                </div>
            )
        } else {
            return '';
        }
    }

    drawFileParam(){
        const {clickedApi} = this.state;
        if (typeof (clickedApi) !== 'undefined' && typeof (clickedApi.fileParams) !== 'undefined' && null != clickedApi.fileParams && clickedApi.fileParams.length > 0) {
            const {intl: {formatMessage}} = this.props;
            const dataSource = clickedApi.fileParams;
            const columns = this.buildColumnHeaders();
            return (
                <div>
                    <h3>{formatMessage({id: 'req_file'})}</h3>
                    <Table dataSource={dataSource} columns={columns} size="small" pagination={false}/>
                </div>
            )
        } else {
            return '';
        }
    }

    /**
     * 数据响应数据格式
     * @param produces
     * @returns {*}
     */
    printRespContentType(produces) {
        if (typeof (produces) === 'undefined' || produces.length === 0) {
            return 'application/json;charset=UTF-8';
        } else {
            return produces;
        }
    }

    printReqContentType(clickedApi){
        const consumes = clickedApi.consumes;
        if (typeof (consumes) !== 'undefined' && null!==consumes && consumes.length > 0) {
            return consumes;
        } else {
            if(clickedApi.bodyParams.length>0){
                return 'application/json;charset=UTF-8';
            }else{
                if("GET"===clickedApi.method.toUpperCase()||"DELETE"===clickedApi.method.toUpperCase()){
                    return '*/*';
                }else{
                    return 'application/x-www-form-urlencoded; charset=UTF-8';
                }
            }
        }
    }

    drawContent() {
        const clickedApi = this.state.clickedApi;
        const {intl: {formatMessage}} = this.props;

        if (typeof (clickedApi) !== 'undefined' && null !== clickedApi) {
            return (
                <div className='animated bounceInUp'>
                    <h2 className='docNamePanel'>{clickedApi.name} <i
                        style={{color: '#999', fontSize: 14}}>{clickedApi.tagDesc}</i></h2>
                    <div className='uriPanel'>
                        <strong
                            className={clickedApi.method}>{clickedApi.method ? clickedApi.method.toUpperCase() : ''}</strong><span>{clickedApi.path}</span>
                    </div>
                    <Row className='dataTypePanel'>
                        <Col
                            span={12}><strong>{formatMessage({id: 'request_data_type'})}</strong><span>{this.printReqContentType(clickedApi)}</span></Col>
                        <Col
                            span={12}><strong>{formatMessage({id: 'response_data_type'})}</strong><span>{this.printRespContentType(clickedApi.produces)}</span></Col>
                    </Row>
                    <h2 className='tabTitle'>{formatMessage({id: 'req_param_desc'})}</h2>
                    {this.drawHeaderParam()}
                    {this.drawPathParam()}
                    {this.drawFormParam()}
                    {this.drawBodyParam()}
                    {this.drawFileParam()}
                    {this.drawExtraDesc()}
                    <h2 className='tabTitle'>{formatMessage({id: 'resp_param_desc'})}</h2>
                    {this.drawResponseParam()}
                    <BackTop target={()=>document.getElementById('___docDetailContent')}/>
                </div>
            )
        }
    }

    render() {
        return (
            <div className='docDetailContent' id='___docDetailContent'>
                {this.drawContent()}
            </div>
        );
    }

}

// 指定props参数,如果没有需要删除这段代码
ApiDetailUI.propTypes = {
    clickedApi: PropTypes.object
}

export default injectIntl(ApiDetailUI);
