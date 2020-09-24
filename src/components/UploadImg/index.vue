<template>
  <el-upload
    class="avatar-uploader"
    :action="config.uploadUrl"
    :data="data.uploadKey"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <img v-if="data.image" :src="data.image" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
import { onMounted, reactive, watchEffect } from "@vue/composition-api";
import { QiniuToken } from "@/api/common.js";
export default {
  /**
   * 1.组件的过程要做些什么事？（七牛云的token、显示默认图片、选择图片后渲染自身图片）
   * 2.最终结果要做什么？（返回选择后的图片路径）
   */
  name: "UploadImg",
  props: {
    imgUrl: {
      type: String,
      default: ""
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, context) {
    const data = reactive({
      image: "",
      uploadKey: {
        token: "",
        key: ""
      }
    });

    /**
     * 缩略图方法
     */
    const handleAvatarSuccess = (res, file) => {
      let img = `${context.root.$store.getters["common/qiniuUrl"]}${res.key}`;
      data.image = img;
      context.emit("update:imgUrl", img);
    };
    const beforeAvatarUpload = file => {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        context.root.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        context.root.$message.error("上传头像图片大小不能超过 2MB!");
      }

      // 文件名转码
      let suffix = file.name;
      let key = encodeURI(`${suffix}`);
      data.uploadKey.key = key;

      return isJPG && isLt2M;
    };

    /**
     * 获取七牛云的token
     */
    const getQiniuToken = () => {
      let requestData = {
        ak: props.config.ak,
        sk: props.config.sk,
        buckety: props.config.buckety
      };
      QiniuToken(requestData)
        .then(result => {
          data.uploadKey.token = result.data.data.token;
        })
        .catch(error => {});
    };

    /**
     * 监听
     */
    watchEffect(() => {
      data.image = props.imgUrl;
    });

    /**
     * 生命周期钩子
     */
    onMounted(() => {
      getQiniuToken();
    });

    return {
      data,
      handleAvatarSuccess,
      beforeAvatarUpload
    };
  }
};
</script>

<style scoped>
</style>