<template>
  <el-card class="icon-picker">
    <div slot="header" class="icon-picker-header">
      <el-input
        :value="iconSerach"
        @input="searchIcon"
        placeholder="搜索图标"
        clearable
        size="mini"
      ></el-input>
      <el-button type="minor" size="mini" @click="onClose">返回</el-button>
    </div>
    <el-scrollbar class="icon-picker-scroller">
      <div class="icon-list">
        <span
          :title="iconItem.name"
          class="icon-item"
          :class="iconItem.name === icon && 'icon-item-select'"
          @click="onClick(iconItem)"
          v-for="(iconItem, index) in iconSerach ? iconNamesFilter : iconNames"
          :key="index"
        >
          <i :class="iconItem.name"></i>
        </span>
      </div>
    </el-scrollbar>
  </el-card>
</template>
<script>
import iconsData from "@/utils/iconsdata.js";
export default {
  props: {
    icon: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      iconNames: [],
      iconNamesFilter: [],
      iconSerach: "",
    };
  },
  created() {
    this.iconNames = iconsData.map((item) => {
      return item;
    });
  },
  methods: {
    onClick(name) {
      this.$emit("select", name);
    },
    onClose() {
      this.$emit("close");
    },
    searchIcon(value) {
      this.iconSerach = value;
      if (value) {
        this.iconNamesFilter = this.iconNames.filter((item) => {
          return item.name.indexOf(value.split()) > -1;
        });
      } else {
        this.iconNamesFilter = this.iconNames;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.icon-picker {
  position: absolute;
  width: 360px;
  height: 280px;
  background: #ffffff;
  z-index: 2;
  border: 1px solid #e6eef9;
  &-header {
    display: flex;
  }
  &-scroller {
    height: 250px;
    overflow-x: hidden;
  }
  ::v-deep .el-card__header,
  ::v-deep .el-card__body {
    padding: 5px;
  }
  ::v-deep .el-input--mini {
    line-height: 28px;
  }
  ::v-deep .el-input--mini .el-input__inner {
    height: 28px;
  }
}
.icon-list {
  margin-bottom: 10px;
  .icon-item {
    cursor: pointer;
    width: 30px;
    height: 30px;
    margin: 2px;
    display: inline-block;
    border: 1px solid #e6eef9;
    text-align: center;
    line-height: 32px;
    &-select {
      border-color: #435ebe;
    }
  }
}
</style>
