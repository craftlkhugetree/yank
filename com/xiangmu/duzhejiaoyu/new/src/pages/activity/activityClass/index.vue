<template>
  <div>
    <div class="activityclass_top">
      <h3>活动类别<el-button style="float:right;margin-top:14px;" type="primary" icon="el-icon-circle-plus-outline" @click="addActivityType">创建类别</el-button>
      </h3>
    </div>
    <div class="activityclass_text">
      <el-table :data="activityTypeLists" border class="activityclass_table">
        <el-table-column prop="typeName" label="活动类别" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <i class="activity-up actionBtn" @click="up(scope.row,scope.$index)"></i>
            <i class="activity-down actionBtn" @click="down(scope.row,scope.$index)"></i>
            <i class="activity-edit actionBtn" @click="edit(scope.row)"></i>
            <i class="activity-delete actionBtn" @click="deletetype(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="isedit?'编辑':'新增'"
      :visible.sync="editDialog"
      width="30%"
      :before-close="handleClose">
      <el-input v-model="typeName" placeholder="请输入活动类别名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="addTYPE">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "../css/activity_css.css";
import util from '../js/util' 
import code from '../js/code'
export default {
    data() {
        return {
            activityTypeLists: [],
            total:0,
            editDialog:false,
            typeName:'',
            isedit:false,
            id:''
        }
    },
    methods: {
        //活动类别
        getActivityTypeList() {
            util.postAjax({
                code: code.code,
                url: code.activityTypelist,
                data: {
                    typeName: '' //名称模糊查询
                }
            }).then(res => {
                if (res.success) {
                    this.activityTypeLists = res.items;
                    this.total = res.total;
                }
            })
        },
        up(data, index) {
            if (index == 0) {
               this.$message({
                message: '不能继续上移了',
                type: 'warning'
              });
              return
            }else{
              this.activityTypeSort(data.id,this.activityTypeLists[index-1].id)
            }
        },
        down(data, index){
          if (index == this.total-1) {
              this.$message({
              message: '不能继续下移了',
              type: 'warning'
            });
            return
          }else{
            this.activityTypeSort(data.id,this.activityTypeLists[index+1].id)
          }
        },
        activityTypeSort(id1,id2){
          util.postAjax({
              code: code.code,
              url: code.activityTypesort,
              data: {
                  id1: id1,
                  id2:id2
              }
          }).then(res => {
              if (res.success) {
                  this.getActivityTypeList();
                  this.$message({
                    message: '排序成功',
                    type: 'success'
                  });
              }
          })
        },
        addActivityType(){
          this.isedit = false;
          this.editDialog = true;
        },
        addTYPE(){
          if(!this.typeName){
            this.$message({
              message: '请输入活动类型',
              type: 'warning'
            });
            return
          }
          if(this.isedit){
            util.postAjax({
              code: code.code,
              url: code.activityTypeupdate,
              data: {
                id:this.id,
                typeName: this.typeName,
              }
            }).then(res => {
                if (res.success) {
                    this.editDialog = false;
                    this.getActivityTypeList()
                }
            })

          }else{
            util.postAjax({
              code: code.code,
              url: code.activityTypesave,
              data: {
                typeName: this.typeName,
              }
            }).then(res => {
                if (res.success) {
                    this.editDialog = false;
                    this.getActivityTypeList()
                }
            })
          }
        },
        edit(item){
          this.id = item.id;
          this.isedit = true;
          util.postAjax({
              code: code.code,
              url: code.activityTypedetail,
              data: {
                id: item.id,
              }
            }).then(res => {
                if (res.success) {
                    this.editDialog = true;
                    this.typeName = res.item.typeName;
                }
            })
        },
        handleClose(){
          this.editDialog = false;
        },
        deletetype(item){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            util.postAjax({
              code: code.code,
              url: code.activityTypedelete,
              data: {
                id: item.id,
              }
            }).then(res => {
                if (res.success) {
                  this.$message({
                    message: '删除成功',
                    type: 'success'
                  });
                  this.getActivityTypeList()
                }
            })
          })
        }
    },
    created () {
      this.getActivityTypeList();
    }

}
</script>
