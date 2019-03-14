const oauthHost='http://139.199.224.230:7001'
const syllabusHost = 'http://139.199.224.230:7002'
const api={
    verify:syllabusHost+'/user/get_oauth_data', //汕大查询认证配置
    login:oauthHost+'/oauth/login',//汕大账号密码登陆
    authorize:oauthHost+'/oauth/authorize',//获得授权码
    test:syllabusHost+'/user/info' //测试
}




export{api}