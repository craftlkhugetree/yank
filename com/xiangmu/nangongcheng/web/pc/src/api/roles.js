import service from '@/assets/js/util';
import store from '@/store';

// 角色列表
export function fetchRoleList() {
  return service.postAjax({
    code: 'auth',
    url: 'rest/Role/getRoleRes2Users',
    data: {
      appid: store.state.GROUPID,
    },
  });
}

// 保存角色
export function saveRole(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/Role/save',
    data,
  });
}

// 删除角色
export function deleteRole(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/Role/delete',
    data,
  });
}

// 用户列表
export function fetchUserList(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/User/simpleList',
    loadingText: '查询中',
    data,
  });
}

// 保存用户
export function saveUser(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/User/simpleSave',
    data,
  });
}

// 删除用户
export function delUser(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/Role/delUserAllRoles',
    data,
  });
}

// 修改用户密码
export function saveUserPwd(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/User/saveUserPwd',
    data,
  });
}

// 第三方用户列表
export function fetchThirdUserList(data) {
  return service.postAjax({
    code: 'url',
    url: 'user/thirdAuthUserInfo',
    data,
  });
}

// 获取角色权限菜单
export function fetchRoleAuth(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/Role/getRoleByMenupid',
    data,
  });
}

// 保存角色权限菜单
export function saveRoleAuth(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/Role/saveAuth',
    data,
  });
}

// 获取当前角色的用户及其用户组
export function fetchRoleUserAndGroups(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/Role/getRoleUsers2groups',
    data,
  });
}

// 保存当前角色的用户及其用户组
export function saveRoleUserAndGroups(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/Role/saveRoleUser2Group',
    data,
  });
}

// 给角色添加用户
export function addRoleUser(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/Role/addUser',
    data,
  });
}

// 给角色删除用户
export function deleteRoleUser(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/Role/delUser',
    data,
  });
}

export function getOneUserRole(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/User/getUserRoles',
    data,
  });
}

// 修改密码
export function savePwd(data) {
  return service.postAjax({
    code: 'auth',
    url: 'rest/User/modfiyPwd',
    data,
  });
}

// 获取用户信息
export function getUserInfo() {
  return service.postAjax({
    code: 'auth',
    url: 'rest/User/userDetail',
  });
}

// 获取用户菜单
export function getUserMenu() {
    return service.postAjax({
        code: "appportal",
        url: "rest/Portal/getUserMenu",
        data: {
            menupid: store.state.GROUPID
        }
    })
}

// 用户组列表
export function fetchGroupList(data) {
    return service.postAjax({
        code: "auth",
        url: "rest/UserGroup/getList",
        data
    })
}