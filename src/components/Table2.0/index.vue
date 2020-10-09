<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <!-- 多选框 -->
      <el-table-column
        v-if="tableConfig.selection"
        type="selection"
        width="46"
      ></el-table-column>

      <!-- 文本数据渲染 -->
      <template v-for="item in tableConfig.tHead">
        <!-- 表格插槽 -->
        <el-table-column
          v-if="item.columnType === 'slot'"
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>

        <!-- 根据表头渲染数据 -->
        <el-table-column
          v-else
          :key="item.field"
          :prop="item.field"
          :label="item.label"
          :width="item.width"
        ></el-table-column>
      </template>
    </el-table>

    <!-- 页码 -->
    <el-pagination
      v-if="tableConfig.paginationShow"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="tableConfig.paginationLayout"
      :total="total"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
import tableLoadData from "@/mixins/tableLoadData.js";
import paginationHook from "@/mixins/paginationHook.js";
export default {
  name: "TableVue",
  mixins: [tableLoadData, paginationHook],
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 组件变量
      tableConfig: {
        selection: true,
        recordCheckbox: false,
        requestData: {},
        tHead: [],
        paginationShow: true,
        paginationLayout: "total, sizes, prev, pager, next, jumper"
      },
      tableData: []
    };
  },
  methods: {
    initTableConfig() {
      let configData = this.config;
      let keys = Object.keys(this.tableConfig);
      for (let key in configData) {
        if (keys.includes(key)) {
          this.tableConfig[key] = configData[key];
        }
      }
    }
  },
  beforeMount() {
    this.initTableConfig();
  }
};
</script>

<style scoped>
</style>