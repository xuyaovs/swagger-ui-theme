import React, {Component} from 'react';

import Util from '@support/util/Util';
import PropTypes from 'prop-types'
import styles from './DocSearchAutoComplete.css'

import {Select, AutoComplete, Input} from 'antd'

const InputGroup = Input.Group;
const Option = Select.Option;

// UI组件
class DocSearchAutoCompleteUI extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSourceArr: [],
            docUrlSuffix: props.url ? props.url : '', //doc文档url地址后缀
            docUrlHttpType: props.type ? props.type : '1',
            docUrlHttpTypeArr: [{
                flag: '1',
                val: 'http://'
            }, {
                flag: '2',
                val: 'https://'
            }]
        }
        this.onHandleChange = this.onHandleChange.bind(this)
        this.onAutoCompleteSelect = this.onAutoCompleteSelect.bind(this)
        this.onHttpTypeChange = this.onHttpTypeChange.bind(this)
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
        if (nextState.docUrlSuffix !== this.state.docUrlSuffix || nextProps.placeholder !== this.props.placeholder) {
            return true;
        } else {
            return false;
        }
    }

    onAutoCompleteSelect(value, option) {
        if (Util.strNotBlank(value)) {
            const docUrlSuffix = value.trim();
            this.props.onDocSearch(this.state.docUrlHttpType, docUrlSuffix);
            this.setState({
                docUrlSuffix
            })
        }
    }

    onHttpTypeChange(value) {
        const docUrlSuffix = this.state.docUrlSuffix;
        const docUrlHttpType = value;
        if (Util.strNotBlank(docUrlSuffix)) {
            this.props.onDocSearch(docUrlHttpType, docUrlSuffix);
        }
        this.setState({
            docUrlHttpType
        })
    }

    onHandleChange(value) {
        let realVal = value.trim().toLowerCase();

        if (realVal.startsWith("http://")) {
            realVal = realVal.replace(/http:\/\//, "")
        } else if (realVal.startsWith("https://")) {
            realVal = realVal.replace(/https:\/\//, "")
        }
        if (realVal.endsWith("/v2/api-docs")) {
            realVal = realVal.substring(0, realVal.length - "/v2/api-docs".length);
        }
        if (Util.strNotBlank(realVal)) {
            if (realVal.indexOf('loc') >= 0) {
                const tipsArr = [
                    `localhost:8099/v2/api-docs`,
                    `localhost/v2/api-docs`,
                    `localhost:8080/v2/api-docs`,
                    `localhost:8081/v2/api-docs`
                ];
                if (realVal.indexOf('/') >= 0) {
                    this.setState({
                        dataSourceArr: [realVal + '/v2/api-docs'],
                        docUrlSuffix: realVal
                    });
                } else {
                    if (!Util.arrayContainsVal(tipsArr, `${realVal}/v2/api-docs`)) {
                        tipsArr.unshift(`${realVal}/v2/api-docs`);
                        tipsArr.unshift(`${realVal}`);
                    }
                    this.setState({
                        dataSourceArr: tipsArr,
                        docUrlSuffix: realVal
                    });
                }
            } else {
                const dataSourceArr = realVal.indexOf('/') >= 0 ? [`${realVal}/v2/api-docs`] : [
                    `${realVal}`,
                    `${realVal}/v2/api-docs`,
                ];
                this.setState({
                    dataSourceArr,
                    docUrlSuffix: realVal
                });
            }
        } else {
            this.setState({
                dataSourceArr: []
            });
        }
    }

    render() {
        const {docUrlHttpType, docUrlHttpTypeArr, dataSourceArr, docUrlSuffix} = this.state;
        const {placeholder} = this.props;
        return (
            <InputGroup compact>
                <Select defaultValue={docUrlHttpType} onChange={this.onHttpTypeChange}
                        className={styles.httTypeSelect}>
                    {docUrlHttpTypeArr.map((item, index) => (
                        <Option key={index} value={item.flag}>{item.val}</Option>
                    ))}
                </Select>
                <AutoComplete
                    dataSource={dataSourceArr}
                    style={{width: "calc(100% - 180px)"}}
                    onChange={this.onHandleChange}
                    onSelect={this.onAutoCompleteSelect}
                    placeholder={placeholder}
                    defaultValue={docUrlSuffix}
                ></AutoComplete>
            </InputGroup>
        );
    }

}

DocSearchAutoCompleteUI.propTypes = {
    placeholder: PropTypes.string,
    onDocSearch: PropTypes.func,
    type: PropTypes.string,
    url: PropTypes.string
}

export default DocSearchAutoCompleteUI;
