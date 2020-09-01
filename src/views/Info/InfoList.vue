<template>
  <div>
    <!-- 选项/操作 -->
    <el-row :gutter="6">
      <el-col :span="4">
        <div class="label-wrap category">
          <label for>类型：</label>
          <div class="content-wrap">
            <el-select v-model="category_value" placeholder="请选择" style="width: 100%;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
            <el-select v-model="search_keyword" style="width: 100%;">
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
        <el-input v-model="search_keyWork" placeholder="请输入内容" style="width: 100%;"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" style="width: 100%;">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <el-button
          type="danger"
          class="pull-right"
          style="width: 100%;"
          @click="dialog_info = true"
        >新增</el-button>
      </el-col>
    </el-row>
    <div class="block-space-30"></div>

    <!-- 表格 -->
    <el-table :data="table_data" border style="width: 100%">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="title" label="标题" width="600"></el-table-column>
      <el-table-column prop="category" label="类型" width="96"></el-table-column>
      <el-table-column prop="date" label="日期" width="174"></el-table-column>
      <el-table-column prop="user" label="管理人" width="100"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button size="mini" type="danger">删除</el-button>
          <el-button size="mini" type="success">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block-space-30"></div>

    <!-- 底部分页 -->
    <el-row>
      <el-col :span="8">
        <el-button size="small">批量删除</el-button>
      </el-col>
      <el-col :span="16">
        <el-pagination
          class="pull-right"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 50, 100]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="1000"
        ></el-pagination>
      </el-col>
    </el-row>

    <!-- 新增弹窗 -->
    <dialog-info :flag.sync="dialog_info"></dialog-info>
  </div>
</template>

<script>
import DialogInfo from "./dialog/info.vue";
import { ref, reactive } from "@vue/composition-api";
export default {
  name: "InfoList",
  components: {
    DialogInfo
  },
  setup(props, context) {
    // 数据
    // 类型
    const options = reactive([
      {
        value: 1,
        label: "国际信息"
      },
      {
        value: 2,
        label: "国内信息"
      },
      {
        value: 3,
        label: "行业信息"
      }
    ]);
    const category_value = ref("");
    // 日期
    const date_value = ref("");
    // 关键字
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
    const search_keyword = ref("id");
    const search_keyWork = ref("");
    // 信息弹窗
    const dialog_info = ref(false);

    // 表格数据
    const table_data = reactive([
      {
        title: "罗斯威尔事件、道西基地事件、51区、UFO机库",
        category: "国内信息",
        date: "2019-12-13 21:35:12",
        user: "超级管理员"
      },
      {
        title: "罗斯威尔事件、道西基地事件、51区、UFO机库",
        category: "国内信息",
        date: "2019-12-13 21:35:12",
        user: "超级管理员"
      },
      {
        title: "罗斯威尔事件、道西基地事件、51区、UFO机库",
        category: "国内信息",
        date: "2019-12-13 21:35:12",
        user: "超级管理员"
      },
      {
        title: "罗斯威尔事件、道西基地事件、51区、UFO机库",
        category: "国内信息",
        date: "2019-12-13 21:35:12",
        user: "超级管理员"
      }
    ]);

    // 获得 每页显示多少条数据
    const handleSizeChange = val => {
      console.log(val);
    };
    // 获得 页码
    const handleCurrentChange = val => {
      console.log(val);
    };

    return {
      // 数据
      options,
      category_value,
      date_value,
      search_options,
      search_keyword,
      search_keyWork,
      table_data,
      dialog_info,
      // 方法
      handleSizeChange,
      handleCurrentChange
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