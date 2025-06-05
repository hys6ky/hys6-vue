export const treeData = []
export const formItems = [
	{
		label: '元数据',
		prop: 'source_id',
		type: 'select',
		placeholder: '请选择元数据',
		options: [
			{
				label: '卫生健康平台治理库元数据',
				value: '0',
			},
		],
	},
	{
		label: '类型',
		prop: 'type',
		type: 'select',
		placeholder: '请选择类型',
		multiple: true,
		options: [
			{
				label: '表',
				value: '1',
			},
			{
				label: '视图',
				value: '2',
			},
		],
	},
]
export const columnArr = [
	{ label: '选择', prop: 'check', type: 'selection', width: '70px' },
	{ label: '序号', prop: 'index', type: 'index', width: '70px' },
	{ label: '资产中文名', prop: 'asset_cname', type: 'text' },
	{ label: '资产英文名', prop: 'asset_ename', type: 'text' },
	{ label: '资产代码', prop: 'asset_code', type: 'text' },
	{ label: '资产类型', prop: 'asset_type', type: 'text1', fixed: 'right' },
]
export const tableData = []
export const searchFormItems = [
  {
    label: '资产代号',
    prop: 'assetCode',
    type: 'input',
    placeholder: '请输入资产代号',
  },
  {
    label: '资产标题',
    prop: 'assetTitle',
    type: 'input',
    placeholder: '请输入资产标题',
  }
]
export const extraButton = [

  // {
  //   label: "导入",
  //   prop: "import",
  // },
 
]