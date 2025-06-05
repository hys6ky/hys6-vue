<template>
  <div class=" px-20 flex-1">
    <ByQuickSearch :formItems="formItems" @search="search" @reset="reset" />
    <ByTable :tableData="tableData" :columnArr="columnArr" :pagination="pagination" @operateItem="operate"></ByTable>
  </div>
</template>

<script>
export default {
    data(){
        return{
            formItems:[
                {
					prop: 'item1',
					label: '检核用户',
					type: 'input',
				},
                {
					prop: 'item2',
					label: '检核任务id',
					type: 'input',
				},
                {
					prop: 'item3',
					label: '检核系统名称',
					type: 'input',
				},
            ],
            columnArr:[
                { prop: 'name1',type:"text", label: '核检任务',width: '130px' },
                { prop: 'name2',type:"text", label: '核检用户',width: '130px' },
                { prop: 'name3',type:"text", label: '系统名称',width: '130px' },
                { prop: 'name4',type:"text", label: '核检类型',width: '130px' },
                { prop: 'name5',type:"text", label: '核检报告描述',width: '130px' },
                { prop: 'name6',type:"text", label: '核检字段数',width: '130px' },
                { prop: 'name7',type:"text", label: '状态',width: '130px' },
                { prop: 'name8',type:"text", label: '开始时间',width: '130px' },
                { prop: 'name9',type:"text", label: '结束时间',width: '130px' },
                {type:"operate", label: '操作',operateArr:[
                    {label:'详情',type:'detail'},
                ] }
            ],
            tableData:[
                {
                  name1:'32783257927589',
                  name2:'测试',
                  name3:'2023-3-01',
                  name4:'某某',
                  name5:'数据管理部',
                  name6:'预研通过',
                  name7:'已关联',
                  name8:'数据管理部',
                  name9:'测试'
                },
                {
                  name1:'32783257927589',
                  name2:'测试',
                  name3:'2023-3-01',
                  name4:'某某',
                  name5:'数据管理部',
                  name6:'预研通过',
                  name7:'已关联',
                  name8:'数据管理部',
                  name9:'测试'
                },
                {
                  name1:'32783257927589',
                  name2:'测试',
                  name3:'2023-3-01',
                  name4:'某某',
                  name5:'数据管理部',
                  name6:'预研通过',
                  name7:'已关联',
                  name8:'数据管理部',
                  name9:'测试'
                },
                {
                  name1:'32783257927589',
                  name2:'测试',
                  name3:'2023-3-01',
                  name4:'某某',
                  name5:'数据管理部',
                  name6:'预研通过',
                  name7:'已关联',
                  name8:'数据管理部',
                  name9:'测试'
                },
            ],
            pagination: {
      		  total: 200,
      		  pageNum: 1,
      		  pageSize: 10,
      		  pageSizes: [10, 20, 50, 100],
      		},
        }
    },
    methods:{
        search(val){
          console.log(val)
        },
        reset(val){
          console.log(val)
        },
        operate(){
            this.$router.push('/dataBase/standard/details')
        }
    }
}
</script>

<style>

</style>