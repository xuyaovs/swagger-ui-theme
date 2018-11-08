import React, {Component} from 'react';
import {connect} from 'dva';
import {Button, Input, Form, Upload, Icon} from 'antd';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import {FormattedMessage} from 'react-intl';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import PropTypes from 'prop-types'

import apiRemoteService from '@services/ApiRemoteService';

import Util from '@support/util/Util'

const FormItem = Form.Item;

class TestForm extends Component {

    constructor(props) {
        super(props);
        this.createHeaderParamFormItems = this.createHeaderParamFormItems.bind(this);
        this.createPathParamFormItems = this.createPathParamFormItems.bind(this);
        this.createFormParamFormItems = this.createFormParamFormItems.bind(this);
        this.createBodyParamFormItems = this.createBodyParamFormItems.bind(this);
        this.createFileUploadFormItem = this.createFileUploadFormItem.bind(this);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        const {clickedApi} = props;
        if (clickedApi.bodyParams.length > 0) {
            let reqData = {};
            for (const singleParam of clickedApi.bodyParams) {
                const paramName = singleParam.name;
                let initialValue = singleParam.default === '' ? singleParam.example : singleParam.default;
                if (initialValue === "" && 'undefined' !== typeof(singleParam.type) && null !== singleParam.type && singleParam.type.startsWith("array")) {
                    initialValue=[];
                }
                reqData[paramName] = initialValue;
            }
            this.state = {
                fileList: [],
                uploading: false,
                apiExecute: false,
                serverResp: '',
                '__bodyForm': JSON.stringify(reqData)
            };
        } else {
            this.state = {
                fileList: [],
                uploading: false,
                apiExecute: false,
                serverResp: ''
            }
        }
    }

    /**
     * 创建请求头表单项
     */
    createHeaderParamFormItems() {
        const {getFieldDecorator} = this.props.form;
        const {clickedApi} = this.props;
        if (clickedApi.headerParams && clickedApi.headerParams.length > 0) {
            const formItemArr = [];
            let key = 0;
            for (const singleParam of clickedApi.headerParams) {
                const paramName = singleParam.name;
                const required = singleParam.required;
                const message = required ? paramName + '是必须的!' : paramName;
                const initialValue = singleParam.default === '' ? singleParam.example : singleParam.default;
                formItemArr.push(
                    <FormItem style={{marginBottom: 0}} key={'h-' + (++key)}>
                        {getFieldDecorator('__header.' + paramName, {
                            initialValue: initialValue,
                            rules: [{required: false, message: message}],
                        })(
                            <Input addonBefore={paramName}/>
                        )}
                    </FormItem>
                );
            }
            return (
                <div>
                    <h3 className='header'>
                        <FormattedMessage id="req_header"/>
                    </h3>
                    {formItemArr}
                </div>
            );
        } else {
            return '';
        }

    }


    /**
     * 创建路径参数表单项
     */
    createPathParamFormItems() {
        const {getFieldDecorator} = this.props.form;
        const {clickedApi} = this.props;
        if (clickedApi.pathParams && clickedApi.pathParams.length > 0) {
            const formItemArr = [];
            let key = 0;
            for (const singleParam of clickedApi.pathParams) {
                const paramName = singleParam.name + '*';
                const required = singleParam.required;
                const message = required ? paramName + '是必须的!' : paramName;
                const initialValue = singleParam.default === '' ? singleParam.example : singleParam.default;
                formItemArr.push(
                    <FormItem style={{marginBottom: 0}} key={'p-' + (++key)}>
                        {getFieldDecorator("__path." + paramName, {
                            initialValue: initialValue,
                            rules: [{required: false, message: message}],
                        })(
                            <Input addonBefore={paramName}/>
                        )}
                    </FormItem>
                );
            }
            return (
                <div>
                    <h3 className='header'>
                        <FormattedMessage id="req_path"/>
                    </h3>
                    {formItemArr}
                </div>
            );
        } else {
            return '';
        }
    }


    /**
     * 创建表单参数表单项
     * @param {function} getFieldDecorator
     */
    createFormParamFormItems() {
        const {getFieldDecorator} = this.props.form;
        const {clickedApi} = this.props;
        if (clickedApi.formParams && clickedApi.formParams.length > 0) {
            const formItemArr = [];
            let key = 0;
            for (const singleParam of clickedApi.formParams) {
                const paramName = singleParam.name;
                const required = singleParam.required;
                let addonBefore = null;
                if (required) {
                    addonBefore = <span className="myLabel">{singleParam.name}<i>*</i></span>
                } else {
                    addonBefore = <span>{singleParam.name}</span>
                }
                const message = required ? paramName + '是必须的!' : paramName;
                const initialValue = singleParam.default === '' ? singleParam.example : singleParam.default;
                const isArray = singleParam.type === 'array';
                const placeholder = singleParam.description;
                if (!isArray) {
                    formItemArr.push(
                        <FormItem style={{marginBottom: 0}} key={'f-' + (++key)}>
                            {getFieldDecorator('__form.' + paramName, {
                                initialValue: initialValue,
                                rules: [{required: false, message: message}],
                            })(
                                <Input addonBefore={addonBefore} placeholder={placeholder}/>
                            )}
                        </FormItem>
                    );
                } else {
                    for (let index = 0; index < 2; index++) {
                        formItemArr.push(
                            <FormItem style={{marginBottom: 0}} key={'f-' + (++key)}>
                                {getFieldDecorator('__form.' + paramName + '[' + index + ']', {
                                    initialValue: '',
                                    rules: [{required: false, message: message}],
                                })(
                                    <Input addonBefore={paramName} placeholder={placeholder}/>
                                )}
                            </FormItem>
                        );
                    }
                }
            }
            return (
                <div>
                    <h3 className='header'>
                        <FormattedMessage id="req_form"/>
                    </h3>
                    {formItemArr}
                </div>
            );
        } else {
            return '';
        }
    }


    /**
     * 创建请求体参数表单项
     */
    createBodyParamFormItems() {
        const {clickedApi} = this.props;
        if (clickedApi.bodyParams && clickedApi.bodyParams.length > 0) {
            let reqData = {};
            for (const singleParam of clickedApi.bodyParams) {
                const paramName = singleParam.name;
                let initialValue = singleParam.default === '' ? singleParam.example : singleParam.default;
                if (initialValue === "" && 'undefined' !== typeof(singleParam.type) && null !== singleParam.type && singleParam.type.startsWith("array")) {
                    initialValue=[];
                }
                reqData[paramName] = initialValue;
            }
            const that = this;
            return (
                <div>
                    <h3 className='header'>
                        <FormattedMessage id="req_body"/>
                    </h3>
                    <div>
                        <CodeMirror
                            value={JSON.stringify(reqData, null, 3)}
                            options={{
                                mode: 'javascript',
                                theme: 'material',
                                lineNumbers: true
                            }}
                            onChange={(editor, data, value) => {
                                that.setState({
                                    '__bodyForm': value
                                })
                            }}
                        />
                    </div>
                </div>
            );
        } else {
            return '';
        }
    }

    createFileUploadFormItem() {
        const {getFieldDecorator} = this.props.form;
        const formItemArr = [];
        const {clickedApi} = this.props;
        if (clickedApi.fileParams.length > 0) {

            const fileUploadProps = {
                action: 'http://localhost:8099' + clickedApi.path,
                onRemove: (file) => {
                    this.setState(({fileList}) => {
                        const index = fileList.indexOf(file);
                        const newFileList = fileList.slice();
                        newFileList.splice(index, 1);
                        return {
                            fileList: newFileList,
                        };
                    });
                },
                beforeUpload: (file) => {
                    this.setState(({fileList}) => ({
                        fileList: [...fileList, file],
                    }));
                    return false;
                },
                fileList: this.state.fileList
            };
            formItemArr.push(
                <Upload {...fileUploadProps} key={1}>
                    <Button>
                        <Icon type="upload"/> <FormattedMessage id="select_file"/>
                    </Button>
                </Upload>
            );
            return (
                <div>
                    <h3 className='header'>
                        <FormattedMessage id="file_upload"/>
                    </h3>
                    {formItemArr}
                </div>
            )
        } else {
            return '';
        }
    }

    onSubmitForm(e) {
        e.preventDefault();
        const that = this;
        that.setState({
            apiExecute: true
        })
        const clickedApi = this.props.clickedApi;
        const httpType = this.props.httpType;
        const apiUrlPrefix = this.props.apiUrlPrefix;
        const basePath = clickedApi.basePath;
        this.props.form.validateFields((err, values) => {
            const testApiUrl = httpType + apiUrlPrefix +basePath+ Util.formReplacePathVar(clickedApi.path, values['__path']);
            if ('undefined' !== typeof (this.state['__bodyForm'])) {
                values['__bodyForm'] = this.state['__bodyForm'];
            }
            console.log(values);//__path, __header, __form, __bodyForm
            const printResponse = (result) => {
                if (typeof(result) === 'undefined') {
                    that.setState({
                        apiExecute: false,
                        serverResp: '服务器未给出任何响应. \r\n可能的原因: \r\n1.网络异常. \r\n2.服务器响应超时 \r\n3.客户端的超时时间设置过短 \r\n4.测试地址错误'
                    })
                } else {
                    that.setState({
                        apiExecute: false,
                        serverResp: JSON.stringify(result, null, 3)
                    })
                }
            }
            if (clickedApi.method.toUpperCase() === 'POST') {
                if (Util.strNotBlank(values['__bodyForm'])) {
                    apiRemoteService.normalBodyPost(testApiUrl, values['__bodyForm'], values['__header']).then(function (result) {
                        printResponse(result)
                    });
                } else {
                    apiRemoteService.normalFormPost(testApiUrl, values['__form'], values['__header']).then(function (result) {
                        printResponse(result)
                    });
                }
            } else if (clickedApi.method.toUpperCase() === 'GET') {
                apiRemoteService.normalGet(testApiUrl, values['__form'], values['__header']).then(function (result) {
                    printResponse(result)
                });
            } else if (clickedApi.method.toUpperCase() === 'PUT') {
                if (Util.strNotBlank(values['__bodyForm'])) {
                    apiRemoteService.normalBodyPut(testApiUrl, values['__bodyForm'], values['__header']).then(function (result) {
                        printResponse(result)
                    })
                } else {
                    apiRemoteService.normalFormPut(testApiUrl, values['__form'], values['__header']).then(function (result) {
                        printResponse(result)
                    })
                }
            } else if (clickedApi.method.toUpperCase() === 'DELETE') {
                apiRemoteService.normalDelete(testApiUrl, values['__form'], values['__header']).then(function (result) {
                    printResponse(result)
                })
            }
        });
    }

    codeMirrorRef(ref) {
        if (ref && ref.editor) {
            ref.editor.setSize('auto', '400px')
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {httpType, apiUrlPrefix, clickedApi} = this.props;

        return (
            <div>
                <Form onSubmit={this.onSubmitForm}>

                    {this.createHeaderParamFormItems()}

                    {this.createPathParamFormItems()}

                    {this.createFormParamFormItems()}

                    {this.createFileUploadFormItem()}

                    {this.createBodyParamFormItems()}

                    <Button type="primary" htmlType="submit" block style={{marginTop: 10}}
                            loading={this.state.apiExecute}>
                        <FormattedMessage id="execute"/>
                    </Button>
                </Form>
                <h3 className='header'>
                    <FormattedMessage id="server_response"/>
                </h3>
                <div style={{height: 435, marginBottom: 20}}>
                    <CodeMirror ref={this.codeMirrorRef}
                                value={this.state.serverResp}
                                options={{
                                    mode: 'javascript',
                                    theme: 'material',
                                    readOnly: true,
                                    lineNumbers: true
                                }}
                    />
                </div>
            </div>
        );
    }
}

TestForm.propTypes = {
    httpType: PropTypes.string,
    apiUrlPrefix: PropTypes.string,
    clickedApi: PropTypes.object
}

export default Form.create()(TestForm);