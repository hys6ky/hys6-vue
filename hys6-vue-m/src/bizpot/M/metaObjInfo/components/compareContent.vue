<template>
  <div class="font-12">
    <div class="d-flex mt-10">
      <div style="width: 100px">表信息</div>
      <div class="flex-1">
        <div class="d-flex" v-for="(title, num) in tableInfo" :key="num">
          <span
            v-for="(item, index) in content[title.prop]"
            :key="index"
            class="flex-1 contentWidth"
          >
            <span> {{ title.label }}： </span>
            <span :style="{ color: compareColor(content[title.prop]) }">
              {{ item }}
            </span>
          </span>
        </div>
      </div>
    </div>
    <div class="d-flex mt-10">
      <div style="width: 100px">字段信息</div>
      <div class="flex-1" v-if="content.type !== '2'">
        <div
          v-for="(item, index) in content.colQueryVoList"
          :key="index"
          :class="index !== 0 ? 'mt-10' : ''"
        >
          <div class="d-flex" v-for="(field, num) in fieldInfo" :key="num">
            <span
              v-for="(item1, index1) in item[field.prop]"
              :key="index1"
              class="flex-1 contentWidth"
            >
              <span>{{ field.label }}：</span>
              <span :style="{ color: compareColor(item[field.prop]) }">
                {{ item1 }}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div class="flex-1" v-else>
        <div class="d-flex" v-for="(field, num) in sqlInfo" :key="num">
          <span
            v-for="(item1, index1) in content[field.prop]"
            :key="index1"
            class="flex-1 contentWidth"
          >
            <span>{{ field.label }}：</span>
            <span :style="{ color: compareColor(content[field.prop]) }">
              {{ item1 }}
            </span>
          </span>
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
      tableInfo: [
        {
          label: "表英文名",
          prop: "en_name",
        },
        {
          label: "表中文名",
          prop: "ch_name",
        },
      ],
      fieldInfo: [
        {
          label: "字段英文名",
          prop: "col_en_name",
        },
        {
          label: "字段中文名",
          prop: "col_ch_name",
        },
        {
          label: "字段类型",
          prop: "col_type",
        },
        {
          label: "字段长度",
          prop: "col_len",
        },
      ],
      sqlInfo: [
        {
          label: "SQL信息",
          prop: "funcQueryVo",
        },
      ],
      // content: {
      //   en_name: ["tbl1", "tbl1", "tbl1", "tbl1"],
      //   ch_name: ["表1", "表1", "表1", "表1"],
      //   colQueryVoList: [
      //     {
      //       col_en_name: ["col1", "col1", "col1", "col1"],
      //       col_ch_name: ["字段1", "字段-1", "字段-2", "字段-3"],
      //       col_type: ["varchar", "varchar", "varchar", "varchar"],
      //       col_len: ["10", "10", "10", "10"],
      //     },
      //     {
      //       col_en_name: ["col1", "col1", "col1", "col1"],
      //       col_ch_name: ["字段1", "字段-1", "字段-2", "字段-3"],
      //       col_type: ["varchar", "varchar", "varchar", "varchar"],
      //       col_len: ["10", "10", "10", "10"],
      //     },
      //   ],
      // },
    };
  },
  props: {
    content: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    compareColor(list) {
      const newList = Array.from(new Set(list));
      return newList.length > 1 ? "red" : "";
    },
  },
};
</script>

<style lang="less" scoped>
.contentWidth {
  min-width: 255px;
}
</style>
