<!-- 列表组件-->
<template>
  <div class="index">
    <div class="search">
      <el-form ref="form" :inline="true">
        <template v-for="item in searchList" :key="item.index">
          <el-form-item :label="item.name" v-if="item.type == 'input'">
            <el-input v-model="searchForm[item.key]" :placeholder="item.placeholder" :maxlength="item.maxlength"
              :style="{ width: item.width + 'px' }" />
          </el-form-item>
          <el-form-item :label="item.name" v-if="item.type == 'select'">
            <el-select v-model="searchForm[item.key]" :placeholder="item.placeholder"
              :style="{ width: item.width + 'px' }">
              <el-option v-for="i in item.selectList" :key="i.index" :label="i.label" :value="i.value"
                :placeholder="item.placeholder" />
            </el-select>
          </el-form-item>
          <el-form-item :label="item.name" v-if="item.type == 'date'">
            <el-date-picker v-model="searchForm[item.key]" :type="item.dateType || 'date'"
              :placeholder="item.placeholder" :default-value="item.defaultValue" :editable="item.editable"
              :format="item.format" :value-format="item.valueFormat" :end-placeholder="item.endplaceholder"
              :start-placeholder="item.startPlaceholder" :clearable="item.clearable" :disabled-date="item.disabledDate"
              :style="{ width: item.width + 'px' }" />
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <div style="margin-bottom: 10px;text-align: left;margin: 5px 0;display: flex;align-items: center;">

        <div v-for="item in crudList" :key="item.index" style="margin-right:5px">
          <el-upload action="#" accept=".xls,.xlsx" :show-file-list="false" :auto-upload="false"
            :on-change="excelChange" v-if="item.type == 'up'">
            <template #trigger>
              <el-button type="primary">{{ item.name }}</el-button>
            </template>
          </el-upload>

          <el-button :type="item.type" @click.stop="crudClick(item.name)" v-else>
            {{ item.name }}
          </el-button>
        </div>

        <div style="margin-left:auto;">
          <el-popover placement="top" :width="800">
            <el-checkbox-group v-model="checkList" @change="checkChange">
              <el-checkbox v-for="item in checkData" :label="item.label" :key="item.index">{{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
            <template #reference>
              <div style="color: #0000cd; font-size: 20px;">
                <el-icon>
                  <Menu />
                </el-icon>
              </div>
            </template>
          </el-popover>
        </div>
      </div>

      <el-table :data="tableData" border highlight-current-row @selection-change="selectionChange"
        @select-all="selectAll"
        :header-cell-style="{ background: '#eef1f6', color: '#606266', 'border-Bottom': '1px solid #8a8a8a' }"
        style="width: 100%;margin-bottom: 5px" :cell-style="cellStyle" v-loading="loading" :max-height="maxHeight">
        <template v-for="item in columns" :key="item.index">
          <el-table-column type="index" v-if="item.type == 'index'" label="序号" align='center'
            :width="item.width || 80" />
          <el-table-column type="selection" v-if="item.type == 'selection'" align='center' :width="item.width || 50" />
          <el-table-column type="expand" width="100" v-if="item.type == 'expand'" align='center' />
          <el-table-column :width="item.width" v-if="item.type == 'switch'" align='center'>
            <template #default="scope">
              <el-switch v-model="scope.row[item.property]" :size="item.size" :active-text="item.activeText"
                :inactive-text="item.inactiveText" />
            </template>
          </el-table-column>
          <el-table-column :width="item.width" v-if="item.type == 'double'" align='center'>
            <template v-for="i in item.childrenList" :key="i.index">
              <el-table-column :label="i.label" :property="i.property" :width="i.width" :align="i.align"
                v-if="i.type == 'text'">
                <template #default="scope">
                  <span @click.stop="textClick(scope.row[i.property])">{{ scope.row[i.property] }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="i.type == 'img'" :label="i.label" :property="i.property" width="100"
                align="center">
                <template #default="scope">
                  <el-image :src="scope.row.src" :preview-src-list="[scope.row.src]" style="width:70px;height:20px" />
                </template>
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column :label="item.label" :property="item.property" :width="item.width" :align="item.align"
            v-if="item.type == 'text'" :show-overflow-tooltip="item.showOverflow">
            <template #default="scope">
              <span @click.stop="textClick(scope.row[item.property])">
                {{ item.dataFormat ? (dataFormat(scope.row[item.property] * 1)) : scope.row[item.property] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column v-if="item.type == 'img'" :label="item.label" :property="item.property" width="100"
            align="center">
            <template #default="scope">
              <el-image :src="scope.row[item.property]" :preview-src-list="[scope.row[item.property]]"
                style="width:60px;height:30px" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" v-if="item.type == 'operation'" :fixed="item.fixed"
            :width="item.width">
            <template #default="scope">
              <el-button v-for="i in item.operationList" :key="i.index" :type="i.type" size="small"
                @click.stop="operationClick(scope.row, i.name)" :disabled="scope.row[i.key]">{{ i.name }}
              </el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <el-pagination v-model:currentPage="current_page" v-model:page-size="page_size" :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs } from 'vue'
import { Menu } from '@element-plus/icons-vue'
import http from "@/utils/request"
import { getToken } from '@/utils/cookie'
export default defineComponent({
  components: { Menu },
  emits: ["handleCurrentChange", "excelChange", "selectionChange", "search", "reset", "operationClick", "textClick", "crudClick", "selectAll"
  ],
  props: {
    crudList: {
      type: Array as any,
      required: true,
      default: function () {
        return []
      }
    },
    tableData: {
      type: Array as any,
      required: true,
      default: function () {
        return []
      }
    },
    columnData: {
      type: Array as any,// Array as PropType<column[]>,
      default: function () {
        return []
      }
    },
    searchList: {
      type: Array as any,
      default: function () {
        return []
      }
    },
    searchForm: {
      type: Object as any,
      default: function () {
        return {}
      }
    },
    page: {
      type: Number,
      default: function () {
        return 1
      }
    },
    pageSize: {
      type: Number,
      default: function () {
        return 0
      }
    },
    total: {
      type: Number,
      default: function () {
        return 0
      }
    },
    loading: {
      type: Boolean,
      default: function () {
        return false;
      }
    },
    cellObj: {
      type: Object as any,
      default: function () {
        return {}
      }
    },
    maxHeight: {
      type: String,
      default: function () {
        return (document.documentElement.clientHeight - 265).toString()
      }
    }
  },

  setup(props: any) {
    const { columnData } = toRefs(props),
      checkDatas = columnData.value.filter((item: any) => !(item.type == 'index' || item.type == "selection" || item.type == 'expand' || item.type == 'operation')),
      checks: any = []
    checkDatas.forEach((item: any) => { checks.push(item.label) })
    return { checks, checkDatas };
  },



  data(): any {
    return {
      copyData: this.columnData,
      columns: this.columnData,
      checkList: this.checks,
      checkData: this.checkDatas,
      current_page: this.page,
      page_size: this.pageSize,
      headers: { token: getToken() }
    };
  },


  methods: {
    dataFormat(time: number) {
      if (!time) return ''
      const date = new Date(time)
      const y = date.getFullYear()
      const m = (date.getMonth() + 1 + '').padStart(2, '0')
      const d = (date.getDate() + '').padStart(2, '0')
      const hh = (date.getHours() + '').padStart(2, '0')
      const mm = (date.getMinutes() + '').padStart(2, '0')
      const ss = (date.getSeconds() + '').padStart(2, '0')
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    },

    handleSizeChange(e: any) {
      this.$emit("handleSizeChange", e)
    },

    handleCurrentChange(e: any) {
      this.$emit("handleCurrentChange", e)
    },

    search() {
      this.$emit("search")
    },
    reset() {
      this.$emit("reset")
    },
    operationClick(item: any, name: string) {
      this.$emit("operationClick", item, name)
    },
    crudClick(name: string) {
      this.$emit("crudClick", name)
    },
    textClick(name: string) {
      this.$emit("textClick", name)
    },
    selectionChange(e: any) {
      this.$emit("selectionChange", e)
    },
    selectAll(e: any) {
      this.$emit("selectAll", e)
    },

    excelChange(e: any) {
      console.log(e);
      this.$emit("excelChange", e)
    },

    checkChange(e: any) {
      const data: any = []
      this.copyData.forEach((item: any) => {
        if (item.type == 'index' || item.type == "selection" || item.type == 'expand' ||
          item.type == 'operation') data.push(item)
        e.forEach((element: any) => {
          if (item.label == element) data.push(item)
        })
      });
      this.columns = data
    },

    cellStyle(obj: any) {
      if (obj.columnIndex == this.cellObj.index) {
        return this.cellObj.obj
      }
    },
  }
})

</script>
<style lang='scss' scoped>
@import "@/css/publicCorlor.css";

:deep(.el-table--border, .el-table--group) {
  border: 1px solid #8a8a8a;
}

:deep(.el-upload-list) {
  margin: 0;
}

:deep(.el-table td,
  .el-table th.is-leaf,
  .el-table--border,
  .el-table--group) {
  border-color: #8a8a8a;
}

:deep(.el-table--border::after,
  .el-table--group::after,
  .el-table::before) {
  background-color: #8a8a8a;
}

:deep(.el-form-item) {
  margin: 5px;
}

.index {
  margin: 5px;

  .search {
    text-align: left;
    border-bottom: 2px solid #999;
  }
}
</style> 