<template>
  <div class="overflow-h">
    <el-row :gutter="10">
      <!-- 省 -->
      <el-col :span="6" v-if="init.province">
        <el-select v-model="provinceCode" @change="getCity(provinceCode)">
          <el-option
            v-for="province in provinces"
            :key="province.PROVINCE_CODE"
            :value="province.PROVINCE_CODE"
            :label="province.PROVINCE_NAME"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.city">
        <el-select v-model="cityCode" @change="getArea(cityCode)">
          <el-option
            v-for="city in cities"
            :key="city.CITY_CODE"
            :value="city.CITY_CODE"
            :label="city.CITY_NAME"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.area">
        <el-select v-model="areaCode" @change="getStreet(areaCode)">
          <el-option
            v-for="area in areas"
            :key="area.AREA_CODE"
            :value="area.AREA_CODE"
            :label="area.AREA_NAME"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" v-if="init.street">
        <el-select v-model="streetCode">
          <el-option
            v-for="street in streets"
            :key="street.STREET_CODE"
            :value="street.STREET_CODE"
            :label="street.STREET_NAME"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { GetCityPicker } from "@/api/common.js";
import { ref, reactive, watch, onBeforeMount } from "@vue/composition-api";
// 逻辑抽离文件引入
import { cityPicker } from "./cityPicker.js";
export default {
  name: "CityPicker",
  props: {
    cityPickerLevel: {
      type: Array,
      default: () => []
    },
    cityPickerData: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, context) {
    // 初始化省市区街道联动
    const init = reactive({
      province: false,
      city: false,
      area: false,
      street: false
    });

    /**
     * 引入 组件方法 数据
     */
    const {
      // 获取省份
      getProvince,
      provinces,
      provinceCode,
      // 获取城市
      getCity,
      cities,
      cityCode,
      // 获取区县
      getArea,
      areas,
      areaCode,
      // 获取街道
      getStreet,
      streets,
      streetCode
    } = cityPicker();

    /**
     * 初始化
     */
    const initCityPicker = () => {
      let initData = props.cityPickerLevel;
      if (initData.length == 0) {
        for (let key in init) {
          init[key] = true;
        }
      } else {
        initData.forEach(item => {
          init[item] = true;
        });
      }
    };

    /**
     * 生命周期钩子
     */
    onBeforeMount(() => {
      // 初始化
      initCityPicker();
      // 获取省份
      getProvince();
    });

    /**
     *监听省、市、区、街道选择
     */
    let requestCityPikerData;
    watch(
      [
        () => provinceCode.value,
        () => cityCode.value,
        () => areaCode.value,
        () => streetCode.value
      ],
      ([province, city, area, street]) => {
        requestCityPikerData = {
          province,
          city,
          area,
          street
        };
        context.emit("update:cityPickerData", requestCityPikerData);
      }
    );

    return {
      init,
      provinces,
      provinceCode,
      cities,
      cityCode,
      areas,
      areaCode,
      streets,
      streetCode,
      getCity,
      getArea,
      getStreet
    };
  }
};
</script>

<style scoped lang="scss">
</style>