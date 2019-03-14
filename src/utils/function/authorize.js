import regeneratorRuntime from '../third-party/runtime' // eslint-disable-line
import { wxRequest} from '../lib/wxApi'
import { api } from '../../config/api2'
const app=getApp()
    const login=async function(account,password){
            let parmas = {
                account,
                password
            }
            let res = await wxRequest({
                url: api.login,
                method: 'post',
                needLogin: false,
                data: parmas
            })
            console.log(res);
            if (res.data['code'] == 0) {
                console.log('success');
      //          console.log(res);
                let cookieBkey
                let cookieBvalue
                [cookieBkey, cookieBvalue] = res.header['set-cookie'].split(';')[0].split('=');
                //   console.log([cookieAKey,cookieAValue]);
                //存储cookieB
                app.globalData.cookieB = {cookieBkey, cookieBvalue}
                console.log('存储cookieB成功')
            } else {
                console.log('404');
            }
}



/**
 * 授权
 */
const authorize=async function () {
    try{
        /**
         * 查询认证配置
         */
        const getOAuthorizeData=async function(){
                let json;
                let parmas={
                    method:'post',
                    from:'mini'
                }
                let res=await wxRequest({
                    url:api.verify,
                    data:parmas
                })
                if (res.statusCode == 200) {
                   // console.log(res);
                    let cookieAKey;
                    let cookieAValue;
                    [cookieAKey, cookieAValue] = res.header['set-cookie'].split(';')[0].split('=');
                    app.globalData.cookieA = {cookieAKey, cookieAValue}
                    json={
                        client_id:res.data.client_id,
                        redirect_uri:res.data.redirect_uri,
                        scope:res.data.scope,
                        state:res.data.state

                    }
                    return json;
                }
            }


        let json=await getOAuthorizeData();
     //   console.log(json);
        /**
         * 获取授权码
         */

        const getAuthorizeCode=async function(client_id,state,scope){
            let { cookieBkey, cookieBvalue } = app.globalData.cookieB
            let parmas={
                response_type:'code',
                from:'mini',
                client_id:client_id,
                state:state,
                scope:scope
            }
            let res=await wxRequest({
                url:api.authorize,
                data:parmas,
                header: { cookie: `${cookieBkey}=${cookieBvalue}` },
                needLogin:false
            })
            if(res.statusCode==200){

              //  console.log(res);
                //  return res;
                return res.data.authorization_code;
            }

        }
        let code=await getAuthorizeCode(json.client_id,json.state,json.scope);
      //  console.log(code);

        const getSkey=async function(url,code,state){
                let{cookieAKey,cookieAValue}=app.globalData.cookieA
              //  console.log(cookieAKey,cookieAValue)
                /*  let parmas={
                      code:code,
                      state:state
                  }*/
                let res=await wxRequest({
                    url:url,
                    data:{code,state,from:'mini'},
                    method:'GET',
                    header: { cookie: `${cookieAKey}=${cookieAValue}` },
                    needLogin:false
                })
              //  console.log(res)
                return res.data.skey;
            }
        let skey=await getSkey(json.redirect_uri,code,json.state);
        const test=async function(skey){
            let res =await wxRequest({
                url:api.test,
                method:'POST',
                header:{skey:skey}
            })
            console.log(res.data.user_info);
        }
        test(skey);
    }

            catch(e){
                console.log(e);
            }
        }

export{login,authorize}