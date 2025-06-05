<template>
	<div class="collapse-input-style">
		<el-form label-width="100px" label-position="left">
			<template v-for="(item, index) in options">
				<div v-if="isShowForm(item, '[object Object]')" :key="index">
					<dynamic-add-table v-if="item.type === 'dynamic-add-table'" v-model="formData[item.name]" :chart-type="item.chartType" @change="changed($event, item.name)" />
					<el-form-item v-else :label="item.label" :prop="item.name" :required="item.required">
						<el-input-number
							v-if="item.type == 'el-input-number'"
							size="mini"
							style="width: 100%"
							v-model.trim="formData[item.name]"
							:disabled="item.disabled"
							controls-position="right"
							@change="changed($event, item.name)"
						/>

						<el-input
							v-if="item.type == 'el-input-text'"
							v-model.trim="formData[item.name]"
							:disabled="item.disabled"
							type="text"
							size="mini"
							placeholder="请输入内容"
							clearable
							@change="changed($event, item.name)"
						/>

						<el-input
							v-if="item.type == 'el-input-textarea'"
							v-model.trim="formData[item.name]"
							type="textarea"
							size="mini"
							rows="2"
							:disabled="item.disabled"
							placeholder="请输入内容"
							@change="changed($event, item.name)"
						/>

						<el-switch v-if="item.type == 'el-switch'" v-model="formData[item.name]" size="mini" placeholder="请输入内容" :disabled="item.disabled" @change="changed($event, item.name)" />
						<ColorPicker v-if="item.type == 'vue-color'" v-model="formData[item.name]" @change="val => changed(val, item.name)" />
						<customUpload v-if="item.type == 'custom-upload'" v-model="formData[item.name]" @change="changed($event, item.name)" />

						<el-radio-group v-if="item.type == 'el-radio-group'" v-model="formData[item.name]" @change="val => changed(val, item.name)">
							<el-radio v-for="itemChild in item.selectOptions" :key="itemChild.code" :label="itemChild.code">{{ itemChild.name }}</el-radio>
						</el-radio-group>
						<el-select
							v-if="item.type == 'el-select'"
							size="mini"
							:disabled="item.disabled"
							v-model="formData[item.name]"
							:multiple="item.multiple"
							clearable
							placeholder="请选择"
							@change="val => changed(val, item.name)"
						>
							<el-option v-for="itemChild in item.selectOptions" :key="itemChild.code" :label="itemChild.name" :value="itemChild.code" />
						</el-select>
						<el-slider v-if="item.type == 'el-slider'" v-model="formData[item.name]" @change="val => changed(val, item.name)" />
					</el-form-item>
				</div>
				<div v-else-if="isShowForm(item, '[object Array]')" :key="'a-' + index">
					<el-collapse accordion>
						<el-collapse-item v-for="(itemChild, indexChild) in item" :key="indexChild" :title="itemChild.name" :name="indexChild">
							<template v-for="(itemChildList, idx) in itemChild.list">
								<el-form-item :key="idx" :label="itemChildList.label" :prop="itemChildList.name" :required="itemChildList.required">
									<el-input-number
										v-if="itemChildList.type == 'el-input-number'"
										size="mini"
										style="width: 100%"
										v-model="formData[itemChildList.name]"
										:disabled="item.disabled"
										controls-position="right"
										:placeholder="itemChildList.placeholder"
										@change="changed($event, itemChildList.name)"
									/>

									<el-input
										v-if="itemChildList.type == 'el-input-text'"
										v-model.trim="formData[itemChildList.name]"
										:disabled="item.disabled"
										type="text"
										size="mini"
										placeholder="请输入内容"
										clearable
										@change="changed($event, itemChildList.name)"
									/>

									<el-input
										v-if="itemChildList.type == 'el-input-textarea'"
										v-model.trim="formData[itemChildList.name]"
										:disabled="item.disabled"
										size="mini"
										type="textarea"
										rows="2"
										placeholder="请输入内容"
										@change="changed($event, itemChildList.name)"
									/>

									<el-switch
										v-if="itemChildList.type == 'el-switch'"
										v-model="formData[itemChildList.name]"
										:disabled="item.disabled"
										placeholder="请输入内容"
										size="mini"
										@change="changed($event, itemChildList.name)"
									/>

									<ColorPicker v-if="itemChildList.type == 'vue-color'" v-model="formData[itemChildList.name]" @change="val => changed(val, itemChildList.name)" />
									<el-radio-group v-if="itemChildList.type == 'el-radio-group'" v-model="formData[itemChildList.name]" @change="val => changed(val, itemChildList.name)">
										<el-radio v-for="it in itemChildList.selectOptions" :key="it.code" :label="it.code">{{ it.name }}</el-radio>
									</el-radio-group>
									<el-select
										v-if="itemChildList.type == 'el-select'"
										size="mini"
										v-model="formData[itemChildList.name]"
										clearable
										placeholder="请选择"
										@change="val => changed(val, itemChildList.name)"
									>
										<el-option v-for="it in itemChildList.selectOptions" :key="it.code" :label="it.name" :value="it.code" />
									</el-select>

									<el-slider
										v-if="itemChildList.type == 'el-slider'"
										v-model="formData[itemChildList.name]"
										@change="val => changed(val, itemChildList.name)"
										:min="itemChildList.min || 0"
										:max="itemChildList.max || 100"
									/>
								</el-form-item>
								<customColorComponents v-if="itemChildList.type == 'customColor'" :key="'b-' + idx" v-model="formData[itemChildList.name]" @change="changed($event, itemChildList.name)" />
							</template>
						</el-collapse-item>
					</el-collapse>
				</div>
			</template>
		</el-form>
	</div>
</template>

<script>
import ColorPicker from './colorPicker.vue'
import customColorComponents from './customColorComponents'
import dynamicAddTable from './dynamicAddTable.vue'
export default {
	name: 'DynamicForm',
	components: {
		ColorPicker,
		customColorComponents,
		dynamicAddTable,
	},
	props: {
		options: Array,
		value: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			formData: {},
		}
	},
	watch: {
		value: {
			handler(newValue) {
				this.formData = newValue || {}
			},
			deep: true,
			immediate: true,
		},
	},
	methods: {
		// 无论哪个输入框改变 都需要触发事件 将值回传
		changed(val, key) {
			// console.log(val);
			// console.log(key);
			if (val.extend) {
				this.$set(this.formData, key, val.value)
			} else {
				this.$set(this.formData, key, val)
			}
			this.$emit('onChanged', this.formData)
		},
		// 是否显示 那种格式
		isShowForm(val, type) {
			return Object.prototype.toString.call(val) == type
		},
	},
}
</script>

<style scoped lang="less">
/deep/ .el-form-item {
	margin-bottom: 5px;
}
/deep/ .el-form-item__label {
	font-size: 12px;
	color: #fff;
}
.code-mirror {
	width: 100%;
	height: 100% !important;
}
.el-collapse {
	border-top: none;
	border-bottom: none;
}
/deep/.el-collapse-item__header {
	height: 40px;
	line-height: 40px;
	background: transparent;
	color: #bcc9d4;
	font-weight: 300;
	font-size: 12px;
	border-color: #282e3a;
}
/deep/.el-collapse-item__wrap {
	background: transparent;
	border: none;
}
/deep/.el-collapse-item__content {
	padding-bottom: 0;
}
.collapse-input-style {
	/deep/.el-input__inner,
	/deep/.el-textarea__inner {
		background: #263445 !important;
		border: 1px solid #3f5673;
		color: #a8e3ff;
	}
	/deep/ .el-slider__runway {
		height: 2px;
		background-color: #5e6b82;
		width: 95%;
	}
	/deep/ .el-slider__bar {
		height: 2px;
	}
	/deep/ .el-slider__button-wrapper {
		top: -17px;
	}
	/deep/ .el-slider__button {
		width: 14px;
		height: 14px;
	}
	/deep/ .el-switch__core {
		background-color: #5e6b82;
		border: 1px solid #3f5673;
	}
	/deep/ .el-switch.is-checked .el-switch__core {
		background-color: #409eff;
		border-color: #409eff;
	}
	/deep/ .el-input-group__append,
	/deep/ .el-input-group__prepend {
		background: #5e6b82 !important;
		border: 1px solid #3f5673;
		color: #a8e3ff;
	}
	/deep/ .el-input-number__increase,
	/deep/ .el-input-number__decrease {
		background: #5e6b82 !important;
		border: 1px solid #3f5673;
		color: #a8e3ff;
	}
	/deep/ .el-input-number.is-controls-right .el-input-number__increase {
		height: 15px;
		border-bottom: 1px solid #3f5673;
	}
	/deep/ .el-input-number.is-controls-right .el-input-number__decrease {
		border-left: 1px solid #3f5673;
	}
	/deep/ .el-form-item__label {
		font-size: 12px;
		color: #bfcbd9 !important;
		font-weight: normal !important;
	}
}
</style>
