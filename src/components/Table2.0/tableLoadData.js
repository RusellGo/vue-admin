import { reactive } from "@vue/composition-api";
// 请求接口整合
import { requestUrl } from "@/api/requestUrl.js";
// 请求接口
import { LoadTableData } from "@/api/common.js";

export function loadData() {

  const tableData = reactive({
    item: [],
    total: 0
  });

  const tableLoadData = params => {
    let formatData = {
      url: requestUrl[params.url],
      method: params.method,
      data: params.data || {}
    };
    LoadTableData(formatData)
      .then(result => {
        let responseData = result.data.data.data;
        if (responseData && responseData.length > 0) {
          tableData.item = responseData;
          tableData.total = result.data.data.total;
        }
      })
      .catch(error => { });
  }

  return {
    tableData,
    tableLoadData
  }
}
