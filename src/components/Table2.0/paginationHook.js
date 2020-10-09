import { reactive } from "@vue/composition-api";
export function paginationHook() {
  const pageData = reactive({
    currentPage: 1,
    pageSize: 7,
    total: 0,
    pageSizes: [7, 10, 20, 50]
  });

  const totalCount = value => pageData.total = value;

  const handleSizeChange = val => {
    pageData.pageSize = val;
  }

  const handleCurrentChange = val => {
    pageData.currentPage = val;
  }

  return {
    pageData,
    totalCount,
    handleSizeChange,
    handleCurrentChange
  }
}