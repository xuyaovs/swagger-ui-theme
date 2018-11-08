import apiRemoteService from '@services/ApiRemoteService'
import Util from '@support/util/Util';
import docResponseConvert from '@help/DocServerDataConvertHelp'

function CommonException(message, code = 0) {
    this.message = message;
    this.code = code;
}

export default {

    wait(time) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, time, 'over')
        });
    },

    /**
     * 当远程服务器未响应或响应状态为非200时,会抛出异常
     * @param httpTypeVal 可选值为:http://或https://
     * @param docApiURI
     * @returns {Promise<{docInfo, apiInfoMap}>}
     */
    async docSearch$(httpTypeVal, docApiURI) {
        if (Util.strIsBlank(docApiURI)) {
            return null;
        }
        const url = httpTypeVal + docApiURI;
        const result = await apiRemoteService.loadApiDoc(url);
        if ('undefined' === typeof (result)) {
            const exp = new CommonException(`api文档数据获取异常! 无法从url[ ${url} ]地址中获取任何响应数据!`);
            throw exp;
        } else {
            if (result.status === 200) {

                const apiInfoMap = docResponseConvert(result.data);

                const simpleDocInfo = {
                    title: result.data.info.title,
                    version: result.data.info.version,
                    major: result.data.info.contact.name,
                    description: result.data.info.description,
                    swaggerUrl: url,
                    basePath:result.data.basePath,
                    swaggerVersion: result.data.swagger
                }
                return {
                    simpleDocInfo, apiInfoMap
                }
            } else {
                let msg = '服务器响应状态码:' + result.status + ". ";
                if (typeof (result.data) === 'object' && null !== result.data && typeof (result.data.message) !== 'undefined') {
                    msg += result.data.message;
                }
                msg += '  请求的文档地址:' + url;
                const exp = new CommonException(msg, result.status);
                throw exp;
            }
        }
    },

    /**
     * 在apiInfoMap中查找operationId值相同的api信息, 如果未找到则返回null
     * @param operationId
     * @param apiInfoMap
     * @returns {*}
     */
    findClickApiInfo(operationId, apiInfoMap) {
        let x = 0;
        const start = new Date().getTime();
        for (let tagName in apiInfoMap) {
            for (let api of apiInfoMap[tagName].apiArr) {
                x++;
                if (api.operationId === operationId) {
                    const end = new Date().getTime();
                    return api;
                }
            }
        }
        return null;
    }
}
