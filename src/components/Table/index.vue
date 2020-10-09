<template>
  <div>
    <el-table :data="data.tableData" border style="width: 100%">
      <!-- 多选框 -->
      <el-table-column
        v-if="data.tableConfig.selection"
        type="selection"
        width="46"
      ></el-table-column>

      <!-- 文本数据渲染 -->
      <template v-for="item in data.tableConfig.tHead">
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
      v-if="data.tableConfig.paginationShow"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageData.currentPage"
      :page-sizes="pageData.pageSizes"
      :page-size="pageData.pageSize"
      :layout="data.tableConfig.paginationLayout"
      :total="pageData.total"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
import { onBeforeMount, reactive, watch } from "@vue/composition-api";
// 用户表格数据模块
import { loadData } from "./tableLoadData.js";
// 分页数据模块
import { paginationHook } from "./paginationHook.js";
// 翻页记录模块
// import { recordPage } from "./recordPage.js";
export default {
  name: "TableVue",
  props: {
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, context) {
    // 组件变量
    const data = reactive({
      tableConfig: {
        selection: true,
        recordCheckbox: false,
        requestData: {},
        tHead: [],
        paginationShow: true,
        paginationLayout: "total, sizes, prev, pager, next, jumper"
      },
      tableData: []
    });

    /**
     * 加载用户信息数据 模块化
     */
    const { tableData, tableLoadData } = loadData();

    /**
     * 页码
     */
    const {
      pageData,
      totalCount,
      handleSizeChange,
      handleCurrentChange
    } = paginationHook();

    /**
     * 监听 用户信息数据变化
     */
    // watch(
    //   () => tableData.item,
    //   (newValue, oldValue) => (data.tableData = newValue)
    // );
    watch([() => tableData.item, () => tableData.total], ([item, total]) => {
      data.tableData = item;
      totalCount(total);
    });
    // 监听页码
    watch(
      [() => pageData.currentPage, () => pageData.pageSize],
      ([currentPage, pageSize]) => {
        data.tableConfig.requestData.data.pageNumber = currentPage;
        data.tableConfig.requestData.data.pageSize = pageSize;
        tableLoadData(data.tableConfig.requestData);
      }
    );

    /**
     * 翻页记录 模块化
     */
    // const { a, fn } = recordPage();

    /**
     * 方法 初始化table配置项
     */
    const initTableConfig = () => {
      let configData = props.config;
      let keys = Object.keys(data.tableConfig);
      for (let key in configData) {
        if (keys.includes(key)) {
          data.tableConfig[key] = configData[key];
        }
      }
    };

    /**
     * 生命周期钩子
     */
    onBeforeMount(() => {
      initTableConfig();
      tableLoadData(data.tableConfig.requestData);
    });

    return {
      data,
      pageData,
      handleSizeChange,
      handleCurrentChange
    };
  }
};
</script>

<style scoped>
</style>