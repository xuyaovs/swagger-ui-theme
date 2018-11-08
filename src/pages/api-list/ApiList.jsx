import React from 'react';
import {connect} from 'dva';

import {injectIntl, IntlProvider, FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types'

import ApiListUI from './ApiListUI'

const onApiClicked = (operateId, dispatch) => {
    dispatch({type: 'DocInfoModel/findClickedApi', payload: operateId})
}

// 业务组件
const ApiList = (props) => {
    const {intl: {formatMessage}, apiInfoMap, dispatch} = props;
    return (
        <ApiListUI type={props.type} url={props.url} tagId={props.tagId} operateId={props.operateId}
                   placeholder={formatMessage({id: 'interface_search'})}
                   apiInfoMap={apiInfoMap} onApiClicked={(e) => onApiClicked(e, dispatch)}/>
    );
}

ApiList.propTypes = {
    type: PropTypes.string,
    url: PropTypes.string,
    operateId: PropTypes.string,
    tagId: PropTypes.string,
}

// 复制全局state中的属性到组件的props中
function mapStateToProps(state) {
    return {apiInfoMap: state.DocInfoModel.apiInfoMap, lang: state.I18nModel.lang};
}

export default connect(mapStateToProps)(injectIntl(ApiList));
