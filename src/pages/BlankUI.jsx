import React from 'react';
import PropTypes from 'prop-types'
import router from 'umi/router';

// 纯粹的UI组件
const BlankUI = (props) => {
    let {params: {type, url='', apiKey='', tagKey=''}} = props.match;
    return (
        <div>
            {router.replace(`/${type}/${url}/${tagKey}/${apiKey}`)}
        </div>
    );
}

// 指定props参数,如果没有需要删除这段代码
BlankUI.propTypes = {
    demo: PropTypes.string
}


export default BlankUI;
