import Util from '@util/Util';

class ApiDetailExtract {
    globalKey = 0;

    resetGlobalKey() {
        this.globalKey = 0;
    }

    /**
     * 抽取请求参数
     * @param {array<object>} parameters 请求参数定义
     * @param {object} definitions  具体某个自定义请求参数的数据结构
     */
    extractParam(parameters, definitions) {

        const headerParams = [];
        const bodyParams = [];
        const pathParams = [];
        const formParams = [];
        const fileParams = [];
        const result = {
            headerParams: headerParams,
            bodyParams: bodyParams,
            pathParams: pathParams,
            formParams: formParams,
            fileParams: fileParams
        }

        if (typeof(parameters) !== 'undefined') {
            for (let singleParam of parameters) {
                if ('header' === singleParam.in) {
                    headerParams.push(this.extractSingleSimpleParam(singleParam));
                } else if ('query' === singleParam.in) {
                    formParams.push(this.extractSingleSimpleParam(singleParam));
                } else if ('path' === singleParam.in) {
                    pathParams.push(this.extractSingleSimpleParam(singleParam));
                }
                if ('body' === singleParam.in) {

                    if (typeof(singleParam['schema']['$ref']) !== 'undefined') {
                        const realParamTypeName = this.extractRealParamTypeName(singleParam['schema']['$ref']);
                        const realRaramTypeDefine = definitions[realParamTypeName];
                        if (typeof(realRaramTypeDefine) !== 'undefined') {
                            const paramArr = this.extractSingleComplexParam(realRaramTypeDefine, definitions, 0);
                            for (const p of paramArr) {
                                bodyParams.push(p);
                            }
                        }
                    }
                } else if ('formData' === singleParam.in && 'file' === singleParam.type) {
                    fileParams.push(this.extractSingleSimpleParam(singleParam));
                }
            }
        }


        return result;
    }

    extractRealParamTypeName(originalTypeName) {
        return originalTypeName.substring(originalTypeName.lastIndexOf('/') + 1);
    }

    /**
     * 抽取简单的请求参数
     * @param {string} key
     * @param {object} singleParamDefine
     */
    extractSingleSimpleParam(singleParamDefine) {
        let paramDefine;
        let defaultVal = '';
        if (typeof (singleParamDefine.default) !== 'undefined') {
            defaultVal = singleParamDefine.default;
        }
        let exampleVal = '';
        if (typeof (singleParamDefine.example) !== 'undefined') {
            exampleVal = singleParamDefine.example;
        }
        let required = false;
        if (typeof (singleParamDefine.required) !== 'undefined') {
            required = singleParamDefine.required;
        } else if (typeof (singleParamDefine.allowEmptyValue) !== 'undefined') {
            required = singleParamDefine.allowEmptyValue;
        }
        if (typeof (singleParamDefine.format) === 'undefined' || null === singleParamDefine.format) {
            paramDefine = {
                key: ++this.globalKey,
                default: defaultVal,
                example: exampleVal,
                required: required,
                description: singleParamDefine.description,
                summary: singleParamDefine.summary,
                name: singleParamDefine.name,
                type: singleParamDefine.type
            }
        } else {
            paramDefine = {
                key: ++this.globalKey,
                default: defaultVal,
                example: exampleVal,
                description: singleParamDefine.description,
                summary: singleParamDefine.summary,
                required: required,
                name: singleParamDefine.name,
                type: singleParamDefine.type + '(' + singleParamDefine.format + ')'
            }
        }
        return paramDefine;
    }

    /**
     * 抽取复杂的请求参数
     * @param complexTypeDefine
     * @param definitions
     * @param callSize
     * @returns {Array}
     */
    extractSingleComplexParam(complexTypeDefine, definitions, callSize) {
        const resultArr = [];
        if (callSize > 6) {//避免陷入无限递归(设置最大递归层数)
            return resultArr;
        }
        if (typeof (complexTypeDefine.properties) !== 'undefined' && null !== complexTypeDefine.properties) {
            for (const paramName in complexTypeDefine.properties) {
                if (typeof (complexTypeDefine.properties[paramName].type) === 'undefined' && typeof (complexTypeDefine.properties[paramName]['$ref']) !== 'undefined') {
                    const required = complexTypeDefine.properties[paramName].allowEmptyValue;
                    const realTypeName = this.extractRealParamTypeName(complexTypeDefine.properties[paramName]['$ref']);
                    if (typeof (definitions[realTypeName]) !== 'undefined') {
                        const treeNode = {
                            key: ++this.globalKey,
                            name: paramName,
                            type: 'object',
                            description: complexTypeDefine.properties[paramName].description,
                            required: required,
                            children: this.extractSingleComplexParam(definitions[realTypeName], definitions, ++callSize)
                        }
                        resultArr.push(treeNode);
                    } else {
                        const description = complexTypeDefine.properties[paramName].description;
                        const type = complexTypeDefine.properties[paramName].type;
                        const treeNode = this.buildLeafTreeNode(paramName, description, type, required);
                        resultArr.push(treeNode);
                    }
                } else if (complexTypeDefine.properties[paramName].type === 'object') {
                    const required = Util.arrayContainsVal(complexTypeDefine.required, paramName);
                    let realTypeName = this.extractRealParamTypeName(paramName);
                    console.log(paramName, definitions[realTypeName], complexTypeDefine.properties[paramName])
                    if (typeof (definitions[realTypeName]) !== 'undefined') {
                        const treeNode = {
                            key: ++this.globalKey,
                            name: paramName,
                            type: 'object',
                            description: complexTypeDefine.properties[paramName].description,
                            required: required,
                            children: this.extractSingleComplexParam(definitions[realTypeName], definitions, ++callSize)
                        }
                        resultArr.push(treeNode);
                    } else if (typeof(complexTypeDefine.properties[paramName].additionalProperties) !== 'undefined' && typeof(complexTypeDefine.properties[paramName].additionalProperties['$ref'])!=='undefined') {
                        let additionalProperties = complexTypeDefine.properties[paramName].additionalProperties;
                        realTypeName = this.extractRealParamTypeName(additionalProperties['$ref']);
                        const treeNode = {
                            key: ++this.globalKey,
                            name: paramName,
                            type: 'object<*,Object>',
                            description: complexTypeDefine.properties[paramName].description,
                            required: required,
                            children: this.extractSingleComplexParam(definitions[realTypeName], definitions, ++callSize)
                        }
                        resultArr.push(treeNode);
                    } else {
                        const description = complexTypeDefine.properties[paramName].description;
                        const type = complexTypeDefine.properties[paramName].type;
                        const treeNode = this.buildLeafTreeNode(paramName, description, type, required);
                        resultArr.push(treeNode);
                    }
                } else if (complexTypeDefine.properties[paramName].type === 'array' && typeof (complexTypeDefine.properties[paramName].items) !== 'undefined' && typeof (complexTypeDefine.properties[paramName].items['$ref']) !== 'undefined') {
                    const required = complexTypeDefine.properties[paramName].allowEmptyValue;
                    const realTypeName = this.extractRealParamTypeName(complexTypeDefine.properties[paramName].items['$ref']);
                    if (typeof (definitions[realTypeName]) !== 'undefined') {
                        const treeNode = {
                            key: ++this.globalKey,
                            name: paramName,
                            type: 'array<object>',
                            description: complexTypeDefine.properties[paramName].description,
                            required: required,
                            children: this.extractSingleComplexParam(definitions[realTypeName], definitions, ++callSize)
                        }
                        resultArr.push(treeNode);
                    } else {
                        const description = complexTypeDefine.properties[paramName].description;
                        const type = 'array<object>';
                        // 构建叶子节点
                        const treeNode = this.buildLeafTreeNode(paramName, description, type, required);
                        resultArr.push(treeNode);
                    }
                } else {
                    const originalDataTypeDefine = complexTypeDefine.properties[paramName];
                    let dataTypeDefine = {...originalDataTypeDefine};
                    dataTypeDefine['name'] = paramName;
                    const required = Util.arrayContainsVal(complexTypeDefine.required, paramName);
                    dataTypeDefine['required'] = required;
                    resultArr.push(this.extractSingleSimpleParam(dataTypeDefine));
                }
            }
        }
        return resultArr;
    }

    /**
     * 构建叶子节点
     * @param {string} paramName 参数名
     * @param {string} description 描述
     * @param {string} type 参数类型
     * @param {boolean} required 是否必填
     */
    buildLeafTreeNode(paramName, description, type, required) {
        return {
            key: ++this.globalKey,
            name: paramName,
            description: description,
            type: type,
            required: required
        }
    }

    extractReponse(responses, definitions) {
        const responseArr = [];

        for (const respCode in responses) {
            if ('undefined' !== typeof (responses[respCode].schema)) {
                console.log(responses[respCode].schema);
                let realTypeName = null;
                if (typeof(responses[respCode].schema.$ref) === 'undefined') {
                    realTypeName = responses[respCode].schema.type;
                    responseArr.push({
                        key: ++this.globalKey,
                        code: respCode,
                        description: responses[respCode].description,
                        responseStructArr: []
                    })
                } else {
                    realTypeName = this.extractRealParamTypeName(responses[respCode].schema.$ref);
                    responseArr.push({
                        key: ++this.globalKey,
                        code: respCode,
                        description: responses[respCode].description,
                        responseStructArr: this.extractSingleComplexParam(definitions[realTypeName], definitions, 0)
                    })
                }


            } else {

                responseArr.push({
                    key: ++this.globalKey,
                    code: respCode,
                    description: responses[respCode].description
                })
            }
        }

        return responseArr;
    }
}

export default (docRespData) => {
    const {paths, tags, definitions} = docRespData;

    /**
     * 数据结构
     * {
     *  "tagName":{description,apiArr}
     * }
     */
        // const start = new Date();
        // let x = 0;
    const apiInfoMap = {};
    if (tags) {
        let key = 0;
        for (const tagInfo of tags) {
            let singleTag = apiInfoMap[tagInfo.name];
            if ('undefined' === typeof (singleTag) || null === singleTag) {
                singleTag = {
                    key: (++key) + "",
                    description: tagInfo.description,
                    apiArr: []
                };
                apiInfoMap[tagInfo.name] = singleTag;
            }
        }

        if (paths) {
            const extract = new ApiDetailExtract();
            for (const path in paths) {
                extract.resetGlobalKey();//每次都重置这个key为0,让key值不至于过大
                for (const method in paths[path]) {

                    const reqParams = extract.extractParam(paths[path][method].parameters, definitions);

                    const responseArr = extract.extractReponse(paths[path][method].responses, definitions);

                    const treeNode = {
                        operationId: paths[path][method].operationId,
                        key: paths[path][method].operationId,
                        name: paths[path][method].summary,
                        path: path,
                        produces: paths[path][method].produces,
                        consumes: paths[path][method].consumes,
                        description: paths[path][method].description,
                        method: method,
                        headerParams: reqParams.headerParams,
                        pathParams: reqParams.pathParams,
                        formParams: reqParams.formParams,
                        bodyParams: reqParams.bodyParams,
                        fileParams: reqParams.fileParams,
                        responseArr: responseArr
                    }

                    if (typeof(paths[path][method].tags) !== 'undefined' && null !== paths[path][method].tags && paths[path][method].tags.length > 0) {
                        for (let tagName of paths[path][method].tags) {
                            // ++x;
                            const singleTag = apiInfoMap[tagName];
                            if (typeof(singleTag) !== 'undefined' && null !== singleTag) {
                                singleTag.apiArr.push({...treeNode, tagDesc: singleTag.description});
                            }
                        }
                    }
                }

            }
        }

        // const end = new Date();
        // console.log('循环次数:',x,'循环用时:',(end-start));

        return apiInfoMap;
    }
}
