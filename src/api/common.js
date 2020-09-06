import { GetCategory } from "@/api/news.js";
import { reactive } from "@vue/composition-api";
export function common() {
  const categoryItem = reactive({
    item: []
  });

  const getInfoCategory = () => {
    GetCategory({})
      .then(result => {
        categoryItem.item = result.data.data.data;
      })
      .catch(error => { });
  }

  return {
    getInfoCategory,
    categoryItem
  }
}