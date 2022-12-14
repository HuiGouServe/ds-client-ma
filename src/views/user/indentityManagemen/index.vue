<!-- 权限管理 -->
<template>
  <div>
    <tableList :table-data="tableData" :column-data="columnData" :searchList="searchList" :searchForm="searchForm"
      :crudList="crudList" @crudClick="crudClick" @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange" @search="search" @reset="reset" @selectionChange="selectionChange"
      :cellObj="cellObj" :page="searchForm.page" :pageSize="searchForm.pageSize" :total="total"
      @operationClick="operationClick" @selectAll="selectAll" :loading="loading" />

    <dialogList :formList="formList" :dialogVisible="dialogVisible" :width="dialogWidth" :ruleForm="ruleForm"
      :title="title" @close="close" :showClose="showClose" @resetForm="resetForm" @submitForm="submitForm" />

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
      showClose: true,
      title: "审核",
      tableData: [],
      total: 0,
      dialogWidth: "550px",
      loading: false,
      columnData: [
        { type: 'selection' },
        { type: 'index', width: '60' },
        { type: 'text', label: "姓名", property: 'indentityName', align: 'center' },
        { type: 'text', label: "认证状态", property: 'indentityStatus', align: 'center', width: '90' },
        { type: 'text', label: "身份证号码", property: 'indentityCode', align: 'center', width: '170' },
        { type: 'img', label: "身份证正面图片", property: 'indentityFront', align: 'center', width: '130' },
        { type: 'img', label: '身份证反面图片', property: 'indentityVerso', align: 'center', width: '130' },
        { type: 'text', label: '认证失败说明', property: 'indentityExplain', align: 'center' },
        { type: 'text', label: '创建时间', property: 'createTime', align: 'center', width: '155', dataFormat: true },
        { type: 'text', label: '修改时间', property: 'updateTime', align: 'center', width: '155', dataFormat: true },
        { type: 'text', label: '认证时间', property: 'indentityTime', align: 'center', width: '155', dataFormat: true },
        {
          type: 'operation', width: '150px', operationList: [{ name: '审核', type: 'primary', key: "indentity" },
          { name: '删除', type: 'danger', key: "isDelete" }
          ]
        }
      ],
      formList: [ //
        { type: 'switch', name: 'indentityStatus', label: '状态', inactiveText: '不通过', activeText: '通过' },
        { type: 'textarea', name: 'indentityExplain', label: '失败说明', width: '300px', maxlength: 200, clearable: true },
      ],
      searchList: [
        { type: 'input', name: '名称：', key: "indentityName", placeholder: '请输入', maxlength: 20 },
        {
          type: "select", name: '认证状态：', key: "indentityStatus", placeholder: '请选择', selectList: [
            { value: "0", label: "未认证" },
            { value: "1", label: "认证未通过" },
            { value: "2", label: "已认证" },
          ],
        },
        { type: 'date', name: '创建时间：', dateType: "", placeholder: '请选择时间' },
      ],
      crudList: [
        { name: '批量导出', type: 'success' }, { name: '批量删除', type: 'danger' }
      ],
      searchForm: {
        indentityName: '',
        indentityStatus: '',
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10,
      },
      ruleForm: {
        indentityStatus: '',
        indentityExplain: '',
      },
      cellObj: {
        index: 4,
        obj: {
          color: "#ff0000"
        }
      },
      indentityIds: []
    };
  },

  mounted() {
    this.getList()
  },


  methods: {
    crudClick(name: string) {
      this.title = name
      if (name == '批量删除') {
        this.$confirm(
          '确认删除选中的数据？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            http.post("/indentity/deletes", { indentityIds: this.indentityIds }).then((res: any) => {
              if (res.code == 200) {
                this.dialogVisible = false
                this.getList()
                this.$message.success("删除成功")
              }
            })
          })
      }
    },
    operationClick(item: any, name: string) {
      if (name == '审核') {
        this.dialogVisible = true
        this.ruleForm = copyObj(item)
      } else if (name == '删除') {
        this.$confirm(
          '确认删除该条数据？',
          '提示',
          {
            confirmButtonText: '确定',
            type: 'warning',
          }).then(() => {
            http.post("/indentity/delete", { indentityIds: item.indentityId }).then((res: any) => {
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

    resetForm() {
      this.dialogVisible = false
    },
    submitForm() {
      this.ruleForm.indentityStatus = this.ruleForm.indentityStatus ? '2' : '1'
      http.post("/indentity/indentity", this.ruleForm).then((res: any) => {
        if (res.code == 200) {
          this.dialogVisible = false
          this.$message.success("修改成功")
          this.getList()
        }
      })
    },

    getList() {
      this.loading = true
      http.post("/indentity/getList", this.searchForm).then((res: any) => {
        this.loading = false
        if (res.code == 200) {
          res.data.records.forEach((item: any) => {
            item.indentityFront = http.baseURL + item.indentityFront
            item.indentityVerso = http.baseURL + item.indentityVerso
            item.indentity = item.indentityStatus == 2
            item.indentityStatus = this.searchList[1].selectList[item.indentityStatus].label
          })
          this.tableData = res.data.records
          this.total = res.data.total
        }
      })
    },
    selectionChange(e: any) {
      this.indentityIds = []
      e.forEach((item: any) => {
        this.indentityIds.push(item.indentityId)
      })
    },
    selectAll(e: any) {
      this.userIds = []
      e.forEach((item: any) => {
        this.indentityIds.push(item.indentityId)
      })
    }
  }
})

</script>
<style lang='scss' scoped>

</style>
