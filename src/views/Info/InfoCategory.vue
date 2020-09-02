<template>
  <div id="category">
    <el-button type="danger">添加一级分类</el-button>
    <hr class="hr-e9e9e9" />
    <div>
      <el-row :gutter="30">
        <el-col :span="8">
          <div class="category-wrap">
            <div class="category">
              <h4>
                <svg-icon iconClass="retract" class-name="retract"></svg-icon>新闻
                <div class="button-group">
                  <el-button type="danger" size="mini" round>编辑</el-button>
                  <el-button type="success" size="mini" round>添加子级</el-button>
                  <el-button type="pramary" size="mini" round>删除</el-button>
                </div>
              </h4>
              <ul>
                <li>
                  国内
                  <div class="button-group">
                    <el-button type="danger" size="mini" round>编辑</el-button>
                    <el-button type="pramary" size="mini" round>删除</el-button>
                  </div>
                </li>
                <li>国内</li>
                <li>国内</li>
                <li>国内</li>
              </ul>
            </div>
            <div class="category">
              <h4>
                <svg-icon iconClass="retract" class-name="retract"></svg-icon>新闻
              </h4>
              <ul>
                <li>国内</li>
                <li>国内</li>
                <li>国内</li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span="16">
          <h4 class="menu-title">一级分类编辑</h4>
          <el-form label-width="142px" :model="formLabelAlign" class="form-warp">
            <el-form-item label="一级分类名称：">
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="二级分类名称：">
              <el-input v-model="formLabelAlign.region"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="danger">确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "@vue/composition-api";
export default {
  name: "InfoCategory",
  setup(props, context) {
    const formLabelAlign = reactive({
      name: "",
      region: ""
    });

    return {
      formLabelAlign
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