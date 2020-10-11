import { GetCityPicker } from "@/api/common.js";
import { reactive, toRefs } from "@vue/composition-api";
export function cityPicker() {
  const data = reactive({
    provinces: [],
    provinceCode: "",
    cities: [],
    cityCode: "",
    areas: [],
    areaCode: "",
    streets: [],
    streetCode: ""
  });
  /**
   * 获取数据
   */
  const getData = params => {
    GetCityPicker(params)
      .then(response => {
        if (params.type === "province") {
          data.provinces = response.data.data.data;
        } else if (params.type === "city") {
          data.cities = response.data.data.data;
        } else if (params.type === "area") {
          data.areas = response.data.data.data;
        } else {
          data.streets = response.data.data.data;
        }
      })
      .catch(error => { });
  }

  /**
     * 获取省份
     */
  const getProvince = () => {
    getData({ type: "province" });
  };

  /**
     * 选择省份 触发 获取城市
     */
  const getCity = provinceCode => {
    resetData({ type: "city" });

    getData({ type: "city", province_code: provinceCode });
  };

  /**
   * 选择城市 触发 获取区县
   */
  const getArea = cityCode => {
    resetData({ type: "area" });

    getData({ type: "area", city_code: cityCode });
  };

  /**
   * 选择区县 触发 获取街道
   */
  const getStreet = areaCode => {
    resetData({ type: "street" });

    getData({ type: "street", area_code: areaCode });
  };

  /**
   * 按需重置数据
   */
  const resetData = params => {
    if (params.type === "city") {
      data.cities = [];
      data.cityCode = "";
      data.areas = [];
      data.areaCode = "";
      data.streets = [];
      data.streetCode = "";
    } else if (params.type === "area") {
      data.areas = [];
      data.areaCode = "";
      data.streets = [];
      data.streetCode = "";
    } else if (params.type === "street") {
      data.streets = [];
      data.streetCode = "";
    }
  }

  return {
    ...toRefs(data),
    getProvince,
    getCity,
    getArea,
    getStreet
  }
}

/**
 * 将省、市、区、街道组件的逻辑代码抽离封装，并导出相关属性和方法
 */
