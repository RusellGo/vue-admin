<template>
  <div>
    <!-- 搜索操作 -->
    <el-row>
      <el-col :span="20">
        <div class="label-wrap">
          <label for="">关键字：</label>
          <div class="content-wrap">
            <el-row :gutter="16">
              <el-col :span="3">
                <!-- 二次封装的下拉框组件 -->
                <select-vue
                  :config="data.configOption"
                  :selectData.sync="data.selectData"
                />
              </el-col>
              <el-col :span="5">
                <el-input
                  v-model="data.searchKeywords"
                  placeholder="请输入搜索关键字"
                ></el-input>
              </el-col>
              <el-col :span="15">
                <el-button type="danger" @click="searchUser">搜索</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-button
          type="danger"
          class="pull-right"
          @click="data.dialog_add = true"
        >
          添加用户
        </el-button>
      </el-col>
    </el-row>
    <div class="block-space-30"></div>

    <!-- TableVue组件 -->
    <table-vue
      ref="userTable"
      :config="data.configTable"
      :tableRow.sync="data.tableRow"
    >
      <template v-slot:status="slotData">
        <el-switch
          v-model="slotData.data.status"
          @change="handleSwitch(slotData.data)"
          active-value="2"
          inactive-value="1"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :disabled="data.switchDisabled"
        >
        </el-switch>
        {{ slotData.data.status }}
      </template>
      <template v-slot:operation="slotData">
        <el-button type="danger" size="small" @click="deleteOne(slotData.data)">
          删除
        </el-button>
        <el-button type="success" size="small" @click="editOne(slotData.data)">
          编辑
        </el-button>
      </template>
      <template v-slot:batchRemoveTables>
        <el-button size="small" @click="batchDelete">批量删除</el-button>
      </template>
    </table-vue>

    <!-- 添加用户弹窗组件 -->
    <dialog-add-user
      :flag.sync="data.dialog_add"
      :editData.sync="data.editData"
      @addedRefreshTableData="refreshTableData"
    />
  </div>
</template>

<script>
import { ref, reactive } from "@vue/composition-api";
// 接口
import { UserDelete, UserActives, UserEdit } from "@/api/user.js";
// 组件
import SelectVue from "@/components/Select";
import TableVue from "@/components/Table";
import DialogAddUser from "./dialog/addUser.vue";
// 自定义的全局方法
import { global } from "@/utils/global_Vue3.0.js";
// 中央事件总线
import EventBus from "@/utils/bus.js";
export default {
  name: "UserList",
  components: {
    SelectVue,
    TableVue,
    DialogAddUser,
  },
  setup(props, context) {
    // 组件传参 事件总线
    // EventBus.$emit("test", 111);

    const data = reactive({
      // Select 组件配置参数
      configOption: {
        init: ["name", "phone", "email"],
      },
      // 下拉菜单的数据
      selectData: {},
      // 输入的搜索关键字
      searchKeywords: "",
      // Table 组件配置参数
      configTable: {
        // 选择框
        selection: true,
        // 记录选项
        recordCheckbox: true,
        // 表头
        tHead: [
          {
            label: "邮箱/用户名",
            field: "username",
            // width: 120
          },
          {
            label: "真实姓名",
            field: "truename",
            // width: 100
          },
          {
            label: "手机号",
            field: "phone",
            // width: 130
          },
          {
            label: "地区",
            field: "region",
          },
          {
            label: "角色",
            field: "role",
          },
          {
            label: "禁启用状态",
            field: "status",
            columnType: "slot",
            slotName: "status",
          },
          {
            label: "操作",
            columnType: "slot",
            slotName: "operation",
          },
        ],
        // 接口地址
        requestData: {
          url: "getUserList",
          method: "post",
          data: {
            pageNumber: 1,
            pageSize: 7,
          },
        },
        paginationShow: true,
        paginationLayout: "total, sizes, prev, pager, next, jumper",
      },
      // 信息弹窗
      dialog_add: false,
      // 批量删除操作 tabale选择的数据
      tableRow: {},
      // 编辑用户 传出数据
      editData: {},
      switchDisabled: false,
    });

    /**
     * 方法
     */
    // 批量删除
    const { confirm } = global(); // 自定义的全局方法 删除二次警告
    const batchDelete = () => {
      let id = data.tableRow.rowId;
      if (!id || id.length === 0) {
        context.root.$message({
          message: "请勾选要删除的数据",
          type: "warning",
        });
        return false;
      }
      confirm({
        content: "此操作将永久删除选择的信息，是否继续？！",
        tip: "警告",
        fn: confirmDelete,
      });
    };
    // 删除接口联调
    // 定义一个和tableVue组件ref名相同的变量并导出
    const userTable = ref(null);
    const confirmDelete = () => {
      UserDelete({ id: data.tableRow.rowId })
        .then((response) => {
          // 父组件调用子组件方法 刷新表格
          // 其中一种写法
          // context.refs.userTable.refreshData();
          // 第二种写法 使用定义的变量
          refreshTableData();
        })
        .catch((error) => {});
    };
    // 单项删除
    const deleteOne = (params) => {
      data.tableRow.rowId = [params.id];
      confirm({
        content: "此操作将永久删除选择的信息，是否继续？！",
        tip: "警告",
        fn: confirmDelete,
      });
    };

    // 编辑 表格单条数据
    const editOne = (params) => {
      // 设置为true 打开弹窗
      data.dialog_add = true;
      // 子组件赋值 浅拷贝
      data.editData = Object.assign({}, params);
    };

    // 单独的刷新表格数据的方法
    const refreshTableData = () => {
      userTable.value.refreshData();
    };

    // 切换switch时修改用户状态 接口联调
    const handleSwitch = (params) => {
      if (data.switchDisabled) {
        return false;
      }
      data.switchDisabled = true;
      let requestData = {
        id: params.id,
        status: params.status,
      };
      // 用户禁启用接口调用
      UserActives(requestData)
        .then((response) => {
          context.root.$message({
            message: response.data.message,
            type: "success",
          });
          data.switchDisabled = false;
        })
        .catch((error) => {
          data.switchDisabled = false;
        });
    };

    // 搜索
    const searchUser = () => {
      let requestData = {
        [data.selectData.value]: data.searchKeywords,
      };
      // 调用table-vue组件的方法 传参并刷新数据
      context.refs.userTable.paramsRefreshData(requestData);
    };

    return {
      data,
      userTable,
      batchDelete,
      deleteOne,
      editOne,
      refreshTableData,
      handleSwitch,
      searchUser,
    };
  },
};
</script>

<style scoped lang="scss">
@import "~@/styles/config.scss";
.label-wrap {
  @include labelDom(right, 80, 40);
}
</style>