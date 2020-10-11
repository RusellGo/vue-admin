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
                <select-vue :config="data.configOption" />
              </el-col>
              <el-col :span="5">
                <el-input
                  v-model="data.inputValue"
                  placeholder="请输入搜索关键字"
                ></el-input>
              </el-col>
              <el-col :span="15">
                <el-button>搜索</el-button>
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
    <table-vue :config="data.configTable">
      <template v-slot:status="slotData">
        <el-switch
          v-model="slotData.data.name"
          active-color="#13ce66"
          inactive-color="#ff4949"
        >
        </el-switch>
      </template>
      <template v-slot:operation="slotData">
        <el-button type="danger" size="small" @click="test(slotData.data)">
          删除
        </el-button>
        <el-button type="success" size="small" @click="test(slotData.data)">
          编辑
        </el-button>
      </template>
    </table-vue>

    <!-- 添加用户弹窗组件 -->
    <dialog-add-user :flag.sync="data.dialog_add" />
  </div>
</template>

<script>
import { reactive } from "@vue/composition-api";
import SelectVue from "@/components/Select";
import TableVue from "@/components/Table";
import DialogAddUser from "./dialog/addUser.vue";
export default {
  name: "UserList",
  components: {
    SelectVue,
    TableVue,
    DialogAddUser
  },
  setup(props, context) {
    const data = reactive({
      // Select 组件配置参数
      configOption: {
        init: ["name", "phone", "email"]
      },
      inputValue: "",
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
            field: "email",
            width: 120
          },
          {
            label: "真实姓名",
            field: "name",
            width: 100
          },
          {
            label: "手机号",
            field: "phone",
            width: 130
          },
          {
            label: "地区",
            field: "address"
          },
          {
            label: "角色",
            field: "role"
          },
          {
            label: "禁启用状态",
            field: "status",
            columnType: "slot",
            slotName: "status"
          },
          {
            label: "操作",
            columnType: "slot",
            slotName: "operation"
          }
        ],
        // 接口地址
        requestData: {
          url: "getUserList",
          method: "post",
          data: {
            pageNumber: 1,
            pageSize: 7
          }
        },
        paginationShow: true,
        paginationLayout: "total, sizes, prev, pager, next, jumper"
      },
      // 信息弹窗
      dialog_add: false
    });

    /**
     * 方法
     */
    const test = params => {
      console.log(params);
    };

    return {
      data,
      test
    };
  }
};
</script>

<style scoped lang="scss">
@import "~@/styles/config.scss";
.label-wrap {
  @include labelDom(right, 80, 40);
}
</style>