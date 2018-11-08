import React from 'react';
import {connect} from 'dva';

import PropTypes from 'prop-types'
import router from 'umi/router';
import styles from './Header.css'
import {injectIntl, IntlProvider, FormattedMessage} from 'react-intl';
import Util from '@util/Util'

import DocSearchAutoCompleteUI from './DocSearchAutoCompleteUI'
import ToolbarUI from './ToolbarUI'

import {Row, Col, Modal, Button} from 'antd';


class Header extends React.Component {
    state = {
        visible: false,
        simpleDocInfo: null
    }

    constructor(props) {
        super(props);
        this.onDocSearch = this.onDocSearch.bind(this);
        this.onLanChagne = this.onLanChagne.bind(this);
        this.drawTitlePanel = this.drawTitlePanel.bind(this)
        this.drawProjectInfo = this.drawProjectInfo.bind(this)
        this.hideModalHandle = this.hideModalHandle.bind(this)
        this.testHandle = this.testHandle.bind(this);
    }

    /**
     * 当组件的props改变时, 会被调用
     * @param nextProps 新的props
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            simpleDocInfo: nextProps.simpleDocInfo
        })
    }

    async onDocSearch(docUrlHttpType, docUrlSuffix) {
        const {dispatch} = this.props;
        // 更新url也算更新全局状态
        router.replace(`/${docUrlHttpType}/${encodeURIComponent(docUrlSuffix)}`)
        // 执行这里也算更新全局状态
        dispatch({type: 'DocInfoModel/loadDocData', payload: {docUrlHttpType, docUrlSuffix}});
    }

    componentDidMount() {
        const {type, url, operateId, dispatch} = this.props;
        if (Util.strNotBlank(type) && Util.strNotBlank(url)) {
            dispatch({
                type: 'DocInfoModel/loadDocData',
                payload: {docUrlHttpType: type, docUrlSuffix: url, apiKey: operateId}
            })
        }
    }

    onLanChagne(lanFlag) {
        const {dispatch} = this.props;
        dispatch({type: 'I18nModel/langChange', payload: lanFlag})
    }

    drawTitlePanel() {
        if (this.state.simpleDocInfo) {
            return (<div className={styles.title + ' animated fadeInRight'}
                         onClick={(e) => this.setState({visible: !this.state.visible})}>
                {this.state.simpleDocInfo.title}</div>)
        } else {
            return (<div className={styles.title}>蚀刻:Swagger UI主题</div>)
        }
    }

    drawProjectInfo() {
        const {simpleDocInfo} = this.state;
        if (simpleDocInfo) {
            const {formatMessage} = this.props.intl;
            return (<div className='projectInfo'>
                <h3>{simpleDocInfo.title}</h3>
                <div>
                    <strong>{formatMessage({id: 'version'})}:</strong><span>{simpleDocInfo.version}</span>
                </div>
                <div>
                    <strong>{formatMessage({id: 'principal'})}:</strong><span>{simpleDocInfo.major}</span>
                </div>
                <strong>{formatMessage({id: 'description'})}:</strong>
                <p>{simpleDocInfo.description}</p>
            </div>)
        } else {
            return '';
        }
    }

    hideModalHandle() {
        this.setState({
            visible: false
        })
    }

    testHandle(e){
        e.preventDefault()
        this.props.dispatch({type:'IndexModel/toggleDrawer'})
    }

    render() {
        const {type, url, I18nModel: {langArr}} = this.props;
        const {simpleDocInfo} = this.state;
        const {formatMessage} = this.props.intl;
        return (
            <div className='__header'>
                <Row className={styles.maxHeight}>
                    <Col span={5} className='maxHeight'>
                        {this.drawTitlePanel()}
                        <div className='__divider'></div>
                    </Col>
                    <Col span={19} className={styles.maxHeight}>
                        <div className={styles.docSearchAutoComplete}>
                            <DocSearchAutoCompleteUI
                                onDocSearch={this.onDocSearch}
                                placeholder={formatMessage({id: 'doc_search'})} type={type} url={url}/>
                        </div>
                        <div className={styles.toolbar}><ToolbarUI langArr={langArr}
                                                                   onLanChagne={this.onLanChagne} onTestHandle={this.testHandle}></ToolbarUI>
                        </div>
                    </Col>
                </Row>
                <Modal
                    visible={this.state.visible}
                    title={formatMessage({id: 'api_doc_info'})}
                    onOk={this.hideModalHandle}
                    onCancel={this.hideModalHandle}
                >
                    {this.drawProjectInfo()}
                </Modal>
            </div>
        );
    }
}

Header.propTypes = {
    type: PropTypes.string,
    url: PropTypes.string,
    operateId: PropTypes.string,
}

const I18nHeader = injectIntl(Header)

// 复制全局state中的属性到组件的props中
function mapStateToProps(state) {
    return {I18nModel: state.I18nModel, simpleDocInfo: state.DocInfoModel.simpleDocInfo};
}

export default connect(mapStateToProps)(I18nHeader);
