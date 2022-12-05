<!-- 权限管理 -->
<template>
  <div class='index'>
    <tableList :table-data="tableData" :column-data="columnData" :searchList="searchList" :serchForm="serchForm"
      :crudList="crudList" @crudClick="crudClick" @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange" @search="search" @reset="reset" @selectionChange="selectionChange"
      :cellObj="cellObj" />

    <dialogList :formList="formList" :dialogVisible="dialogVisible" :ruleForm="ruleForm" :title="title" :rules="rules"
      @close="close" :showClose="showClose" @resetForm="resetForm" />

  </div>
</template>

<script lang='ts'>
import tableList from '@/components/table.vue'
import dialogList from '@/components/dialog.vue'
import { tableMixin } from '@/mixins/index'
import { defineComponent, ref, reactive } from 'vue'


export default defineComponent({
  components: { tableList, dialogList },
  mixins: [tableMixin],
  setup() {
    return {
      tableData: reactive([{
        name: '111', test: "shen", age: 333
      },
      {
        name: '222', test: "shen", age: 333
      },
      {
        name: '333', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      },
      {
        name: '444', test: "shen", age: 333
      }
      ]),
      columnData: reactive([
        { type: 'selection' },
        { type: 'index' },
        { type: 'text', label: "测试1", property: 'test', align: 'center' },
        { type: 'text', label: "测试2", property: 'name' },
        { type: 'text', label: "测试3", property: 'age' },
        { type: 'img', label: '图片', property: 'img' },
        { type: 'operation', operationList: [{ name: '查看', type: 'primary' }, { name: '删除', type: 'danger' }] }
      ]),
      searchList: reactive([
        { name: '名称：', key: "name", type: 'input', placeholder: '请输入' },
        {
          name: '年龄：', key: "age", type: "select", selectList: [
            { value: '10', label: 10 }, { value: '11', label: 12 }, { value: '11', label: 11 },
          ], placeholder: '请选择'
        }, { name: '性别：', key: "sex", type: 'input', placeholder: '请输入' },

      ]),
      crudList: reactive([{ name: '新增', type: 'primary' }, { name: '批量删除', type: 'danger' }, { name: '导入', type: 'success' },
      { name: '批量导出', type: 'success' }]),
      serchForm: reactive({
        name: '', age: '', sex: ''
      })
    };
  },
  data() {
    return {
      dialogVisible: false,
      showClose: true,
      title: "",
      cellObj: {
        index: 2,
        obj: {
          color: "#ff0000"
        }
      },
      rules: {
        input: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
      },
      formList: [{ type: 'input', name: 'input', label: '输入框', width: '300px' },
      { type: 'textarea', name: 'textarea', label: '文本框', width: '500px', maxHeight: 1000, rows: 3, },
      { type: 'number', name: 'number', label: '计数器', width: '500px', },
      { type: 'select', name: 'select', label: '选择器', width: '500px', selectList: [{ value: 1, label: "三国演义" }, { value: 2, label: "三国演义" }] },
      { type: 'date', name: 'date', label: '时间', width: '500px', },
      { type: 'switch', name: 'switch', label: '切换', width: '500px', },
      { type: 'checkbox', name: 'checkbox', label: '多选', checkboxList: [{ value: 1, label: "三国演义" }, { value: 2, label: "三国演义" }] },
      { type: 'radio', name: 'radio', label: '单选', width: '500px', radioList: [{ label: "是" }, { label: "否" }] },
      { type: 'cascader', name: 'cascader', label: '级联选择', width: '500px', options: [] },
      { type: 'upload', name: 'upload', label: '上传', width: '500px', fileList: [] },
      { type: 'messageBox', name: 'messageBox', width: '500px', message: '确认勾选' },


      ],
      ruleForm: {
        input: '',
        textarea: '',
        number: '',
        select: '',
        date: '',
        switch: '',
        checkbox: '',
        radio: '',
        cascader: '',
        upload: '',
        messageBox: '',
      }
    };
  },



  methods: {

    crudClick(name: string) {
      this.title = name
      if (name == '新增') {
        this.dialogVisible = true
      }
    },
    close() {
      this.dialogVisible = false
    },
    resetForm() {
      this.dialogVisible = false
    },
    search(e: any) {
      console.log(e);

      this.getList()
    },
    reset() {
      this.getList()
    },
    handleSizeChange(e: any) {
      console.log(e);

    },
    handleCurrentChange(e: any) {
      console.log(e);
    },
    getList() {

    },
    selectionChange(e: any) {
      console.log(e);
    },


  }
})

</script>
<style lang='scss' scoped>
.index {
  width: 100%;
  height: 100%;
}
</style>