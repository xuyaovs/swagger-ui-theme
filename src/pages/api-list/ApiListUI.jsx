import React, {Component} from 'react';
import PropTypes from 'prop-types'

import menuSearch from '@help/MenuItemSearchHelp';
import router from 'umi/router';

import {Menu, Input} from 'antd';

const SubMenu = Menu.SubMenu;
const Search = Input.Search;

// UI组件
class ApiListUI extends Component {

    constructor(props) {
        super(props);
        this.state = {
            apiInfoMap: props.apiInfoMap,
            queryApiInfoMap: props.apiInfoMap,
            kw: '',
            openedKeys: ['1'],
            defaultSelectedKeys: ['1']
        }
        this.buldMenu = this.buldMenu.bind(this);
        this.onApiQueryHandler = this.onApiQueryHandler.bind(this);
        this.onHandleOpen = this.onHandleOpen.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this);
        this.menuItemClickHandle = this.menuItemClickHandle.bind(this);
    }

    /**
     * 当组件的props改变时, 会被调用
     * @param nextProps 新的props
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.apiInfoMap !== this.state.apiInfoMap) {
            this.setState({
                apiInfoMap: nextProps.apiInfoMap,
                queryApiInfoMap: nextProps.apiInfoMap,
                placeholder: nextProps.placeholder,
                kw: '',
                openedKeys: ['1']
            })
        } else {
            this.setState({
                placeholder: nextProps.placeholder
            })
        }
    }

    /**
     * 用于性能优化, 返回false时,表示组件不需要重新render, 返回true说明需要
     * @param nextProps 新props值
     * @param nextState 新state值
     */
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.placeholder !== this.state.placeholder ||
            nextState.kw !== this.state.kw ||
            nextProps.apiInfoMap !== this.state.apiInfoMap ||
            nextState.openedKeys !== this.state.openedKeys) {
            console.log('ApiListUI', 'shouldComponentUpdate', true)
            return true;
        } else {
            return false;
        }
    }

    onHandleOpen(openedKeys) {
        this.setState({
            openedKeys: openedKeys
        })
    }

    /**
     * 构建菜单
     */
    buldMenu() {
        const queryApiInfoMap = this.state.queryApiInfoMap;
        const menuArr = [];
        if (queryApiInfoMap) {
            for (const apiName in queryApiInfoMap) {
                menuArr.push(
                    <SubMenu key={queryApiInfoMap[apiName].key} title={<span>{apiName}</span>}>
                        {
                            this.buildMenuItem(queryApiInfoMap[apiName].apiArr)
                        }
                    </SubMenu>
                )
            }
        }
        return menuArr;
    }

    /**
     * 构建菜单项
     * @param apiArr
     * @returns {Array}
     */
    buildMenuItem(apiArr) {
        const menuArr = [];
        for (const apiInfo of apiArr) {
            menuArr.push(
                <Menu.Item key={apiInfo.key} title={apiInfo.name}>{apiInfo.name}</Menu.Item>
            )
        }
        return menuArr;
    }

    onApiQueryHandler(e) {
        const val = e.trim();
        const apiInfoMap = this.props.apiInfoMap;
        if ('' === val) {
            const openedKeys = ['1'];
            this.setState({
                queryApiInfoMap: apiInfoMap,
                openedKeys: openedKeys,
                kw: e
            })
        } else {
            const {openedKeys, queriedApiInfoMap} = menuSearch(apiInfoMap, val.toUpperCase());
            this.setState({
                queryApiInfoMap: queriedApiInfoMap,
                openedKeys: openedKeys,
                needRedraw: true
            })
        }
    }

    onKeyUp(e) {
        this.setState({
            kw: e.target.value
        })
    }

    menuItemClickHandle({item, key}) {
        const tagId = item.props.parentMenu.props.eventKey;
        const newPathName = `/blank/${this.props.type}/${encodeURIComponent(this.props.url)}/${tagId}/${key}`;
        router.push(newPathName);
        this.props.onApiClicked(key);
    }

    render() {
        const {placeholder} = this.props;
        const animateClassName = this.state.queryApiInfoMap ? 'animated fadeInDown' : '';
        return (
            <div className='maxHeight'>
                <Search
                    ref='search'
                    placeholder={placeholder}
                    onSearch={this.onApiQueryHandler}
                    style={{width: "80%", marginLeft: "10%", marginTop: 15, marginBottom: 12}}
                    onChange={this.onKeyUp}
                    value={this.state.kw}
                />
                <div className='innerList'>
                    <Menu inlineCollapsed={false} mode="inline" className={animateClassName}
                          onOpenChange={this.onHandleOpen}
                          openKeys={this.state.openedKeys}
                          defaultSelectedKeys={this.state.defaultSelectedKeys}
                          onClick={this.menuItemClickHandle}
                    >
                        {this.buldMenu()}
                    </Menu>
                </div>
            </div>
        );
    }

}

// 指定props参数,如果没有需要删除这段代码
ApiListUI.propTypes = {
    placeholder: PropTypes.string,
    type: PropTypes.string,
    operateId: PropTypes.string,
    tagId: PropTypes.string,
    url: PropTypes.string,
    apiInfoMap: PropTypes.object,
    onApiClicked: PropTypes.func
}

export default ApiListUI;
