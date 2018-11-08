const path = require("path")
export default {
    history: 'hash',
    alias: {
        '@support': path.resolve(__dirname, 'src/support/'),
        '@util': path.resolve(__dirname, 'src/support/util'),
        '@help': path.resolve(__dirname, 'src/support/help'),
        '@services': path.resolve(__dirname, 'src/services/'),
        '@pages': path.resolve(__dirname, 'src/pages/')
    },
    plugins: [
        ['umi-plugin-react', {
            dva: {immer: true, hmr: true},
            antd: true,
            polyfills: ['ie9'],
            library: 'react',
            hardSource: true,
            title: 'Swagger UI Theme'
        }]
    ],
    lessLoaderOptions: {
        modifyVars: {
            '@icon-url': '"/iconfont/iconfont"',
        }
    },
    routes: [
        {
            path: '/', component: 'Index',
            routes: [//示例路由配置, 实际要删除
                {path: '/', component: 'api-detail/ApiDetail'},
                {path: '/:tagKey/:apiKey', component: 'api-detail/ApiDetail'},
                {path: '/:type/:url/:tagKey/:apiKey', component: 'api-detail/ApiDetail'},
                {path: '/blank/:type/:url/:tagKey/:apiKey', component: 'BlankUI'},
                // {path: '/redirect/:type/:url/:tagKey/:apiKey', redirect: '/:type/:url/:tagKey/:apiKey'},
                // {path: '/redirect/:type/:url', redirect: '/:type/:url'}
            ]
        },
    ]
}
