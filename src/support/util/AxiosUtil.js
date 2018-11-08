import axios from 'axios';
import qs from "qs";

const defaultTimeout = 10000;
/**
 * 设置axios的默认超时时间
 */
axios.defaults.timeout = defaultTimeout;

/**
 * 设置axios的request拦截器
 */
axios.interceptors.request.use(config => {

    return config
}, error => {
    // 当request出错时, 进行统一异常处理
    return Promise.reject(error)
});


/**
 * 设置axios的response拦截器
 */
axios.interceptors.response.use(response => {
    return response
}, error => {
    // response出错时的统一异常处理
    return Promise.resolve(error.response)
})

export default {
    /**
     * 普通的form表单提交方式
     * @param {string} url 请求url
     * @param {object} data 表单数据(对象数据类型)
     */
    formPost(url, data = {}, {timeout = defaultTimeout, headers = {}} = {}) {
        return axios({
            method: 'post', // 请求协议
            url: url, // 请求的地址
            data: qs.stringify(data, {arrayFormat: 'repeat'}), // post 请求的数据
            timeout: timeout, // 超时时间, 单位毫秒
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                ...headers
            }
        })
    },
    /**
     * 发送POST请求
     * @param {string} url 请求url
     * @param {object} params 请求参数(对象数据类型)
     */
    bodyPost(url, data = {}, {timeout = defaultTimeout, headers = {}} = {}) {
        return axios({
            method: 'post', // 请求协议
            url: url, // 请求的地址
            data: data,
            timeout: timeout, // 超时时间, 单位毫秒
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                ...headers
            }
        })
    },
    /**
     * 发送Put请求
     * @param {string} url 请求url
     * @param {object} params 请求参数(对象数据类型)
     */
    bodyPut(url, data = {}, {timeout = defaultTimeout, headers = {}} = {}) {
        return axios({
            method: 'put', // 请求协议
            url: url, // 请求的地址
            data: data,
            timeout: timeout, // 超时时间, 单位毫秒
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                ...headers
            }
        })
    },
    /**
     * 发送Put请求
     * @param {string} url 请求url
     * @param {object} params 请求参数(对象数据类型)
     */
    formPut(url, data = {}, {timeout = defaultTimeout, headers = {}} = {}) {
        return axios({
            method: 'put', // 请求协议
            url: url, // 请求的地址
            data: qs.stringify(data, {arrayFormat: 'repeat'}),
            timeout: timeout, // 超时时间, 单位毫秒
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                ...headers
            }
        })
    },
    /**
     * 发送delete请求
     * @param {string} url 请求url
     * @param {object} params 请求参数(对象数据类型)
     */
    delete(url, data = {}, {timeout = defaultTimeout, headers = {}} = {}) {
        return axios({
            method: 'delete',
            url: url,
            data: qs.stringify(data), // post 请求的数据
            timeout: timeout,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                ...headers
            }
        })
    },
    /**
     * 发送get请求
     * @param {string} url 请求url
     * @param {object} params 请求参数(对象数据类型)
     */
    get(url, data = {}, {timeout = defaultTimeout, headers = {}} = {}) {
        if (url.indexOf('?') != -1) {
            url = url + '&' + qs.stringify(data, {arrayFormat: 'repeat'})
        } else {
            url = url + '?' + qs.stringify(data, {arrayFormat: 'repeat'})
        }
        return axios({
            method: 'get',
            url: url,
            timeout: timeout,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                ...headers
            }
        })
    },
    /**
     * 文件上传
     * @param {string} url 请求url
     * @param {object} formData 发送的数据(必须是FormData类型)
     */
    upload(url, formData, {timeout = defaultTimeout, headers = {}} = {}) {
        return axios({
            method: 'get',
            url: url,
            data: formData,
            timeout: timeout,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...headers
            }
        })
    },

    // downloadByPost(url){
    //     axios({ // 用axios发送post请求
    //         method: 'post',
    //         url: 'http://localhost:5900/qihai_ots_admin/data_convert/download/template', // 请求地址
    //         responseType: 'blob' // 表明返回服务器返回的数据类型
    //     })
    //         .then((resp) => { // 处理返回的文件流
    //             if (!resp) {
    //                 return
    //             }
    //             let url = window.URL.createObjectURL(new Blob([resp.data]))
    //             let link = document.createElement('a')
    //             link.style.display = 'none'
    //             link.href = url
    //             link.setAttribute('download', 'excel.xls')
    //
    //             document.body.appendChild(link)
    //             link.click()
    //         })
    //
    // }
}
