import apiService from '@services/ApiService';
import Util from '@util/Util';
import {notification} from 'antd';
import apiRemoteService from '@services/ApiRemoteService'
import docResponseConvert from '@help/DocServerDataConvertHelp'
import ApiUtil from '@util/AxiosUtil.js';

export default {
    namespace: 'DocInfoModel',
    state: {
        docUrlSuffix: '',
        docUrlHttpType: '',//1.表示'http://' ,2.表示'https://'
        clickedApi: null,
        simpleDocInfo: null,
        apiInfoMap: null,
    },
    reducers: {
        fitDocInfo(state, action) {
            const {payload: {docInfo: {simpleDocInfo, apiInfoMap, clickedApi}}} = action;
            const {payload: {searchInfo: {docUrlHttpType, docUrlSuffix}}} = action;
            return {
                ...state,
                simpleDocInfo,
                apiInfoMap,
                docUrlHttpType,
                docUrlSuffix,
                clickedApi
            };
        },
        clearDocInfo(state) {
            const simpleDocInfo = null;
            const apiInfoMap = null;
            const clickedApi = null;
            return {
                ...state, clickedApi, simpleDocInfo, apiInfoMap
            };
        },
        fitClickedApi(state, action) {
            const clickedApi = action.payload;
            return {
                ...state, clickedApi
            }
        }
    },
    effects: {

        * findClickedApi(action, {put, select}) {
            const apiKey = action.payload;
            let apiInfoMap = yield select(state => state['DocInfoModel']['apiInfoMap'])
            let simpleDocInfo = yield select(state => state['DocInfoModel']['simpleDocInfo'])

            const clickedApi = yield apiService.findClickApiInfo(apiKey, apiInfoMap);
            console.log('findClickedApi Before',clickedApi);
            let newClickedApi = Object.assign({}, clickedApi, {basePath:simpleDocInfo.basePath});
            console.log('findClickedApi After',newClickedApi);
            yield put({type: 'fitClickedApi', payload: newClickedApi})
        },
        // select可以用于访问全局的state
        // put用于访问reducers方法
        // let clickedApi = yield select(state => state['namespace名称']['state属性名'])
        // yield put({ type: 'fitServerResponse', payload: result['data'] })
        * loadDocData(action, {put, select, call}) {
            const {payload: {docUrlHttpType, docUrlSuffix, apiKey}} = action;

            try {
                const httpType = docUrlHttpType === '1' ? 'http://' : 'https://';

                const docInfo = yield apiService.docSearch$(httpType, docUrlSuffix);

                let clickedApi = null;
                if (Util.strNotBlank(apiKey)) {
                    clickedApi = yield apiService.findClickApiInfo(apiKey, docInfo.apiInfoMap)
                    clickedApi.basePath = docInfo.simpleDocInfo.basePath;
                }
                docInfo['clickedApi'] = clickedApi;
                const searchInfo = {
                    docUrlHttpType, docUrlSuffix
                }
                const payload = {
                    docInfo, searchInfo
                }
                yield put({type: 'fitDocInfo', payload: payload});
            } catch (e) {
                yield put({type: 'clearDocInfo'})
                notification['error']({
                    message: '接口文档获取异常',
                    description: e.message,
                });
                console.log(e);
            }
        },

    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                // if (pathname === '/download') {
                //   dispatch({ type: 'downloadFile' });
                // }
            });
        },
    },
}
