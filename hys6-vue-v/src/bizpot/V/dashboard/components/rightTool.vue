<template>
	<div class="rightTool" :style="{ width: widthLeftForOptions + 'px' }">
		<el-tabs v-model="tabActive" type="border-card" :stretch="true">
			<el-tab-pane name="first" label="配置">
				<dynamicForm ref="formData" :options="widgetOptions.setup" :value="value" @onChanged="val => widgetValueChanged('setup', val)" />
			</el-tab-pane>
			<el-tab-pane name="second" label="坐标" v-if="screenCode !== 'screen'">
				<dynamicForm ref="formData" :options="widgetOptions.position" :value="layerPosition" @onChanged="val => widgetValueChanged('position', val)" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import dynamicForm from './dynamicForm'
export default {
	name: 'RightTool',
	props: {
		widthLeftForOptions: {
			type: Number,
			default: 300,
		},
		activeName: {
			type: String,
			default: 'first',
		},
		widgetOptions: {
			type: Object,
			default: () => {
				setup: [] // 配置
				data: [] // 数据
				position: [] // 坐标
			},
		},
		screenCode: {
			type: String,
			default: '',
		},
		dashboard: {
			type: Object,
			default: {},
		},
		layerValue: {
			type: Object,
			default: {},
		},
		layerPosition: {
			type: Object,
			default: {},
		},
	},
	components: {
		dynamicForm,
	},
	computed: {
		value() {
			if (this.screenCode === 'screen') {
				return this.dashboard
			} else {
				return this.layerValue
			}
		},
		tabActive: {
			get() {
				return this.activeName
			},
			set(val) {
				this.$emit('changeTab', val)
			},
		},
	},
	methods: {
		widgetValueChanged(type, val) {
			if (this.screenCode == 'screen') {
				this.$emit('changeDashboard', val)
			}
		},
	},
}
</script>

<style lang="less" scoped>
.rightTool {
	width: 300px;
}
</style>
