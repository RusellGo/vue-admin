// 请求接口整合
import { requestUrl } from "@/api/requestUrl.js";
// 请求接口
import { LoadTableData } from "@/api/common.js";
let tableLoadData = {
  data() {
    return {}
  },
  created() {

  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      let params = this.tableConfig.requestData;
      let formatData = {
        url: requestUrl[params.url],
        method: params.method,
        data: params.data || {}
      };
      LoadTableData(formatData)
        .then(result => {
          let responseData = result.data.data.data;
          if (responseData && responseData.length > 0) {
            this.tableData = responseData;
            this.total = result.data.data.total;
          }
        })
        .catch(error => { });
    }
  }
}

export default tableLoadData;