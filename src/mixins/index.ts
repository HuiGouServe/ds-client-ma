
export const tableMixin = {

  methods: {
    search(e: any) {
      this.$data.searchForm.page = 1
      this.getList()
    },
    reset() {
      for (let i in this.$data.searchForm) {
        if (this.$data.searchForm[i] instanceof Array) {
          this.$data.searchForm[i] = []
        } else if (this.$data.searchForm[i] instanceof Object) {
          this.$data.searchForm[i] = {}
        } else {
          this.$data.searchForm[i] = ''
        }
      }
      this.$data.searchForm.page = 1
      this.$data.searchForm.pageSize = 10
      this.getList()
    },

    handleSizeChange(e: any) {
      this.$data.searchForm.page = 1
      this.$data.searchForm.pageSize = e
      this.getList()
    },
    handleCurrentChange(e: any) {
      this.$data.searchForm.page = e
      this.getList()
    },

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

    getTime(e: string) {
      return e ? new Date(e).getTime() : ''
    },

  }

}