<template>
	<div class="panelBaseInfo">
		<el-collapse v-model="expand">
			<el-collapse-item v-for="item in baseInfoContentList" :key="item.name" :name="item.name">
				<template slot="title">
					<ByHeaderSlice :title="item.title" />
				</template>
				<el-descriptions :column="3" v-for="(value, key) in item.content"
					:style="{ borderBottom: !isLast(key, item.content) ? '1px solid #EBEEF5' : '', paddingTop: isLast(key, item.content) && key !== '0' ? '16px' : '0' }">
					<el-descriptions-item v-for="content in value" :key="content.prop" :label="content.label" :span="content.span || '1'">
						<div v-if="content.prop === 'asset_version'">
							<el-tag size="small" type="primart">{{ contentData[content.prop] }}</el-tag>
						</div>
						<div v-else-if="content.prop === 'col_type'" class="d-flex">
							<span>{{ contentData[content.prop] || '--' }}</span>
							<el-button type="text" @click="ckmz">查看码值</el-button>
						</div>
						<!-- <div v-else-if="content.prop === 'col_business'" class="d-flex">
							<span>--</span>
						</div> -->
						<div v-else-if="content.prop === 'asset_type'" class="d-flex">
							<span v-if="contentData[content.prop] === '1'">表</span>
							<span v-else-if="contentData[content.prop] === '2'">视图</span>
							<span v-else-if="contentData[content.prop] === '3'">字段</span>
							<span v-else>--</span>
						</div>
					
						<div v-else-if="content.prop === 'manage_depart'" class="d-flex">
							<span v-if="contentData[content.prop]">{{ manage_depart }}</span>
						</div>
						<div v-else-if="content.prop === 'security_level'" class="d-flex">
							<span v-if="contentData[content.prop] === '1'">公开</span>
							<span v-else-if="contentData[content.prop] === '2'">敏感</span>	
							<span v-else-if="contentData[content.prop] === '3'">密码</span>	
							<span v-else-if="contentData[content.prop] === '4'">机密</span>
							<span v-else>--</span>
						</div>
						<div v-else-if="content.prop === 'process_frequen'" class="d-flex">
							<span v-if="contentData[content.prop] === '0'">日</span>
							<span v-else>--</span>
						</div>
						<div v-else-if="content.prop === 'data_source_type'" class="d-flex">
							<span v-if="contentData[content.prop] === '1'">内部</span>
							<span v-else-if="contentData[content.prop] === '2'">外部</span>
							<span v-else>--</span>
						</div>
						<div v-else>{{ contentData[content.prop] || '--' }}</div>
						
							<!-- asset_date -->

					</el-descriptions-item>
				</el-descriptions>
			</el-collapse-item>
		</el-collapse>
		<ByModel :body="false" :visible.sync="visible2" :modelTitle="'码值'" modelWidth="850px" @close="dialogCancel3"
			@closed="dialogClosed3">
			<ByTable ref="table" :tableData="table3" :columnArr="columnArr3"></ByTable>
			<template slot="modalFoot">
				<el-button type="primary" @click="confirm3" v-debounce> 关闭 </el-button>
			</template>
		</ByModel>
	</div>
</template>

<script>
import { baseInfoContentList, baseInfoContentList1, columnArr3 } from '../mock'
import { dateFormat, hourFormat } from '@/utils/dateconversion'

export default {
	name: "panelBaseInfo",
	data() {
		return {
			// expand: ["1"],
			baseInfoContentList: [],
			columnArr3,
			contentData: {},
			table3: [],
			visible2: false,
			departmentalList: [],
			manage_depart: '--'
		}
	},
	props: {
		zd: {
			type: Object,
			default: () => { },
		},
		type: {
			type: String,
			default: '',
		},
	},
	computed: {
		expand() {
			return this.baseInfoContentList.map(item => item.name)
		},
		myZd() {
			return this.zd
		},
		myType() {
			return this.type
		},

	},
	methods: {
		isLast(key, content) {
			return key === Object.keys(content)[Object.keys(content).length - 1]
		},
		ckmz() {
			this.$executeRequest
				.execPostByControllerMapping("/N/N1002/findDataAssetEnumDetail", {
					enumEname: this.zd.enum_ename,
					currPage: 1,
					pageSize: 10
				})
				.then((res) => {
					this.table3 = res.data.pageList
				})
			this.visible2 = true
		},
		confirm3() {
			this.visible2 = false
		},
		dialogCancel3() {
			this.visible2 = false;
		},
		dialogClosed3() { }
	},
	created() {
		
	},
	watch: {
		myZd: {
			handler(val) {
				let obj = JSON.parse(JSON.stringify(val))
				obj.asset_date = dateFormat(obj.asset_date)
				obj.process_rule = dateFormat(obj.process_rule)
				this.$executeRequest
			.execByUrl("/Base/departmentalList/getDepartmentInfo", {
				currPage: 1,
				pageSize: 999
			})
			.then((res) => {
				if (res.code === 999) {
					res.data.departmentInfos.forEach((item) => {
						this.departmentalList.push({
							manage_depart: item.dep_id,
							manage_name: item.dep_name
						})
					})
					this.departmentalList.forEach((item) => {
					if (item.manage_depart === obj.manage_depart) {
						this.manage_depart = item.manage_name
					}
				})
				}
			})
		if(obj.layer !== null){
			let arr = obj.layer.split(',')

			this.$executeRequest
                .execPostByControllerAllMappingName("/N/N1001/queryDirById", 
                   arr
                )
								.then((res)=>{
									let str = ''
									res.data.forEach((item)=>{
										str = str + item.dir_name + ','
									})
									str =  str.substring(0, str.length - 1)
									obj.layer = str
									console.log(obj.layer);
								})
		}

				this.contentData = obj
			},
			deep: true
		},
		contentData: {
			handler(val) {
				
			},
			deep: true,
			immediate : true
		},
		myType: {
			handler(val) {
				console.log(val);
				if (val === '表') {
					this.baseInfoContentList = baseInfoContentList1
				} else if (val === '字段') {
					this.baseInfoContentList = baseInfoContentList

				}
			},
			immediate: true
		}
	}
}
</script>

<style lang="less" scoped>
.panelBaseInfo {
	::v-deep .el-collapse-item__header {
		height: auto;
		line-height: 0;
		margin-top: 16px;
	}

	::v-deep .el-collapse-item__content {
		padding: 0 15px 4px;
		font-family: @pingfang;
		color: @label-color;
	}

	::v-deep .el-descriptions-item__label {
		width: 100px;
		justify-content: end;
	}

	::v-deep .el-descriptions-item__content {
		line-height: 24px;
	}

	::v-deep .el-button--text {
		padding: 0;
		margin-left: 10px;
	}
}
</style>