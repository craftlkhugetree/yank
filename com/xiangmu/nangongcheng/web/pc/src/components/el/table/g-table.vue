<template>
  <div>
    <el-table
      ref="table"
      v-bind="$attrs"
      :data="tableData"
      stripe
      :size="size || config.renderConfig.layout.size"
      @selection-change="handleSelectionChange"
      :header-row-class-name="tableHeaderClass"
    >
      <el-table-column v-if="selection" type="selection" align="left" width="55"></el-table-column>
      <el-table-column
        v-if="index"
        type="index"
        label="序号"
        align="left"
        width="100"
      ></el-table-column>
      <slot />
    </el-table>
    <div v-if="!plain && tableData.length" class="pagination-box">
      <el-pagination
        :current-page.sync="formInfo.pageNum"
        :layout="paging ? 'sizes, prev, pager, next, jumper' : 'total'"
        :total="total"
        background
        :page-sizes="pSizes"
        :page-size="pSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import config from '@/assets/js/default_config';
export default defineComponent({
  name: 'GTable',
  props: {
    /**
     * 仅显示表格
     */
    plain: {
      type: Boolean,
      default: false,
    },
    /**
     * 数据回调钩子,回调第一个参数是返回值,返回子组件
     */
    resHook: {
      type: Function,
      default: null,
    },
    /**
     * 是否显示序号
     */
    index: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否开启多选
     */
    selection: {
      type: Boolean,
      default: false,
    },
    /**
     * 额外参数
     */
    params: {
      type: Object,
      default: () => ({}),
    },
    /**
     * 是否立即请求数据
     */
    immediate: {
      type: Boolean,
      default: true,
    },
    /**
     * 表格高度
     */
    height: {
      type: Number,
      default: 0,
    },
    /**
     * 是否展示分页
     */
    paging: {
      type: Boolean,
      default: true,
    },
    tableHeaderClass: {
      type: String,
      default: 'table-header',
    },
    headerStyle: {
      type: Object,
      default: () => ({ background: `rgba(0, 0, 0, 0.02)` }),
    },
    injFun: {
      type: Function,
      default: null,
    },
    getList: {
      type: Function,
      required: true,
      default: () => Promise.resolve(),
    },
    size: {
      type: String,
      default: '',
    },
    pageSize: {
      type: Number,
    },
  },

  data() {
    return {
      //=====================================表格参数====================================//
      formInfo: {
        pageSize: this.pageSize || 10, //----分页大小
        pageNum: 1, //-------------------------------------------------------当前页数
      },
      tableData: [], //--------------------------------------------------------表格数据
      selectData: [], //-------------------------------------------------------选中的表格数据
      total: 0, //-------------------------------------------------------------数据总数
      //=====================================其他参数====================================//
      config,
    };
  },
  computed: {
    pSizes() {
      let a = [...config.renderConfig.components.tableConfig.pageSizes];
      if (this.pageSize) {
        a.unshift(this.pageSize);
      }
      return a;
    },
    pSize() {
      return this.pageSize ? this.pageSize : config.renderConfig.components.tableConfig.pageSize;
    },
  },
  watch: {
    params: {
      handler() {
        this.getData(1);
      },
      deep: true,
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    //初始化
    init() {
      if (this.immediate) {
        this.getData();
      }
    },
    //获取数据
    getData(page) {
      const params = this.paging
        ? Object.assign(this.params, {
            page: page || this.formInfo.pageNum,
            limit: this.formInfo.pageSize,
          })
        : this.params;

      this.getList(params).then(res => {
        if (res && (res.success === true || res.code === '000000')) {
          if (this.resHook) {
            this.resHook(res, this);
          } else {
            const data = res.items || res.data;
            if (this.paging) {
              //分页
              this.total = res.total;
            } else {
              //不分页
              this.total = data.length;
            }
            this.tableData = data;
            this.injFun && this.injFun(this.tableData, this);
            // 删光了当前页
            if (!this.tableData.length && this.formInfo.pageNum > 1) {
              this.formInfo.pageNum = 1;
              this.getData();
            }
            // this.$nextTick(() => {
            //   this.$refs.table.doLayout();
            // });
          }
        }
      });
    },
    // 分页
    handleSizeChange(size) {
      this.formInfo.pageNum = 1;
      this.formInfo.pageSize = size;
      this.getData();
    },
    // 改变页码
    handleCurrentChange(page) {
      this.formInfo.pageNum = page;
      this.getData(page);
    },
    //=========================================================================//
    //选择了数据
    handleSelectionChange(val) {
      this.selectData = val;
      this.$emit('selected', val);
    },
  },
});
</script>

<style lang="scss" scoped></style>
