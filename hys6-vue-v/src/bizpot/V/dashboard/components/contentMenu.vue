<template>
	<div v-show="visible" class="contentmenu" :style="styleObj">
		<div class="contentmenu__item" @click="deleteLayer"><i class="iconfont iconguanbi"></i> 删除图层</div>
		<!-- <div class="contentmenu__item" @click="copyLayer"><i class="iconfont iconfuzhi1"></i> 复制图层</div>
		<div class="contentmenu__item" @click="istopLayer"><i class="iconfont iconjinlingyingcaiwangtubiao01"></i> 置顶图层</div>
		<div class="contentmenu__item" @click="setlowLayer"><i class="iconfont iconleft-copy"></i> 置底图层</div>
		<div class="contentmenu__item" @click="moveupLayer"><i class="iconfont iconjinlingyingcaiwangtubiao01"></i> 上移一层</div>
		<div class="contentmenu__item" @click="movedownLayer"><i class="iconfont iconleft-copy"></i> 下移一层</div> -->
	</div>
</template>
<script>
export default {
	props: {
		styleObj: Object,
		visible: Boolean,
		widgets: Array,
		rightClickIndex: Number,
	},
	data() {
		return {}
	},
	watch: {
		visible(value) {
			if (value) {
				document.body.addEventListener('click', this.closeMenu)
			} else {
				document.body.removeEventListener('click', this.closeMenu)
			}
		},
	},
	methods: {
		closeMenu() {
			this.$emit('update:visible', false)
		},
		deleteLayer() {
			this.$confirm('是否删除所选图层?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					// console.log(this.rightClickIndex)
					this.widgets.splice(this.rightClickIndex, 1)
					this.$message({
						type: 'success',
						message: '删除成功!',
					})
					this.$emit('clickScreen')
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					})
				})
		},
		copyLayer() {
			const obj = this.deepClone(this.widgets[this.rightClickIndex])
			this.widgets.splice(this.widgets.length, 0, obj)
		},
		istopLayer() {
			if (this.rightClickIndex + 1 < this.widgets.length) {
				const temp = this.widgets.splice(this.rightClickIndex, 1)[0]
				this.widgets.push(temp)
			}
		},
		setlowLayer() {
			if (this.rightClickIndex != 0) {
				this.widgets.unshift(this.widgets.splice(this.rightClickIndex, 1)[0])
			}
		},
		moveupLayer() {
			if (this.rightClickIndex != 0) {
				this.widgets[this.rightClickIndex] = this.widgets.splice(this.rightClickIndex - 1, 1, this.widgets[this.rightClickIndex])[0]
			} else {
				this.widgets.push(this.widgets.shift())
			}
		},
		movedownLayer() {
			if (this.rightClickIndex != this.widgets.length - 1) {
				this.widgets[this.rightClickIndex] = this.widgets.splice(this.rightClickIndex + 1, 1, this.widgets[this.rightClickIndex])[0]
			} else {
				this.widgets.unshift(this.widgets.splice(this.rightClickIndex, 1)[0])
			}
		},
	},
}
</script>
<style lang="less" scoped>
.contentmenu {
	width: 160px;
	position: fixed;
	z-index: 99999;
	list-style: none;
	-webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	padding: 0;
	background: #27343e;
	color: #bcc9d4;
	.contentmenu__item {
		z-index: 10000;
		list-style: none;
		padding: 8px 12px;
		cursor: pointer;
		position: relative;
		font-size: 12px;
	}
	.iconfont {
		font-size: 12px;
	}
}
</style>
