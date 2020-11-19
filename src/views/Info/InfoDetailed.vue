<template>
  <el-form
    :model="form"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="信息分类：" prop="infoCategory">
      <el-select v-model="form.categoryId">
        <el-option
          v-for="item in data.category"
          :key="item.id"
          :label="item.category_name"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="新闻标题：" prop="newsTitle">
      <el-input v-model="form.title"></el-input>
    </el-form-item>

    <el-form-item label="缩略图：" prop="thumbnail">
      <UploadImg :imgUrl.sync="form.imgUrl" :config="uploadImgConfig" />
    </el-form-item>

    <el-form-item label="发布日期：" prop="publishedTime">
      <el-date-picker
        v-model="form.createDate"
        type="date"
        placeholder="选择日期"
        disabled
      ></el-date-picker>
    </el-form-item>

    <el-form-item label="详细内容：" prop="detailedContent">
      <quill-editor v-model="form.content" :options="data.editorOption" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit" :loading="data.submitLoading"
        >保存</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { GetList, EditInfo } from "@/api/news.js";
import { ref, reactive, onMounted, onActivated } from "@vue/composition-api";
import { timestampToTime } from "@/utils/common.js";
// 导入缩略图组件
import UploadImg from "components/UploadImg";
// 富文本编辑器
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  name: "InfoDetailed",
  components: {
    quillEditor: quillEditor,
    UploadImg: UploadImg,
  },
  setup(props, context) {
    // 信息分类数据
    const data = reactive({
      id:
        context.root.$route.params.id ||
        context.root.$store.getters["infoDetailed/infoId"],
      category: [],
      editorOption: {},
      submitLoading: false,
    });
    const form = reactive({
      categoryId: "",
      title: "",
      createDate: "",
      content: "",
      imgUrl: "",
    });
    // 图片上传配置
    const uploadImgConfig = reactive({
      uploadUrl: "http://up-z2.qiniup.com",
      ak: "",
      sk: "",
      buckety: "",
    });

    /**
     * Vuex 获取信息分类
     */
    const getInfoCategory = () => {
      context.root.$store
        .dispatch("common/getInfoCategory", {})
        .then((result) => {
          data.category = result;
        })
        .catch((error) => {});
    };

    /**
     * 获取当前id的详细信息
     */
    const getInfo = () => {
      let requestData = {
        pageNumber: 1,
        pageSize: 1,
        id: data.id,
      };
      GetList(requestData)
        .then((result) => {
          let resultData = result.data.data.data[0];
          form.categoryId = resultData.categoryId;
          form.title = resultData.title;
          form.createDate = timestampToTime(resultData.createDate);
          form.content = resultData.content;
          form.imgUrl = requestData.imgUrl;
        })
        .catch((error) => {});
    };

    /**
     * 保存 （修改数据时一定需要一个Id）
     */
    const submit = () => {
      if (form.title == "") {
        context.root.$message({
          message: "标题不能为空",
          type: "error",
        });
        return false;
      }
      if (form.content == "") {
        context.root.$message({
          message: "内容不能为空",
          type: "error",
        });
        return false;
      }
      let requestData = {
        id: data.id,
        categoryId: form.categoryId,
        title: form.title,
        content: form.content,
        imgUrl: form.imgUrl,
      };
      data.submitLoading = true;
      EditInfo(requestData)
        .then((result) => {
          context.root.$message({
            message: result.data.message,
            type: "success",
          });
          data.submitLoading = false;
        })
        .catch((error) => {
          data.submitLoading = false;
        });
    };

    /**
     * 生命周期钩子
     */
    onMounted(() => {
      getInfoCategory();
      getInfo();
    });

    // 该生命周期配合keep-alive一起使用 进入页面
    onActivated(() => {
      data.id =
        context.root.$route.params.id ||
        context.root.$store.getters["infoDetailed/infoId"];
      getInfo();
    });

    return {
      data,
      form,
      uploadImgConfig,
      submit,
    };
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>