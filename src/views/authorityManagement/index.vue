<!-- 权限管理 -->
<template>
  <div>
    <tableList :table-data="tableData" :column-data="columnData" :searchList="searchList" :searchForm="searchForm"
      :crudList="crudList" @crudClick="crudClick" @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange" @search="search" @reset="reset" @selectionChange="selectionChange"
      :cellObj="cellObj" :page="searchForm.page" :pageSize="searchForm.pageSize" :total="total"
      @operationClick="operationClick" @selectAll="selectAll" :loading="loading" @excelChange="excelChange" />

    <dialogList :formList="formList" :dialogVisible="dialogVisible" :width="dialogWidth" :ruleForm="ruleForm"
      :title="title" :rules="rules" @close="close" :showClose="showClose" @resetForm="resetForm"
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
import axios from 'axios'

export default defineComponent({
  components: { tableList, dialogList },
  mixins: [tableMixin], //混入
  data(): any {
    return {
      dialogVisible: false,
      showClose: true,
      title: "",
      tableData: [],
      total: 0,
      dialogWidth: "550px",
      loading: false,
      columnData: [
        { type: 'selection' },
        { type: 'index' },
        { type: 'text', label: "名称", property: 'userName', align: 'center' },
        { type: 'text', label: "权限级别", property: 'userRank', align: 'center' },
        { type: 'text', label: "创建时间", property: 'createTime', align: 'center', width: '160px' },
        { type: 'text', label: "账号", property: 'userAccount', align: 'center' },
        { type: 'text', label: '联系方式', property: 'userPhone', align: 'center' },
        {
          type: 'operation', operationList: [{ name: '修改', type: 'primary', key: "isUpdate" },
          { name: '删除', type: 'danger', key: "isDelete" }]
        }
      ],
      rules: {
        userName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        userPhone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
        ],
        userAccount: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        userRank: [
          { required: true, message: '请选择权限级别', trigger: 'blur' },
        ],
      },
      formList: [
        { type: 'input', name: 'userName', label: '名称', width: '300px', maxlength: 20, clearable: true },
        { type: 'input', name: 'userPhone', label: '联系方式', width: '300px', maxlength: 11, clearable: true },
        { type: 'input', name: 'userAccount', label: '账号', width: '300px', maxlength: 20, clearable: true },
        {
          type: 'select', name: 'userRank', label: '权限级别', width: '300px', clearable: true,
          selectList: [
            { value: "超级管理员", label: "超级管理员" },
            { value: "普通管理员", label: "普通管理员" },
            { value: "普通用户", label: "普通用户" },]
        },
      ],
      searchList: [
        { type: 'input', name: '名称：', key: "userName", placeholder: '请输入', maxlength: 20 },
        {
          type: "select", name: '权限级别：', key: "userRank", placeholder: '请选择', selectList: [
            { value: "超级管理员", label: "超级管理员" },
            { value: "普通管理员", label: "普通管理员" },
            { value: "普通用户", label: "普通用户" }],
        },
        { type: 'date', name: '创建时间：', key: "time", dateType: "daterange", placeholder: '请选择时间', width: '210' },
      ],
      crudList: [
        { name: '新增', type: 'primary' },
        { name: '批量删除', type: 'danger' },
        { name: '批量导出', type: 'success' },
        { name: '导入', type: 'up' },
      ],
      searchForm: {
        time: [],
        userName: '',
        userRank: '',
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10,
      },
      ruleForm: {
        userName: '',
        userPhone: '',
        userAccount: '',
        userRank: '',
      },
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
      this.title = name
      if (name == '新增') {
        this.dialogVisible = true
        this.ruleForm = {
          userName: '',
          userPhone: '',
          userAccount: '',
          userRank: '',
        }
      }
      if (name == '批量删除') {
        this.$confirm(
          '确认删除选中的数据？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            http.post("/user/deletes", { userIds: this.userIds }).then((res: any) => {
              if (res.code == 200) {
                this.dialogVisible = false
                this.getList()
                this.$message.success("删除成功")
              }
            })
          })
      }
      if (name == '批量导出') {
        http.upLoad('/user/download', { userIds: this.userIds }, "客服管理")
      }
    },
    excelChange(e: any) {
      let formData = new FormData()
      formData.append('file', e.raw)
      http.downLoad('/user/upExcel', formData).then((res) => {
        this.$message.success("上传成功")
        this.reset()
      })
    },
    operationClick(item: any, name: string) {
      if (name == '修改') {
        this.dialogVisible = true
        this.ruleForm = copyObj(item)//JSON.parse(JSON.stringify(item))
      } else if (name == '删除') {
        this.$confirm(
          '确认删除该条数据？',
          '提示',
          {
            confirmButtonText: '确定',
            type: 'warning',
          }).then(() => {
            http.post("/user/delete", { userId: item.userId }).then((res: any) => {
              if (res.code == 200) {
                this.dialogVisible = false
                this.getList()
                this.$message.success("删除成功")
              }
            })
          }).catch(() => { })
      }
    },
    close() {
      this.dialogVisible = false
    },
    submitForm() {
      http.post("/user/add", this.ruleForm).then((res: any) => {
        if (res.code == 200) {
          this.dialogVisible = false
          this.getList()
          this.$message.success("新增成功")
        } else {
          this.$message.info(res.message)
        }
      })
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
      http.post("/user/getList", prams).then((res: any) => {
        this.loading = false
        if (res.code == 200) {
          res.data.records.forEach((item: any) => {
            item.createTime = this.dataFormat(item.createTime)
            if (item.userId == 1) {
              item.isUpdate = true
              item.isDelete = true
            }
          })
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
