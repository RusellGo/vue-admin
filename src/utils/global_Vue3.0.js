import { Message, MessageBox } from "element-ui";
import { ref } from "@vue/composition-api";
export function global() {
  const str = ref("");
  const confirm = (pramas) => {
    MessageBox.confirm(pramas.content, pramas.tip || "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: pramas.type || "warning",
      center: true
    })
      .then(() => {
        pramas.fn && pramas.fn(pramas.id);
        Message({
          type: "success",
          message: "删除成功!"
        });
      })
      .catch(() => {
        Message({
          type: "info",
          message: "已取消删除"
        });
      });
  }

  return {
    str,
    confirm
  }
}
