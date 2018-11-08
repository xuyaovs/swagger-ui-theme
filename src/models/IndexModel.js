export default {
    namespace: 'IndexModel',
    state: {
        leftColSpan: 5,
        centerColSpan: 19,
        defaultTheme: false,
        showDrawer: false
    },
    reducers: {
        themeChange(state) {
            const newState = {...state, defaultTheme: !state.defaultTheme};
            return newState;
        },
        toggleDrawer(state) {
            if (state.showDrawer) {
                return {...state, leftColSpan: 5, centerColSpan: 19, showDrawer: false};
            } else {
                return {...state, leftColSpan: 0, centerColSpan: 16, showDrawer: true};
            }
        }
    },
    effects: {
    },
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
            });
        },
    },
}
