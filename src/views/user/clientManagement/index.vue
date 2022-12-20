<!-- 权限管理 -->
<template>
  <div>
    <tableList :table-data="tableData" :column-data="columnData" :searchList="searchList" :searchForm="searchForm"
      :crudList="crudList" @crudClick="crudClick" @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange" @search="search" @reset="reset" @selectionChange="selectionChange"
      :cellObj="cellObj" :page="searchForm.page" :pageSize="searchForm.pageSize" :total="total"
      @operationClick="operationClick" @selectAll="selectAll" :loading="loading" :maxHeight="maxHeight"
      @excelChange="excelChange" />

    <dialogList :formList="formList" :dialogVisible="dialogVisible" :width="dialogWidth" :ruleForm="ruleForm"
      :title="title" :rules="rules" @close="close" :showClose="showClose" @resetForm="resetForm" top="3vh"
      @submitForm="submitForm" />

  </div>
</template>

<script lang='ts'>
import tableList from '@/components/table.vue'
import dialogList from '@/components/dialog.vue'
import { tableMixin } from '@/mixins/index'
import { defineComponent } from 'vue'
import http from '@/utils/request'
import { copyObj } from '@/utils/index'

export default defineComponent({
  components: { tableList, dialogList },
  mixins: [tableMixin], //混入
  data(): any {
    return {
      dialogVisible: false,
      maxHeight: '500',
      showClose: true,
      title: "修改",
      tableData: [],
      total: 0,
      dialogWidth: "550px",
      loading: false,
      columnData: [
        { type: 'selection', width: '40px' },
        { type: 'index', width: '60px' },
        { type: 'text', label: "用户名称", property: 'userName', align: 'center', width: '90px' },
        { type: 'text', label: "用户账号", property: 'userAccount', align: 'center' },
        { type: 'text', label: "手机", property: 'phone', align: 'center', width: '115px' },
        { type: 'text', label: "邮箱", property: 'email', align: 'center', width: '100px', showOverflow: true },
        { type: 'text', label: '注册时间', property: 'registrationTime', align: 'center', dataFormat: true, width: '155px' },
        { type: 'text', label: '开店状态', property: 'shopStatus', align: 'center', width: '90px' },
        { type: 'text', label: '年龄', property: 'age', align: 'center', width: '60px' },
        { type: 'text', label: '性别', property: 'sex', align: 'center', width: '60px' },
        { type: 'text', label: '籍贯', property: 'nativePlace', align: 'center' },
        { type: 'text', label: '身份证号', property: 'identityCard', align: 'center', width: '165px' },
        { type: 'text', label: '联系地址', property: 'contactAddress', align: 'center', showOverflow: true },
        {
          type: 'operation', width: '150px', operationList: [{ name: '修改', type: 'primary', key: "isUpdate" },
          { name: '禁用', type: 'danger', key: "isDelete" }]
        }
      ],
      rules: {},
      formList: [
        { type: 'input', name: 'userName', label: '用户名称', width: '300px', maxlength: 20, clearable: true },
        { type: 'input', name: 'userAccount', label: '用户账号', width: '300px', maxlength: 20, clearable: true },
        { type: 'input', name: 'phone', label: '手机', width: '300px', maxlength: 11, clearable: true },
        { type: 'input', name: 'email', label: '邮箱', width: '300px', maxlength: 30, clearable: true },
        { type: 'input', name: 'registrationTime', label: '注册时间', width: '300px', maxlength: 20, clearable: true },
        { type: 'input', name: 'shopStatus', label: '开店状态', width: '300px', maxlength: 1, clearable: true },
        { type: 'input', name: 'age', label: '年龄', width: '300px', maxlength: 2, clearable: true },
        { type: 'input', name: 'sex', label: '性别', width: '300px', maxlength: 1, clearable: true },
        { type: 'input', name: 'nativePlace', label: '籍贯', width: '300px', maxlength: 50, clearable: true },
        { type: 'input', name: 'identityCard', label: '身份证号', width: '300px', maxlength: 18, clearable: true },
        { type: 'input', name: 'contactAddress', label: '联系地址', width: '300px', maxlength: 50, clearable: true },
      ],
      searchList: [
        { type: 'input', name: '用户名称：', key: "userName", placeholder: '请输入', maxlength: 20, width: '145' },
        { type: 'input', name: '用户账号：', key: "userAccount", placeholder: '请输入', maxlength: 20, width: '145' },
        { type: 'input', name: '手机：', key: "phone", placeholder: '请输入', maxlength: 20, width: '145' },
        { type: 'input', name: '开店状态：', key: "shopStatus", placeholder: '请输入', maxlength: 20, width: '145' },
        { type: 'date', name: '注册时间：', key: "time", dateType: "daterange", placeholder: '请选择时间', width: '210' },
      ],
      crudList: [
        { name: '批量导出', type: 'success' },
        { name: '导入', type: 'up' },
      ],
      searchForm: {
        userName: '',
        userAccount: '',
        phone: '',
        shopStatus: '',
        time: [],
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10,
      },
      ruleForm: {},
      cellObj: {
        index: 2,
        obj: {
          color: "#ff0000"
        }
      },
      userIds: []
    };
  },

  mounted() {
    this.getList()
  },


  methods: {
    crudClick(name: string) {
      if (name == '批量导出') {
        http.upLoad('/user/downloadClientList', { userIds: this.userIds }, "客户管理")
      }
    },
    excelChange(e: any) {
      let formData = new FormData()
      formData.append('file', e.raw)
      http.downLoad('/user/upClientExcel', formData).then((res) => {
        this.$message.success("上传成功")
        this.reset()
      })
    },
    operationClick(item: any, name: string) {
      if (name == '修改') {
        this.dialogVisible = true
        this.ruleForm = copyObj(item)//JSON.parse(JSON.stringify(item))
      } else if (name == '禁用') {

      }
    },
    close() {
      this.dialogVisible = false
    },
    submitForm() {

    },
    resetForm() {
      this.dialogVisible = false
    },

    getList() {
      this.loading = true
      this.searchForm.startTime = this.getTime(this.searchForm.time[0])
      this.searchForm.endTime = this.getTime(this.searchForm.time[1])
      let prams = copyObj(this.searchForm)
      delete prams.time
      http.post("/user/getClientList", prams).then((res: any) => {
        this.loading = false
        if (res.code == 200) {
          this.tableData = res.data.records
          this.total = res.data.total
        }
      }).catch(() => { this.loading = false })
    },
    selectionChange(e: any) {
      this.userIds = []
      e.forEach((item: any) => {
        this.userIds.push(item.userId)
      })
    },
    selectAll(e: any) {
      this.userIds = []
      e.forEach((item: any) => {
        this.userIds.push(item.userId)
      })
    }
  }
})

</script>
<style lang='scss' scoped>

</style>
