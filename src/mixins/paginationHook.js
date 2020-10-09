let paginationHook = {
  data() {
    return {
      currentPage: 1,
      pageSize: 7,
      total: 0,
      pageSizes: [7, 10, 20, 50]
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.tableConfig.requestData.data.pageSize = this.pageSize;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.tableConfig.requestData.data.pageNumber = this.currentPage;
      this.getTableData();
    }
  }
}

export default paginationHook;
