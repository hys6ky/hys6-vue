<template>
  <div class="font-12">
    <div class="mt-10 d-flex">
      <div style="width: 70px">
        <div
          v-for="(field, num) in fieldInfo"
          :key="field.prop"
          :class="num === fieldInfo.length - 1 ? '' : 'mb-10'"
        >
          <span>{{ field.label }}：</span>
        </div>
      </div>
      <div class="flex-1 d-flex">
        <div
          v-for="(item, index) in content"
          :key="item.label"
          class="contentWidth"
          :style="{ marginLeft: index !== 0 ? '30px' : '' }"
        >
          <div
            class="d-flex"
            :class="num === fieldInfo.length - 1 ? '' : 'mb-10'"
            v-for="(field, num) in fieldInfo"
            :key="field.prop"
          >
            <span :style="{ color: compareColor(field.prop) }">
              {{ item.value[field.prop] || "--" }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "compareContent",
  data() {
    return {
      fieldInfo: [
        {
          label: "中文名称",
          prop: "norm_cname",
        },
        {
          label: "英文名称",
          prop: "norm_ename",
        },
        {
          label: "标准别名",
          prop: "norm_aname",
        },
        {
          label: "数据类型",
          prop: "data_type",
        },
        {
          label: "字段长度",
          prop: "col_len",
        },
        {
          label: "小数长度",
          prop: "decimal_point",
        },
        {
          label: "所属代码",
          prop: "code_type_id",
        },
        {
          label: "业务定义",
          prop: "business_def",
        },
        {
          label: "业务规则",
          prop: "business_rule",
        },
        {
          label: "标准定义",
          prop: "norm_basis",
        },
        {
          label: "值域",
          prop: "dbm_domain",
        },
      ],
    };
  },
  props: {
    content: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    compareColor(prop) {
      let list = [];
      this.content.forEach((item) => {
        list.push(item.value[prop].toString());
      });
      const newList = Array.from(new Set(list));
      return newList.length > 1 ? "red" : "";
    },
  },
};
</script>

<style lang="less" scoped>
.contentWidth {
  min-width: 120px;
}
</style>
