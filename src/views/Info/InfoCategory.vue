<template>
  <div id="category">
    <el-button type="danger" @click="addFirst({type: 'category_first_add'})">添加一级分类</el-button>
    <hr class="hr-e9e9e9" />
    <div>
      <el-row :gutter="30">
        <el-col :span="10">
          <div class="category-wrap">
            <div class="category" v-for="firstItem in category.item" :key="firstItem.id">
              <!-- 一级分类 -->
              <h4>
                <svg-icon iconClass="spread" class-name="spread"></svg-icon>
                {{ firstItem.category_name}}
                <div class="button-group">
                  <el-button
                    type="danger"
                    size="mini"
                    round
                    @click="editCategory({data: firstItem, type: 'category_first_edit'})"
                  >编辑</el-button>
                  <el-button
                    type="success"
                    size="mini"
                    round
                    @click="addChildren({data: firstItem, type: 'category_children_add'})"
                  >添加子级</el-button>
                  <el-button
                    type="pramary"
                    size="mini"
                    round
                    @click="deleteCategoryConfirm(firstItem.id)"
                  >删除</el-button>
                </div>
              </h4>
              <!-- 子级分类 -->
              <ul v-if="firstItem.children">
                <li v-for="childrenItem in firstItem.children" :key="childrenItem.id">
                  {{ childrenItem.category_name }}
                  <div class="button-group">
                    <el-button
                      type="danger"
                      size="mini"
                      round
                      @click="editChildren({data: firstItem, type: 'category_children_edit'})"
                    >编辑</el-button>
                    <el-button
                      type="pramary"
                      size="mini"
                      round
                      @click="deleteChildrenCategoryConfirm(childrenItem.id)"
                    >删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <h4 class="menu-title">一级分类编辑</h4>
          <el-form label-width="142px" :model="form" class="form-warp" ref="categoryForm">
            <el-form-item label="一级分类名称：" v-if="category_first_input">
              <el-input v-model="form.categoryName" :disabled="category_first_disabled"></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称：" v-if="category_children_input">
              <el-input v-model="form.secCategoryName" :disabled="category_children_disabled"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                @click="submit"
                :loading="submit_button_loading"
                :disabled="submit_button_disabled"
              >确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  AddFirstCategory,
  AddChildrenCategory,
  GetCategory,
  DeleteCategory,
  EditCategory
} from "@/api/news.js";
import { ref, reactive, onMounted, watchEffect } from "@vue/composition-api";
import { global } from "@/utils/global_Vue3.0.js";
// Vue3.0
import { common } from "@/api/common.js";
export default {
  name: "InfoCategory",
  setup(props, context) {
    // 数据
    // 提交按钮 操作类型
    const submit_button_type = ref("");
    // 显示\隐藏 输入框
    const category_first_input = ref(true);
    const category_children_input = ref(true);
    // 按钮动画
    const submit_button_loading = ref(false);
    // 输入框、按钮禁用
    const category_first_disabled = ref(true);
    const category_children_disabled = ref(true);
    const submit_button_disabled = ref(true);
    // 存放要删除对应的id
    const deleteId = ref("");
    // 表单数据
    const form = reactive({
      categoryName: "",
      secCategoryName: ""
    });
    // 分类数据
    const category = reactive({
      item: [],
      current: []
    });

    /**
     * 方法
     */
    // 提交时判断类型 对应类型执行对应方法
    const submit = () => {
      if (submit_button_type.value == "category_first_add") {
        addFirstCategory();
      } else if (submit_button_type.value == "category_first_edit") {
        editFirstCategory();
      } else if (submit_button_type.value == "category_children_add") {
        addChildrenCategory();
      } else if (submit_button_type.value == "category_children_edit") {
        editChildrenCategory();
      }
    };
    // 添加一级分类 按钮事件
    const addFirst = params => {
      submit_button_type.value = params.type;
      category_first_input.value = true;
      category_children_input.value = false;
      //
      category_first_disabled.value = false;
      // category_children_disabled,
      submit_button_disabled.value = false;
      form.categoryName = "";
    };
    // 添加一级分类
    const addFirstCategory = () => {
      // 简单判断是否输入
      if (!form.categoryName) {
        context.root.$message({
          message: "分类名称不能为空!",
          type: "error"
        });
        return false;
      }
      // 为按钮添加loading动画 防止多次点击
      submit_button_loading.value = true;
      // 添加一级分类接口
      AddFirstCategory({ categoryName: form.categoryName })
        .then(result => {
          let data = result.data;
          if (data.resCode === 0) {
            context.root.$message({
              message: data.message,
              type: "success"
            });
            // getCategory(); // 每次添加分类都会再次请求获取接口 比较耗费资源
            // 使用数组方法 添加到数组开头
            category.item.push(data.data);
          }
          submit_button_loading.value = false;
          // context.refs.categoryForm.resetFields();
          form.categoryName = "";
          form.secCategoryName = "";

          category_first_disabled.value = true;
          category_children_input.value = true;
          submit_button_disabled.value = true;
        })
        .catch(error => {
          submit_button_loading.value = false;
          // context.refs.categoryForm.resetFields();
          form.categoryName = "";
          form.secCategoryName = "";
        });
    };
    // 添加子级分类 按钮事件
    const addChildren = params => {
      // 设置提交类型
      submit_button_type.value = params.type;
      category_first_input.value = true;
      category_first_disabled.value = true;
      category_children_input.value = true;
      category_children_disabled.value = false;
      submit_button_disabled.value = false;
      // 显示一级分类名称文本
      form.categoryName = params.data.category_name;
      category.current = params.data;
    };
    // 添加子级分类
    const addChildrenCategory = () => {
      // 简单判断是否输入
      if (!form.secCategoryName) {
        context.root.$message({
          message: "分类名称不能为空!",
          type: "error"
        });
        return false;
      }
      // 为按钮添加loading动画 防止多次点击
      submit_button_loading.value = true;
      let requestData = {
        categoryName: form.secCategoryName,
        parentId: category.current.id
      };
      // 添加子集分类 接口
      AddChildrenCategory(requestData)
        .then(result => {
          let responseData = result.data;
          if (responseData.resCode == 0) {
            context.root.$message({
              message: responseData.message,
              type: "success"
            });
            // 添加成功刷新
            getInfoCategoryAll();
          }
          submit_button_loading.value = false;
          form.categoryName = "";
          form.secCategoryName = "";

          category_first_disabled.value = true;
          category_children_disabled.value = true;
          submit_button_disabled.value = true;
        })
        .catch(error => {
          submit_button_loading.value = true;
          form.categoryName = "";
          form.secCategoryName = "";
        });
    };
    // 获取信息分类 方法
    // Vue3.0
    const { getInfoCategory, getInfoCategoryAll, categoryItem } = common();
    // 删除分类
    const { confirm } = global(); // 3.0的全局方法写法
    const deleteCategoryConfirm = categoryID => {
      deleteId.value = categoryID;
      // 弹框警示
      confirm({
        content: "此操作将永久删除当前信息，是否继续？！",
        tip: "警告",
        fn: deleteCategory,
        catchFn: () => (deleteId.value = "")
      });
    };
    // 真正删除的地方 调用接口
    const deleteCategory = () => {
      DeleteCategory({ categoryId: deleteId.value })
        .then(result => {
          // 操作数组 splice
          // ES6方法 findIndex 根据条件查找数组索引
          // let index = category.item.findIndex(
          //   item => item.id == deleteId.value
          // );
          // category.item.splice(index, 1);

          // filter 方法
          let newData = category.item.filter(item => item.id != deleteId.value);
          category.item = newData;
        })
        .catch(error => {});
    };
    // 删除子级
    const deleteChildrenCategoryConfirm = categoryID => {
      deleteId.value = categoryID;
      // 弹框警示
      confirm({
        content: "此操作将永久删除当前信息，是否继续？！",
        tip: "警告",
        fn: deleteChildrenCategory,
        catchFn: () => (deleteId.value = "")
      });
    };
    // 真正删除的地方 调用接口
    const deleteChildrenCategory = () => {
      DeleteCategory({ categoryId: deleteId.value })
        .then(result => {
          // 删除成功刷新数据
          getInfoCategoryAll();
        })
        .catch(error => {});
    };
    // 编辑 按钮事件
    const editCategory = params => {
      // 设置提交类型
      submit_button_type.value = params.type;
      category_children_input.value = false;
      category_first_disabled.value = false;
      submit_button_disabled.value = false;
      // 一级分类名称还原
      form.categoryName = params.data.category_name;
      // 存储当前的数据对象
      category.current = params.data;
    };
    // 修改一级分类 接口调用
    const editFirstCategory = () => {
      if (form.categoryName == "") {
        context.root.$message({
          message: "修改分类名称不能为空",
          type: "error"
        });
        return false;
      }
      let requestData = {
        id: category.current.id,
        categoryName: form.categoryName
      };
      EditCategory(requestData)
        .then(result => {
          context.root.$message({
            message: result.data.message,
            type: "success"
          });
          category.current.category_name = result.data.data.data.categoryName;
          // 清空输入框
          form.categoryName = "";
          category.current = [];
          category_first_disabled.value = true;
          category_children_input.value = true;
          submit_button_disabled.value = true;
        })
        .catch(error => {});
    };
    // 编辑子级 按钮事件
    const editChildren = params => {
      // 设置提交类型
      submit_button_type.value = params.type;
      category_first_disabled.value = true;
      category_children_input.value = true;
      category_children_disabled.value = false;
      submit_button_disabled.value = false;
      // 一级分类名称还原
      form.categoryName = params.data.category_name;
      form.secCategoryName = params.data.children[0].category_name;
      // console.log(params.data.children);
      // 存储当前的数据对象
      category.current = params.data.children[0];
    };
    // 修改一级分类 接口调用
    const editChildrenCategory = () => {
      if (form.secCategoryName == "") {
        context.root.$message({
          message: "修改分类名称不能为空",
          type: "error"
        });
        return false;
      }
      let requestData = {
        id: category.current.id,
        categoryName: form.secCategoryName
      };
      EditCategory(requestData)
        .then(result => {
          context.root.$message({
            message: result.data.message,
            type: "success"
          });
          category.current.category_name = result.data.data.data.categoryName;
          // 清空输入框
          form.secCategoryName = "";
          category.current = [];
          category_children_disabled.value = true;
          submit_button_disabled.value = true;
        })
        .catch(error => {});
    };

    /**
     * 生命周期
     */
    // 3.0生命周期钩子 页面元素挂载完成后执行
    onMounted(() => {
      // 调用 获取信息分类方法
      // getCategory();
      getInfoCategoryAll();
    });

    watchEffect(() => {
      category.item = categoryItem.item;
    });

    return {
      category_first_input,
      category_children_input,
      submit_button_loading,
      category_first_disabled,
      category_children_disabled,
      submit_button_disabled,
      form,
      category,
      submit,
      addFirst,
      addChildren,
      deleteCategoryConfirm,
      deleteChildrenCategoryConfirm,
      editCategory,
      editChildren
    };
  }
};
</script>

<style scoped lang="scss">
@import "~@/styles/config.scss";
.hr-e9e9e9 {
  margin: 30px -30px;
  border: none;
  border-bottom: 1px solid #e9e9e9;
}
.category {
  position: relative;
  line-height: 44px;
  cursor: pointer;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 20px;
    bottom: 0;
    width: 32px;
    border-left: 1px dotted #000;
  }
  h4 {
    position: relative;
    padding-left: 40px;
  }
  svg {
    position: absolute;
    top: 12px;
    left: 12px;
    background-color: #fff;
    font-size: 17px;
  }
  li {
    position: relative;
    padding-left: 40px;
    margin-left: 21px;
    &:before {
      content: "";
      position: absolute;
      top: 22px;
      left: 0;
      width: 32px;
      border-bottom: 1px dotted #000;
    }
  }
  h4,
  li {
    @include webkit(transition, all 0.3s ease 0s);
    &:hover {
      .button-group {
        display: block;
      }
      background-color: #f3f3f3;
    }
  }
}
.category-wrap {
  div:first-child {
    &:before {
      top: 20px;
    }
  }
  div:last-child {
    &:before {
      bottom: 21px;
    }
  }
}
.button-group {
  position: absolute;
  display: none;
  top: 0;
  right: 11px;
  font-size: 13px;
  z-index: 2;
}
.menu-title {
  line-height: 44px;
  padding-left: 22px;
  background-color: #f3f3f3;
}
.form-warp {
  width: 410px;
  padding-top: 26px;
}
</style>