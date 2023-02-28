/** 
    @description  项目相关控制器
    @author       shuxiaokai
    @create        2020-10-08 22:10
*/


const Controller = require("egg").Controller;

class ProjectController extends Controller {
    /** 
        @description  获取项目列表
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}           pageNum 当前页码
        @param {Number?}           pageSize 每页大小   
        @param {number?}           startTime 创建日期     @remark 默认精确到毫秒       
        @param {number?}           endTime 结束日期       @remark 默认精确到毫秒
        @param {String?}           projectName 项目名称 
        @param {String?}           projectType<?String>   项目类型    @remark 不传获取全部类型,可以多选类型,以逗号分隔
        @return       null
    */

    async getProjectList() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                pageNum: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                pageSize: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                startTime: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                endTime: {
                    type: "number",
                    convertType: "number",
                    required: false
                },
                projectName: {
                    type: "string",
                    convertType: "string",
                    required: false
                },
                projectType: {
                    type: "string",
                    required: false
                }
            };
            console.log('getProjectList:', params, this.ctx.request.body);

            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.getProjectList(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取项目基本信息
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}           _id 项目id
        @return       null
    */

    async getProjectInfo() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                _id: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.getProjectInfo(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取项目成员信息
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}     _id 项目id
        @return       null
    */
    async getProjectMembers() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                _id: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.getProjectMembers(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
        @description  获取项目完整信息
        @author        shuxiaokai
        @create        2020-10-08 22:10
        @param {Number?}     _id 项目id
        @return       null
    */
    async getProjectFullInfo() { 
        try {
            const params = this.ctx.query;
            const reqRule = {
                _id: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.getProjectFullInfo(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  获取项目列表枚举
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @return       null
    */

    async getProjectEnum() { 
        try {
            const result = await this.ctx.service.apidoc.project.project.getProjectEnum();
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  新增项目
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String?}           projectName 项目名称
        @param {String?}           remark 备注       
        @param {Array<Object>}     members 成员       
        @return       null
    */

    async addProject() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectName: {
                    type: "string",
                    required: true
                },
                remark: {
                    type: "string",
                    required: false
                },
                members: {
                    type: "array",
                    required: false,
                    default: []
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.addProject(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
        @description  删除项目
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {Array<String>}      ids 项目id数组
        @return       null
    */

    async deleteProject() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                ids: {
                    type: "array",
                    itemType: "string"
                },
            };
            console.log('deleteProject:', params, this.ctx.request);
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.deleteProject(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  修改项目基本信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      id 项目id
        @param {String}      projectName 项目名称
        @param {String}      remark 项目备注
        @return       null
    */

    async editProject() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                _id: {
                    type: "string",
                },
                projectName: {
                    type: "string",
                    required: false
                },
                remark: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.editProject(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /** 
     * @description        获取在线链接基本信息
     * @author             shuxiaokai
     * @create             2020-11-13 09:24
     * @param  {String}    shareId 分享链接id
     * @return {String}    返回在线链接基本信息
     */
     async getOnlineProjectInfo() {
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                shareId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.getOnlineProjectInfo(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    
    /** 
        @description  检查在线项目密码是否匹配
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      shareId 随机id
        @param {String}      password 密码
        @return       null
    */
    async checkOnlineProjectPassword() { 
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                shareId: {
                    type: "string",
                },
                password: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.checkOnlineProjectPassword(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  获取分享项目banner信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      shareId 随机id
        @param {String}      password 密码
        @return       null
    */
    async getShareBanner() { 
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                shareId: {
                    type: "string",
                },
                password: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.getShareBanner(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  获取分享项目基本信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      shareId 随机id
        @param {String}      password 密码
        @return       null
    */
    async getSharedProjectInfo() { 
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                shareId: {
                    type: "string",
                },
                password: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.getSharedProjectInfo(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /** 
        @description  获取分享文档详细信息
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      _id 文档id
        @param {String}      shareId 随机id
        @param {String}      password 密码
        @return       null
    */
    async getSharedDocDetail() { 
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                _id: {
                    type: "string"
                },
                shareId: {
                    type: "string",
                },
                password: {
                    type: "string",
                    required: false
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.getSharedDocDetail(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    
    /** 
        @description  导入生成项目
        @author       shuxiaokai
        @create        2020-10-08 22:10
        @param {String}      projectName 项目名称
        @param {Object}       moyuData 文档信息
        @return       null
    */
    async importAsProject() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                projectName: {
                    type: "string",
                },
                moyuData: {
                    type: "object",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.importAsProject(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
     * @description        项目新增用户
     * @author             shuxiaokai
     * @create             2021-05-18 22:56
     * @param {String}     loginName - 登录名称
     * @param {String?}    realName - 真实名称
     * @param {Permission} permission - 权限
     * @param {String}     userId - 用户id
     * @param {String}     projectId - 项目id
     * @return {String}    返回字符串
     */
    async addUser() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                loginName: {
                    type: "string",
                },
                realName: {
                    type: "string",
                    required: false,
                },
                permission: {
                    type: "string",
                    enum: ["readOnly", "readAndWrite", "admin"],
                },
                userId: {
                    type: "string",
                },
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.addUser(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
     * @description        删除用户
     * @author             shuxiaokai
     * @create             2021-05-18 22:56
     * @param {String}     userId - 用户id
     * @param {String}     projectId - 项目id
     * @return {String}    返回字符串
     */
     async deleteUser() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                userId: {
                    type: "string",
                },
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.deleteUser(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
    /**
     * @description        更新用户权限
     * @author             shuxiaokai
     * @create             2021-05-18 22:56
     * @param {String}     projectId - 项目id
     * @param {String}     userId - 用户id
     * @param {Permission} permission - 权限
     * @return {String}    返回字符串
     */
     async changePermission() { 
        try {
            const params = this.ctx.request.body;
            const reqRule = {
                permission: {
                    type: "string",
                    enum: ["readOnly", "readAndWrite", "admin"],
                },
                userId: {
                    type: "string",
                },
                projectId: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.changePermission(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }

    /**
     * @description        根据url搜索项目
     * @author             shuxiaokai
     * @create             2021-11-25 22:56
     * @param {String}     url - 接口url
     * @return {String}    项目列表
     */
     async getProjectByUrl() { 
        try {
            const params = this.ctx.request.query;
            const reqRule = {
                url: {
                    type: "string",
                },
            };
            this.ctx.validate(reqRule, params);
            const result = await this.ctx.service.apidoc.project.project.getProjectByUrl(params);
            this.ctx.helper.successResponseData(result);
        } catch (error) {
            this.ctx.helper.throwError(error);
            return;
        }
    }
}

module.exports = ProjectController;


