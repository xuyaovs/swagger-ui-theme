import enUS from '../i18n/en-US.json';
import zhCN from '../i18n/zh-CN.json';
import zh from 'antd/lib/locale-provider/zh_CN';
import en from 'antd/lib/locale-provider/en_US';


export default {
    namespace: 'I18nModel',
    state: {
        langMap: {
            zh: {
                txt: '中文',
                flag: 'zh',
                antd: zh,
                intl: zhCN
            },
            en: {
                txt: 'English',
                flag: 'en',
                antd: en,
                intl: enUS
            }
        },
        langArr: [
            {
                txt: '中文',
                flag: 'zh',
                antd: zh,
                intl: zhCN
            },
            {
                txt: 'English',
                flag: 'en',
                antd: en,
                intl: enUS
            }
        ],
        lang: {
            txt: '中文',
            flag: 'zh',
            antd: zh,
            intl: zhCN
        }
    },
    reducers: {
        langChange(state, action) {
            let newState = {...state, lang: state.langMap[action.payload]};
            return newState;
        }
    },
    effects: {},
    subscriptions: {},
}
