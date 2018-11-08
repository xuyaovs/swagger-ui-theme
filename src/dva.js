import {message} from 'antd';

export function config() {
    return {
        onError(err) {
            // 此处用于全局捕获dva异常
            err.preventDefault();
            message.error(err.message);
            return true;
        },
        initialState: {},
    };
}

window.onerror = function (errorMsg) {
    message.destroy();
    message.error(errorMsg);
}
