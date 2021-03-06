module.exports = {
    extends: [
        'eslint-config-alloy',
    ],
    globals: {
        // 这里填入你的项目需要的全局变量
        // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
        //
        wx: false,
        App: false,
        Page: false,
        getApp: false,
        Component: false,
        getCurrentPages: false
    },
    rules: {
        // 分号
        "semi": ['error', 'never'],
    }
};
