<template>
  <div id="category">
    <el-button type="danger" @click="addFirst">添加一级分类</el-button>
    <hr class="hr-e9e9e9" />
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category-wrap">
            <div class="category" v-for="firstItem in category.item" :key="firstItem.id">
              <h4>
                <svg-icon iconClass="retract" class-name="retract"></svg-icon>
                {{ firstItem.category_name}}
                <div class="button-group">
                  <el-button type="danger" size="mini" round>编辑</el-button>
                  <el-button type="success" size="mini" round>添加子级</el-button>
                  <el-button type="pramary" size="mini" round>删除</el-button>
                </div>
              </h4>
              <ul v-if="firstItem.children">
                <li v-for="childrenItem in firstItem.children" :key="childrenItem.id">
                  {{ childrenItem.category_name }}
                  <div class="button-group">
                    <el-button type="danger" size="mini" round>编辑</el-button>
                    <el-button type="pramary" size="mini" round>删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <h4 class="menu-title">一级分类编辑</h4>
          <el-form label-width="142px" :model="form" class="form-warp" ref="categoryForm">
            <el-form-item label="一级分类名称：" v-if="category_first_input">
              <el-input v-model="form.categoryName"></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称：" v-if="category_children_input">
              <el-input v-model="form.secCategoryName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="submit" :loading="submit_button_loading">确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { AddFirstCategory, GetCategory } from "@/api/news.js";
import { ref, reactive, onMounted } from "@vue/composition-api";
export default {
  name: "InfoCategory",
  setup(props, context) {
    // 数据
    const category_first_input = ref(true);
    const category_children_input = ref(true);
    const submit_button_loading = ref(false);
    const form = reactive({
      categoryName: "",
      secCategoryName: ""
    });
    const category = reactive({
      item: []
    });

    /**
     * 方法
     */
    // 添加分类
    const submit = () => {
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
      // 添加分类接口
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
            category.item.unshift(data.data);
          }
          submit_button_loading.value = false;
          // context.refs.categoryForm.resetFields();
          form.categoryName = "";
          form.secCategoryName = "";
        })
        .catch(error => {
          submit_button_loading.value = false;
          // context.refs.categoryForm.resetFields();
          form.categoryName = "";
          form.secCategoryName = "";
        });
    };
    // 添加一级分类 按钮事件
    const addFirst = () => {
      category_first_input.value = true;
      category_children_input.value = false;
    };
    // 获取信息分类 方法
    const getCategory = () => {
      // 调用接口
      GetCategory({})
        .then(result => {
          let data = result.data.data.data;
          category.item = data;
        })
        .catch(error => {});
    };

    // 3.0生命周期钩子 页面元素挂载完成后执行
    onMounted(() => {
      // 调用 获取信息分类方法
      getCategory();
    });

    return {
      category_first_input,
      category_children_input,
      submit_button_loading,
      form,
      category,
      submit,
      addFirst
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