<template>
  <div>
    <!-- 选项/操作 -->
    <el-row :gutter="6">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for>分类：</label>
          <div class="content-wrap">
            <el-select
              v-model="category_value"
              clearable
              placeholder="请选择"
              style="width: 100%;"
            >
              <el-option
                v-for="item in options.category"
                :key="item.id"
                :label="item.category_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="label-wrap date">
          <label for>日期：</label>
          <div class="content-wrap">
            <el-date-picker
              v-model="date_value"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['12:00:00', '08:00:00']"
              style="width: 100%;"
            ></el-date-picker>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="label-wrap key-word">
          <label for>关键字：</label>
          <div class="content-wrap">
            <!-- <select-vue :config="data.configOption" /> -->
            <el-select v-model="search_key" style="width: 100%;">
              <el-option
                v-for="item in search_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-col>
      <el-col :span="3">
        <el-input
          v-model="search_keyWord"
          clearable
          placeholder="请输入内容"
          style="width: 100%;"
        ></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" style="width: 100%;" @click="getList"
          >搜索</el-button
        >
      </el-col>
      <el-col :span="2">
        <el-button
          type="danger"
          class="pull-right"
          style="width: 100%;"
          @click="dialog_info = true"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <div class="block-space-30"></div>

    <!-- 表格 -->
    <el-table
      :data="table_data.item"
      v-loading="loadingData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="title" label="标题" width="524"></el-table-column>
      <el-table-column
        prop="categoryId"
        label="类型"
        width="90"
        :formatter="toCategory"
      ></el-table-column>
      <el-table-column
        prop="createDate"
        label="日期"
        width="160"
        :formatter="toDate"
      ></el-table-column>
      <el-table-column prop="user" label="管理人" width="100"></el-table-column>
      <el-table-column label="操作" width="252">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deleteItem(scope.row.id)"
            >删除</el-button
          >
          <el-button size="mini" type="success" @click="editInfo(scope.row.id)"
            >编辑</el-button
          >
          <el-button size="mini" type="success" @click="infoDetailed(scope.row)"
            >编辑详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="block-space-30"></div>

    <!-- 底部分页 -->
    <el-row>
      <el-col :span="8">
        <el-button size="small" @click="deleteAll">批量删除</el-button>
      </el-col>
      <el-col :span="16">
        <el-pagination
          class="pull-right"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[7, 20, 30, 50, 100]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>

    <!-- 新增弹窗 -->
    <dialog-info
      :flag.sync="dialog_info"
      :category="options.category"
      @get-list="getList"
    ></dialog-info>
    <!-- 编辑弹窗 -->
    <dialog-info-edit
      :flag.sync="dialog_info_edit"
      :category="options.category"
      :id="infoId"
      @getList="getList"
    ></dialog-info-edit>
  </div>
</template>

<script>
import { GetList, DeleteInfo } from "@/api/news.js";
import { global } from "@/utils/global_Vue3.0.js";
import DialogInfo from "./dialog/info.vue";
import DialogInfoEdit from "./dialog/edit.vue";
import SelectVue from "@/components/Select";
import { ref, reactive, onMounted, watchEffect } from "@vue/composition-api";
import { timestampToTime } from "@/utils/common.js";
export default {
  name: "InfoList",
  components: {
    DialogInfo,
    DialogInfoEdit,
    SelectVue
  },
  setup(props, context) {
    /**
     * 数据
     */
    // 将类型传递给Dialog子组件
    const options = reactive({
      category: []
    });
    // 将编辑id传递给子组件
    const infoId = ref("");
    // 分类
    const category_value = ref("");
    // 日期
    const date_value = ref("");
    // 关键字
    // const data = reactive({
    //   configOption: {
    //     init: ["id", "title"]
    //   }
    // });
    const search_options = reactive([
      {
        value: "id",
        label: "ID"
      },
      {
        value: "title",
        label: "标题"
      }
    ]);
    const search_key = ref("id");
    const search_keyWord = ref("");
    // 信息弹窗
    const dialog_info = ref(false);
    const dialog_info_edit = ref(false);
    // 表格数据
    const loadingData = ref(false);
    const table_data = reactive({
      item: []
    });
    const deleteInfoId = ref("");
    // 总条数
    const total = ref(0);
    // 页码
    const page = reactive({
      pageNumber: 1,
      pageSize: 7
    });

    /**
     * 方法
     */
    // 获得 每页显示多少条数据
    const handleSizeChange = value => {
      console.log(value);
      page.pageSize = value;
      getList();
    };
    // 获得 页码
    const handleCurrentChange = value => {
      console.log(value);
      page.pageNumber = value;
      getList();
    };

    // 搜索条件处理
    const formatData = () => {
      let requestData = {
        pageNumber: page.pageNumber,
        pageSize: page.pageSize
      };
      // 分类ID
      if (category_value.value) {
        requestData.categoryId = category_value.value;
      }
      // 日期
      if (date_value.value.length > 0) {
        requestData.startTiem = date_value.value[0];
        requestData.endTime = date_value.value[1];
      }
      // 关键字
      if (search_keyWord.value) {
        requestData[search_key.value] = search_keyWord.value;
      }

      return requestData;
    };

    // 获取列表信息
    const getList = () => {
      // 单独处理数据
      let requestData = formatData();
      // 加载状态
      loadingData.value = true;
      GetList(requestData)
        .then(result => {
          let data = result.data.data;
          // 更新数据
          table_data.item = data.data;
          // 数据条数 统计数据
          total.value = data.total;
          // 表格动画
          loadingData.value = false;
        })
        .catch(error => {
          // 表格动画
          loadingData.value = false;
        });
    };
    // 点击编辑
    const editInfo = id => {
      infoId.value = id;
      dialog_info_edit.value = true;
    };
    // 编辑详情
    const infoDetailed = data => {
      // 在这里提交 解决刷新重新赋值的问题
      // context.root.$store.commit("infoDetailed/SET_ID", data.id);
      // context.root.$store.commit("infoDetailed/SET_TITLE", data.title);
      context.root.$store.commit("infoDetailed/UPDATE_STATE_VALUE", {
        id: {
          value: data.id,
          sessionKey: "infoId",
          session: true
        },
        title: {
          value: data.title,
          sessionKey: "infoTitle",
          session: true
        }
      });
      // 跳转页面
      context.root.$router.push({
        name: "InfoDetailed",
        params: {
          id: data.id,
          title: data.title
        }
      });
    };
    /**
     * 调用自定义的全局方法
     */
    const { confirm } = global(); // 3.0的全局方法写法
    // 删除单项
    const deleteItem = id => {
      deleteInfoId.value = [id];
      confirm({
        content: "此操作将永久删除该信息，是否继续？！",
        tip: "警告",
        fn: confirmDelete
      });
    };
    // 批量删除
    const deleteAll = () => {
      if (!deleteInfoId.value || deleteInfoId.value.length == 0) {
        context.root.$message({
          message: "请选择要删除的数据！",
          type: "error"
        });
        return false;
      }
      confirm({
        content: "此操作将永久删除选择的信息，是否继续？！",
        tip: "警告",
        fn: confirmDelete
      });
    };
    const confirmDelete = value => {
      DeleteInfo({ id: deleteInfoId.value })
        .then(result => {
          // 删除成功清空数据
          deleteInfoId.value = "";
          // 删除成功重新获取数据
          getList();
        })
        .catch(error => {});
    };
    // Vuex 获取信息分类
    const getInfoCategory = () => {
      context.root.$store
        .dispatch("common/getInfoCategory", {})
        .then(result => {
          options.category = result;
        })
        .catch(error => {});
    };
    // 格式化表格 日期
    const toDate = (row, column, cellValue, index) => {
      return timestampToTime(row.createDate);
    };
    // 格式化表格 类型
    const toCategory = row => {
      let categoryId = row.categoryId;
      let categoryData = options.category.filter(item => item.id == categoryId);
      return categoryData[0].category_name;
    };
    // 获得多选的数据
    const handleSelectionChange = value => {
      let id = value.map(item => item.id);
      deleteInfoId.value = id;
    };

    /**
     * 生命周期
     */
    onMounted(() => {
      // Vuex 获取分类
      getInfoCategory();
      // 信息列表
      getList();
    });

    return {
      // 数据
      options,
      infoId,
      category_value,
      date_value,
      // data,
      search_options,
      search_key,
      search_keyWord,
      dialog_info,
      dialog_info_edit,
      loadingData,
      table_data,
      total,
      page,
      // 方法
      handleSizeChange,
      handleCurrentChange,
      getList,
      editInfo,
      infoDetailed,
      deleteItem,
      deleteAll,
      toDate,
      toCategory,
      handleSelectionChange
    };
  }
};
</script>

<style scoped lang="scss">
@import "~@/styles/config.scss";
.label-wrap {
  &.category {
    @include labelDom(left, 60, 40);
  }
  &.date {
    @include labelDom(right, 70, 40);
  }
  &.key-word {
    @include labelDom(right, 80, 40);
  }
}
</style>