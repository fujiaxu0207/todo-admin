/**
 * Created by hao.cheng on 2017/4/16.
 */
import axios from 'axios';
import { get, post } from './tools';
import * as config from './config';

export const getBbcNews = () => get({ url: config.NEWS_BBC });

export const npmDependencies = () =>
    axios
        .get('./npm.json')
        .then((res) => res.data)
        .catch((err) => console.log(err));

export const weibo = () =>
    axios
        .get('./weibo.json')
        .then((res) => res.data)
        .catch((err) => console.log(err));

export const gitOauthLogin = () =>
    get({
        url: `${config.GIT_OAUTH}/authorize?client_id=792cdcd244e98dcd2dee&redirect_uri=http://localhost:3006/&scope=user&state=reactAdmin`,
    });
export const gitOauthToken = (code: string) =>
    post({
        url: `https://cors-anywhere.herokuapp.com/${config.GIT_OAUTH}/access_token`,
        data: {
            client_id: '792cdcd244e98dcd2dee',
            client_secret: '81c4ff9df390d482b7c8b214a55cf24bf1f53059',
            redirect_uri: 'http://localhost:3006/',
            state: 'reactAdmin',
            code,
        },
    });
// {headers: {Accept: 'application/json'}}
export const gitOauthInfo = (access_token: string) =>
    get({ url: `${config.GIT_USER}access_token=${access_token}` });

// easy-mock数据交互
// 管理员权限获取
export const admin = () => get({ url: config.MOCK_AUTH_ADMIN });
// 访问权限获取
export const guest = () => get({ url: config.MOCK_AUTH_VISITOR });
/** 获取服务端菜单 */
export const fetchMenu = () => get({ url: config.MOCK_MENU });

export const getUsers = () =>
    axios
        .get('https://www.marsyr.top/user/info'+"?t="+new Date())
        .then((res) => res.data)
        .catch((err) => console.log(err));
export const userRegister = (userInfo:{username:string,password:string}) => {

    return axios
        .post('https://www.marsyr.top/register',{
            username:userInfo.username,
            password:userInfo.password,
           
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
}

export const deletUser = (id:number) => {
    return axios
        .delete(`https://www.marsyr.top/user/`+id)
        .then((res) => res.data)
        .catch((err) => console.log(err));
}
export const updateUser = (userInfo:{id:number,username:string,password:string}) => {
    return axios
        .post(`https://www.marsyr.top/user/info`,{
            id:userInfo.id,
            username:userInfo.username,
            password: userInfo.password
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
}

export const getAllTodo = () => {
    return axios
        .get(`https://www.marsyr.top/item/info`+"?t="+new Date())
        .then((res) => res.data)
        .catch((err) => console.log(err));
}
export const deleteTodo = (uid:number) => {
    return axios
        .delete(`https://www.marsyr.top/item/`+uid)
        .then((res) => res.data)
        .catch((err) => console.log(err));
}
export const deleteBatchTodo = (idList:string[]) => {
    let query:string[] = [];
    for(let i = 0; i < idList.length; i++) {
        query.push("idList[]="+idList[i]);
    }
    // console.log(query.join("&"));
    
    return axios
        .delete(`https://www.marsyr.top/item1`,{
            data:idList
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
}

export const updateTodo = (userInfo) => {
    return axios
        .post(`https://www.marsyr.top/item/info`,{
            ...userInfo
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
}

export const addTodo = (userInfo) => {
    return axios
        .post(`https://www.marsyr.top/item`,{
            ...userInfo
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
}