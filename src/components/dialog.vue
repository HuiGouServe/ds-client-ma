<!-- 新建/编辑/查看弹窗  -->
<template>
  <el-dialog v-model="dialogVisible" :title="title" :width="width" center :show-close="showClose||true" :top="top"
    @close="close">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :label-width="labelWidth" status-icon>
      <template v-for="item in formList" :key="item.index">
        <!-- 输入框 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='input'">
          <el-input v-model="ruleForm[item.name]" :maxlength="item.maxlength" :style="{width:item.width}"
            :placeholder="item.placeholder" :clearable="item.clearable" />
        </el-form-item>
        <!-- 输入框 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='password'">
          <el-input type="password" v-model="ruleForm[item.name]" :maxlength="item.maxlength"
            :style="{width:item.width}" :placeholder="item.placeholder" :clearable="item.clearable" />
        </el-form-item>
        <!-- 文本框 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='textarea'">
          <el-input type="textarea" v-model="ruleForm[item.name]" :maxlength="item.maxlength"
            :style="{width:item.width}" :placeholder="item.placeholder" :clearable="item.clearable" :rows="item.rows" />
        </el-form-item>
        <!-- 计数器 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='number'">
          <el-input-number v-model="ruleForm[item.name]" :disabled="item.disabled" :min="item.min" :max="item.max"
            :precision="item.precision" :step="item.step" :size="item.size" />
        </el-form-item>
        <!-- 选择框 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='select'">
          <el-select v-model="ruleForm[item.name]" :placeholder="item.placeholder" :clearable="item.clearable"
            :style="{width:item.width}">
            <el-option :label="i.label" :value="i.value" v-for="i in item.selectList" :key="i.index" />
          </el-select>
        </el-form-item>
        <!-- 时间选择器 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='date'">
          <el-date-picker v-model="ruleForm[item.name]" :type="item.dateType" :placeholder="item.placeholder"
            :default-value="item.defaultValue" :editable="item.editable" :format="item.format"
            :value-format="item.valueFormat" :end-placeholder="item.endplaceholder" :style="{width:item.width}"
            :start-placeholder="item.startPlaceholder" :clearable="item.clearable" :disabled-date="item.disabledDate" />
        </el-form-item>
        <!-- 切换器 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='switch'">
          <el-switch v-model="ruleForm[item.name]" :size="item.size" :active-text="item.activeText"
            :inactive-text="item.inactiveText" :style="{width:item.width}" />
        </el-form-item>
        <!-- 多选 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='checkbox'">
          <el-checkbox-group v-model="ruleForm[item.name]" :style="{width:item.width}">
            <el-checkbox :label="i.label" :name="i.value" v-for="i in item.checkboxList" :key="i.index" />
          </el-checkbox-group>
        </el-form-item>
        <!-- 单选 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='radio'">
          <el-radio-group v-model="ruleForm[item.name]" :style="{width:item.width}">
            <el-radio :label="i.label" v-for="i in item.radioList" :key="i.index">{{i.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 级联 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='cascader'">
          <el-cascader v-model="ruleForm[item.name]" :style="{width:item.width}" :options="item.options"
            :props="{ expandTrigger: 'hover' }" :placeholder="item.placeholder" :clearable="item.clearable"
            :size="item.size" />
        </el-form-item>
        <!-- 上传 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='upload'">
          <el-upload class="upload-demo" ref="upload" action="#" :file-list="item.fileList" :list-type="item.listType"
            :show-file-list="item.showFileList" :auto-upload="false">
            <el-button size="small" type="primary">选取文件</el-button>
            <div>{{item.message}}</div>
          </el-upload>
        </el-form-item>
        <!-- 穿梭框 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='transfer'">
          <el-transfer filterable :titles="item.titles" v-model="ruleForm[item.name]" :data="item.data" />
        </el-form-item>
        <!-- 富文本 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='editor'">
          <TEditor ref="editor" v-model="ruleForm[item.name]" @getContent="getContent" />
        </el-form-item>
        <!-- 信息确认 -->
        <el-form-item :label="item.label" :prop="item.name" v-if="item.type=='messageBox'">
          <el-checkbox v-model="ruleForm[item.name]">{{item.message}}</el-checkbox>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>

    </el-form>

  </el-dialog>
</template>

<script lang='ts'>
import { defineComponent, computed, } from 'vue'
import Editor from "./tinymac.vue";

interface iData {
  $refs: any
}
export default defineComponent({
  components: { Editor },
  emits: ["resetForm", "submitForm", "close", 'getContent'],
  props: {
    formList: {
      type: Array as any,
      required: true,
      default: function () {
        return []
      }
    },
    rules: {
      type: Object as any,
      required: true,
      default: function () {
        return {}
      }
    },
    ruleForm: {
      type: Object as any,
      required: true,
      default: function () {
        return {}
      }
    },
    title: {
      type: String,
      required: true,
      default: function () {
        return ''
      }
    },
    width: {
      type: String,
      default: function () {
        return '800px'
      }
    },
    showClose: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    top: {
      type: String,
      default: function () {
        return "15vh"
      }
    },
    labelWidth: {
      type: String,
      default: function () {
        return "120px"
      }
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: function () {
        return false
      }
    }
  },
  setup(props: any) {
    const dialogVisible = computed(() => {  //计算属性
      return props.dialogVisible
    })
    return {
      dialogVisible
    }
  },
  data(): iData {
    return {
      $refs: ''
    }
  },

  methods: {
    close() {
      this.$emit("close")
      if (!this.$refs.ruleFormRef) return
      this.$refs.ruleFormRef.resetFields()
    },

    getContent(e: any) {
      this.$emit('getContent', e)
    },

    submitForm() {
      if (!this.$refs.ruleFormRef) return
      this.$refs.ruleFormRef.validate((valid: any) => {
        if (valid) {
          this.$emit("submitForm")
        }
      })
    },

    resetForm() {
      this.$emit("resetForm")
      if (!this.$refs.ruleFormRef) return
      this.$refs.ruleFormRef.resetFields()
    }
  }
})

</script>
<style lang='scss' scoped>
</style>