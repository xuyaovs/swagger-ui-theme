import ApiUtil from '@util/AxiosUtil.js';


export default {

    /**
     * 从指定url获取api文档数据
     * @param {string} url
     */
    async loadApiDoc(url) {
        return await ApiUtil.get(url);
    },

    async normalGet(url, params, headerParams) {
        return await ApiUtil.get(url, params, {headers: headerParams});
    },
    async normalDelete(url, params, headerParams) {
        return await ApiUtil.delete(url, params, {headers: headerParams});
    },
    async normalBodyPost(url, params, headerParams) {
        return await ApiUtil.bodyPost(url, params, {headers: headerParams});
    },
    /**
     * post方式实现文件下载
     * @param url
     * @param params
     * @param headerParams
     * @returns {Promise<void>}
     */
    async normalBodyDownloadPost(url, params, headerParams) {
        return await ApiUtil.bodyPostDownload(url, params, {headers: headerParams});
    },
    async normalBodyPut(url, params, headerParams) {
        return await ApiUtil.bodyPut(url, params, {headers: headerParams});
    },
    async normalFormPut(url, params, headerParams) {
        return await ApiUtil.formPut(url, params, {headers: headerParams});
    },
    async normalFormPost(url, params, headerParams) {
        return await ApiUtil.formPost(url, params, {headers: headerParams});
    }
}
