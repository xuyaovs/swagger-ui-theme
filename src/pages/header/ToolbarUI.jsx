import React, {Component} from 'react';
import {Menu, Dropdown, Icon} from 'antd';
import PropTypes from 'prop-types'

import {injectIntl, IntlProvider, FormattedMessage} from 'react-intl';

import styles from './Toolbar.css'

// UI组件
class ToolbarUI extends Component {

    constructor(props) {
        console.log('ToolbarUI', props);
        super(props);
        const lanMenu = props.langArr.map((item, index) => <Menu.Item key={index}><a
            onClick={(e) => props.onLanChagne(item.flag)}>{item.txt}</a></Menu.Item>)
        this.state = {
            langMenu: (
                <Menu>
                    {lanMenu}
                </Menu>
            )
        }
    }

    /**
     * 当组件的props改变时, 会被调用
     * @param nextProps 新的props
     */
    UNSAFE_componentWillReceiveProps(nextProps) {

    }

    /**
     * 用于性能优化, 返回false时,表示组件不需要重新render, 返回true说明需要
     * @param nextProps 新props值
     * @param nextState 新state值
     */
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.intl.locale !== nextProps.intl.locale) {
            console.log('ToolbarUI', 'shouldComponentUpdate', true)
            return true;
        }
        return false;
    }

    render() {
        const {langMenu} = this.state;
        const {formatMessage} = this.props.intl;
        return (
            <ul className={styles.toolbarPanel}>
                <li>
                    <Dropdown overlay={langMenu}>
                        <a className="ant-dropdown-link" href="#">
                            <span></span><Icon type="flag" theme="outlined" style={{fontSize: 20}}/>
                        </a>
                    </Dropdown>
                </li>
                {/*<li>*/}
                    {/*<Dropdown overlay={langMenu}>*/}
                        {/*<a className="ant-dropdown-link" href="#">*/}
                            {/*<span></span><Icon type="skin" theme="outlined" style={{fontSize: 20}}/>*/}
                        {/*</a>*/}
                    {/*</Dropdown>*/}
                {/*</li>*/}
                <li>
                    <a className="ant-dropdown-link" href="#" onClick={this.props.onTestHandle}>
                        <span></span><Icon type="api" theme="outlined" style={{fontSize: 20}}/>
                    </a>
                </li>
            </ul>
        );
    }

}

ToolbarUI.propTypes = {
    langArr: PropTypes.array,
    onLanChagne: PropTypes.func,
    onTestHandle:PropTypes.func,
}

const I18nToolbarUI = injectIntl(ToolbarUI)

export default I18nToolbarUI;
