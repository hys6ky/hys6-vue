<template>
    <div class="root">
        <el-select v-model="selectShowLabel"  @change="changeHandle" :clearable="clearable"   @focus="focus" :placeholder="placeholder" :collapse-tags="collapseTags">
            <el-option :value="select"  disabled :style="'margin:5px'">
                <el-input size="small" prefix-icon="el-icon-search" clearable placeholder="输入关键字进行查找" v-model="filterText"> </el-input>
            </el-option>
            <el-tree  :data-a="responsive" check-strictly ref="tree" @check-change="checkChange" :data="treeData" show-checkbox :node-key="'value'" :props="defaultProps" :default-expand-all="expandAll" :filter-node-method="filterNode">
            </el-tree>
        </el-select>
    </div>
</template>
<script>
export default {
    name: 'selectTree',
    model: {
        prop: 'checkedArray', // 把父组件传过来的值重命名为checkedArray
        event: 'changeChecked' // 把父组件传过来的方法重命名为changeChecked 其实就是 input
    },
    props: {
        // 选中节点的值
        checkedArray: {
            type: Number,
            default: 0
        },
     
        // 树数据
        treeData: {
            type: Array,
            required: true
        },
        // 设置指定的label,value,children 
        nodeConfig: {
            type: Object,
            default: () => {
                return {
                    label: 'label',
                    value: 'value',
                    children: 'children'
                }
            }
        },
        // 是否展开所有节点
        expandAll: {
            type: Boolean,
            default: false
        },
        // 下拉框tag是否折叠
        collapseTags: {
            type: Boolean,
            default: true
        },
        // 开启下拉框一键清空
        clearable: {
            type: Boolean,
            default: true
        },
        placeholder: {
            type: String,
            default: '请选择'
        }
    },
    data() {
        return {
            select: '',
            // 用于下拉列表展示
            selectShowLabel: "",
            // 筛选输入框绑定值
            filterText: '',
            responsive: ''
        }
    },
    methods: {
        // 聚焦时
        focus(){
        this.$refs.tree.setChecked(this.responsive,true,false)
        },
        // 树节点过滤方法
        filterNode(value, data) {
            if (!value) return true;
            return data[this.defaultProps.label].indexOf(value) !== -1;
        },
        // 获取选中节点
        getCheckedNodes() {
            return this.$refs.tree.getCheckedNodes()
        },
        // 设置选中节点
        async setCheckedNodes(selectedArray) {
       
        },
        // 节点选中状态更改
        checkChange(node ,checked) {
            this.$emit('checkChange',node ,checked)  
     
        },
        // 提供表单校验
        dispatch(componentName, eventName, params) {
         
        },
        // 失去焦点后校验
        handleBlur(val) {
     
        },
        // 选择值发生改变后校验
        changeHandle() {
        },
    },
    mounted() {
        if(this.checkedArray !== null && this.treeData.length !== 0){
            this.$nextTick(()=>{
                this.selectShowLabel = this.$refs.tree.getNode(this.responsive).data.user_name
                    })
        }  
    },
    watch: {
        // 设置回显
        checkedArray: {
            handler(val) {
                    // this.setCheckedNodes();
                    if(val){
                        this.responsive = val
                        setTimeout(()=>{
                            // this.selectShowLabel = this.$refs.tree.getNode(this.responsive).data.user_name
                        },500)
                    }

            },
            // 监听第一次数据更改
            immediate: true
        },
        treeData: {
            handler(val) {
                    // this.setCheckedNodes();
                    if(this.checkedArray !== null){
                        this.$nextTick(()=>{
                            this.selectShowLabel = this.$refs.tree.getNode(this.responsive).data.user_name
                    })
                    }
                   
            },
            // 监听第一次数据更改
            deep: true,
        },
        // 筛选符合条件选项
        filterText(val) {
            this.$refs.tree.filter(val);
        },
    },
    computed: {
        defaultProps() {
            return Object.assign({
                label: 'label',
                value: 'value',
                children: 'children'
            }, this.nodeConfig)
        }
    },
}
</script> 
