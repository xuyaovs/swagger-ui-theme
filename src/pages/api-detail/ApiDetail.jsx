import React from 'react';
import {connect} from 'dva';

import ApiDetailUI from './ApiDetailUI'

// 业务组件
const ApiDetail = (props) => {
    const {clickedApi, lang} = props;
    return (
        <ApiDetailUI clickedApi={clickedApi}/>
    );
}


// 复制全局state中的属性到组件的props中
function mapStateToProps(state) {
    return {clickedApi: state.DocInfoModel.clickedApi};
}

export default connect(mapStateToProps)(ApiDetail);
