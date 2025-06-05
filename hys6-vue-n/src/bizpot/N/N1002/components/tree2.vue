<!--
 * 下拉树形选择
-->
<template>
    <el-select :collapse-tags="true" clearable ref="selectTree" :value="value" v-model="valueName" :multiple="multiple" :clearable="clearable"
        @clear="clearHandle" @change="changeValue">
        <el-option :value="valueName" class="options">
            <el-tree check-strictly  :default-expand-all="true" show-checkbox @check-change="checkChange" id="tree-option" ref="selectTree1" :accordion="accordion" :data="options" :props="props"
                node-key="id" @node-click="handleNodeClick">
                <span slot-scope="{ data }">
                    <i :class="[data.color != null ? 'ification_col' : '']"
                        :style="{ 'background-color': data.color }"></i>&nbsp;&nbsp;{{ data.name }}
                </span>
            </el-tree>
        </el-option>
    </el-select>
  </template>
  <script>
  export default {
    name: "el-tree-select",
    props: {
        // 配置项
        props: {
            type: Object,
            default: () => {
                return {
                    value: 'id',
                    children: 'children',
                    label: 'name',

                }
            }
        },
        // 选项列表数据(树形结构的对象数组)
        options: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 初始值（单选）
        value: {
            type: Object,
            default: () => {
                return {}
            }
        },
        // 初始值（多选）
        valueMultiple: {
            type: Array,
            default: () => {
                return []
            }
        },
        // 可清空选项
        clearable: {
            type: Boolean,
            default: true
        },
        // 自动收起
        accordion: {
            type: Boolean,
            default: false
        },
        // 是否多选
        multiple: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            resultValue: [], // 传给父组件的数组对象值
            valueName: this.multiple ? [] : '' // 输入框显示值
        }
    },
    watch: {
        value() {
            this.resultValue = this.multiple ? this.valueMultiple : this.value;   // 初始值
            this.initHandle()
        }
    },
    mounted() {
        if(this.valueMultiple.length !== 0){
            let str = this.valueMultiple.join(',')
            this.$executeRequest
          .execPostByControllerAllMappingName("/N/N1001/queryDirById", this.valueMultiple).then((res)=>{
            res.data.forEach((item)=>{
                item.id  = item.dir_id
                item.name  = item.dir_name
            })
            this.resultValue = res.data
        this.initHandle();

          })
        }
       
        
    },
    methods: {
        checkChange(node ,checked) {
            if(checked){
                let num = 0;
                this.valueName.forEach(item => {
                        item == node[this.props.label] ? num++ : num;
                    })
                    if (num == 0) {
                        this.valueName.push(node[this.props.label]); // 输入框显示值
                        this.resultValue.push(node);
                    }

        }else{
            this.valueName = this.valueName.filter((item)=>{
                return item !== node[this.props.label]
            })
            this.resultValue = this.resultValue.filter((item)=>{
              return item.id !== node.id
            })
        }
            this.$emit('getValue', this.resultValue);

      },
        // 初始化显示
      initHandle() {
            if (this.resultValue) {
                if (this.multiple) {
                    // 多选 
                    this.resultValue.forEach(item => this.valueName.push(item.name));
                } else {
                    // 单选
                    this.valueName = this.resultValue.name;
                }
            }
            this.initScroll()
        },
        // 初始化滚动条
        initScroll() {
            this.$nextTick(() => {
                let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
                let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
                scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
                scrollBar.forEach(ele => ele.style.width = 0)
            })
        },
        // 切换选项
        handleNodeClick(obj) {
            // 设置点击叶子节点后被选中 可以更改为点击父节点也生效
            if(!obj.isLeaf){
          const params = {
        parentId: 0,
        catalogId: obj.id
      };
    this.$executeRequest
        .execByControllerMappingName("/N/N1001/queryByParentId", params)
        .then((res)=>{
          if (res.code != 999) {
            return;
          }
          obj.children = []
          for(var index in res.data) {
            obj.children.push({
              id: res.data[index].id, 
              label: res.data[index].name, 
              name: res.data[index].label, 
              isLeaf: res.data[index].isLeaf,
              status: res.data[index].status,
              type: res.data[index].type,
              type: 'text', 
              children: []
            })
          }
          obj.children.forEach((item)=>{
            this.valueMultiple.forEach((i)=>{

                if(item.id === i){
                    let num = 0;
                this.valueName.forEach(a => {
                        a == item[this.props.label] ? num++ : num;
                    })
                    if (num == 0) {
                        this.valueName.push(item[this.props.label]); // 输入框显示值
                        this.resultValue.push(item);

                    }
                    this.$nextTick(()=>{
                        this.$refs.selectTree1.setChecked(item.id,true);
                    })
                }
            })
          })

   
        })
        }else if(obj.isLeaf === '0') {
          const params = {
        parentId: obj.id,
        catalogId: 0 ,
      };
      this.$executeRequest
        .execByControllerMappingName("/N/N1001/queryByParentId", params)
        .then((res)=>{
          if (res.code != 999) {
            return;
          }
          obj.children = [];
          for (var index in res.data) {
              if(res.data[index].isLeaf === '0' ){
                  res.data[index].name = res.data[index].label
            res.data[index].code = res.data[index].code
            res.data[index].id = res.data[index].id
            res.data[index].children = []
           obj.children.push(res.data[index]);
      }
          
          }
          obj.children.forEach((item)=>{
            this.valueMultiple.forEach((i)=>{
                if(item.id === i){
                    let num = 0;
                this.valueName.forEach(a => {
                        a == item[this.props.label] ? num++ : num;
                    })
                    if (num == 0) {
                        this.valueName.push(item[this.props.label]); // 输入框显示值
                        this.resultValue.push(item);
                    }
                    this.$nextTick(()=>{
                        this.$refs.selectTree1.setChecked(item.id,true);
                    })

                }
            })
          })

        })
        }
        },
        // 从输入框中直接删除某个值时
        changeValue(val) {
            
            if (this.multiple) {
                // 多选（同时删掉传给父组件中多余的值，再传给父组件）
                this.resultValue.map((item, index) => {
                    let i = val.indexOf(item.name)
                    if (i == -1) {
                        this.resultValue.splice(index, 1)
                    }
                })
                console.log(this.$refs);
                let arr = []
                this.resultValue.forEach((item)=>{
                    arr.push(item.id)
                })
                this.$refs.selectTree1.setCheckedKeys(arr);
                this.$emit('getValue', this.resultValue);
            } else {
                // 单选
                this.$emit('getValue', val);
            }
        },
        // 清除选中
        clearHandle() {
            this.valueName = this.multiple ? [] : ''
            this.resultValue = []
            this.clearSelected()
            this.$emit('getValue', this.resultValue)
        },
        // 清空选中样式
        clearSelected() {
            let allNode = document.querySelectorAll('#tree-option .el-tree-node')
            allNode.forEach((element) => element.classList.remove('is-current'))
        }
    }
  }
  </script>
  <style scoped>
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    max-height: 300px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  
  .el-select-dropdown__item.selected {
    font-weight: normal;
  }
  
  ul li>>>.el-tree .el-tree-node__content {
    height: auto;
    padding: 0 20px;
  }
  
  .el-tree-node__label {
    font-weight: normal;
  }
  
  .el-tree>>>.is-current .el-tree-node__label {
    color: #409EFF;
    font-weight: 700;
  }
  
  .el-tree>>>.is-current .el-tree-node__children .el-tree-node__label {
    color: #606266;
    font-weight: normal;
  }
  
  .el-popper {
    z-index: 9999;
  }
  
  .ification_col {
    width: 20px;
    height: 10px;
    display: inline-block;
  }
  </style>