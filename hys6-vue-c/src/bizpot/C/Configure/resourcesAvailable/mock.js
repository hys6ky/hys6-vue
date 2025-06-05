
export const columArr = [
    { prop: "tag", type: "radio", width: "70", align: "center" },
    { prop: "resource_type", type: "text",minWidth:'180',  label: "资源类型" },
    { prop: "resource_max", type: "text",minWidth:'120',  label: "资源阀值" },
    { prop: "resource_used_string", type: "text",minWidth:'120',  label: "已使用数" },
    { prop: "resource_name", type: "text",minWidth:'120',  label: "资源类型名称" },
    {
        type: "operateInput",
        label: "操作",
        placeholder: '资源类型',
        queryData: '',
        width: "300px",
        operateArr: [
            { label: "编辑", type: "edit" },
            { label: "删除", type: "del",hide:(row)=>{
                    if (row.resource_type == 'Thrift' || row.resource_type == 'Yarn' || row.resource_type == 'normalDefType' ){
                        return false;
                    }else {
                        return true;
                    } } },
        ],
    },
]


export const issueFromConfig ={
    labelWidth: "140px",
    inline: false,
    ref: "tableFrom",
}

export const fromItem =[
    {
        prop: 'etl_sys_cd',
        label: '工程编号',
        placeholder: '工程编号',
        type: 'input',
        disabled: true,
        span: 18
    },
    {
        prop: 'resource_type',
        label: '资源类型',
        placeholder: '资源类型',
        type: 'input',
        disabled: false,
        span: 18
    },
    {
        prop: 'resource_max',
        label: '资源阀值',
        placeholder: '资源阀值',
        type: 'input',
        disabled: false,
        span: 18
    },
    {
        prop: 'resource_name',
        label: '资源类型名称',
        placeholder: '资源类型名称',
        type: 'input',
        disabled: false,
        span: 18
    },
]
