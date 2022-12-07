<!-- 首页 -->
<template>
  <div class='index'>
    <el-menu active-color="#fff" background-color="#333" router text-color="#fff" :default-active="title"
      :collapse="collapse" class="el-menu">
      <template v-for="item in routes" :key="item.index">
        <el-sub-menu :index="item.path" v-if="item.children">
          <template #title>
            <el-icon>
              <Grid />
            </el-icon>
            <span style="width:131px;text-align: left;">{{ item.name }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="(i, idx) in item.children" :key="idx" :index="i.path" @click="meunClick(i)">{{ i.name
            }}
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item :index="item.path" v-else @click="meunClick(item)">
          <el-icon>
            <Grid />
          </el-icon>
          <span style="width:131px;text-align: left">{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
    <div class="body">
      <div class="top">
        <div class="title-top">
          <el-icon @click="collapse = !collapse" style="margin:5px;font-size:25px">
            <Grid />
          </el-icon>
          <el-breadcrumb separator=">" class="breadcrumb">
            <el-breadcrumb-item v-for="(item, i) in breadcrumbList" :key="i" :to="item.path">{{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <div class="name">
            <el-dropdown>
              <div style="margin-right: 10px;cursor: pointer;line-height: 40px; font-size: 16px;">
                {{ name }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click.stop="uatatePaword">修改密码</el-dropdown-item>
                  <el-dropdown-item @click.stop="logout">退出登陆</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <img @click="show = !show" v-if="default_img" :src="baseURL + default_img"
              style="max-width: 40px; max-height: 40px;" />
            <span v-else @click="show = !show;" style="font-size: 12px;cursor: pointer;">上传头像</span>
          </div>
        </div>
        <div class="title-list">
          <div v-for="(item, index) in titleList" :key="index" @click="titleClick(item)"
            :class="['default', title == item.path ? 'isdefault' : 'item']">
            {{ item.name }}
            <el-icon @click.stop="deleteTitle(item)" style="margin-left: 5px;">
              <CircleClose />
            </el-icon>
          </div>
        </div>
      </div>
      <div class="main">
        <div v-if="isIndex == '/index'" style="font-size: 30px;margin:0 auto;padding:100px">欢迎登录惠购后台系统</div>
        <router-view v-else v-slot="{ Component }" :key="$route.path" style="height: 100%;width: 100%;">
          <transition name="fade">
            <keep-alive>
              <component :is="Component" :key="title" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
      <div class="foot">惠购后台系统管理平台</div>
    </div>

    <dialogList :formList="formList" :dialogVisible="dialogVisible" width="500px" :ruleForm="ruleForm" title="修改密码"
      :rules="rules" @close="close" @resetForm="resetForm" @submitForm="submitForm" labelWidth="90px" />

    <my-upload ref="myUpload" @crop-success="cropSuccess" v-model="show" :width="200" :height="200" img-format="png"
      :size="2.1" langType='zh' field="file" />

  </div>
</template>

<script lang='ts' >
import { getUserInfo, setUserInfo } from '@/utils/cookie'
import { Grid, CircleClose, ArrowDown } from '@element-plus/icons-vue'
import { defineComponent, watch, ref, KeepAlive, } from 'vue'
import { RouteRecordName, useRouter, useRoute } from 'vue-router'
import dialogList from '@/components/dialog.vue'
import myUpload from 'vue-image-crop-upload/upload-3.vue'
import store from "@/store/index"
import http from '@/utils/request'

interface breadcrumb { name: RouteRecordName | undefined, path: string }

export default defineComponent({
  name: "路由",
  components: { Grid, CircleClose, myUpload, ArrowDown, KeepAlive, dialogList },
  setup() {
    const route = useRoute(), breadcrumbList = ref([{ name: '惠购后台管理', path: '/' }]), isIndex = ref(''), titleList = ref([])
    watch(() => route.matched, (newPath: any, oldPath: any) => {
      isIndex.value = newPath[newPath.length - 1].path
      if (isIndex.value == '/index') titleList.value = []
      breadcrumbList.value = [{ name: '惠购后台管理', path: '/' }]
      for (let i = 1; i < newPath.length; i++) {
        breadcrumbList.value.push({ name: newPath[i].name, path: newPath[i].path })
      }
    }, { immediate: true });
    return { breadcrumbList, isIndex, titleList }
  },

  data(): any {
    let routes: any = []
    JSON.parse(JSON.stringify(store().router.routers)).forEach((item: any) => {
      if (item.path == '/index') routes = item.children
    })
    return {
      default_img: JSON.parse(getUserInfo()).userPortrait,
      baseURL: http.baseURL + '/',
      show: false,
      collapse: false,
      title: useRouter().currentRoute.value.path,
      dialogVisible: false,
      name: JSON.parse(getUserInfo()).userName,
      routes,
      formList: [
        { type: 'password', name: 'oldPassword', label: '原密码', width: '300px', maxlength: 20, clearable: true },
        { type: 'password', name: 'newPassword', label: '新密码', width: '300px', maxlength: 20, clearable: true },
        { type: 'password', name: 'password', label: '重复密码', width: '300px', maxlength: 20, clearable: true },
      ],
      ruleForm: {
        oldPassword: '',
        newPassword: '',
        password: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原始密码', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入重复密码', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {
    isIndex() {
      return window.location.href.split('#')[1] == '/index'

    },
    location() {
      return window.location.href
    }
  },


  methods: {
    cropSuccess(jsonData: any) {
      let arr = jsonData.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) { u8arr[n] = bstr.charCodeAt(n) }
      let formData = new FormData()
      formData.append('file', new File([u8arr], '裁剪图片.png', { type: mime }))
      formData.append('userId', JSON.parse(getUserInfo()).userId)
      http.downLoad('user/uploadPortrait', formData).then((res: any) => {
        if (res.code == 200) {
          this.show = false
          this.default_img = res.data
          let userInfo = JSON.parse(getUserInfo())
          userInfo.userPortrait = res.data
          setUserInfo(userInfo)
          this.$refs.myUpload.createImgUrl = '' //重置
          this.$refs.myUpload.step = 1
        }
      })
    },

    titleClick(item: breadcrumb) {
      this.$router.push({ path: item.path })
      this.title = item.path
    },
    deleteTitle(i: any) {
      this.titleList = this.titleList.filter((item: any) => item != i)
      if (this.title == i.path) this.$router.push({ path: '/' })
    },
    meunClick(e: any) {
      this.title = e.path
      let a = true
      this.titleList.forEach((item: any) => {
        if (item.path === e.path && item.name === e.name) {
          a = false
        }
      })
      if (a) this.titleList.push({ name: e.name, path: e.path })
    },

    logout() {
      store().user.logOut().then((res: any) => {
        this.$router.push("/login")
      })
    },
    uatatePaword() {
      this.dialogVisible = true
    },

    submitForm() {
      if (this.ruleForm.password != this.ruleForm.newPassword) {
        this.$message.warning('新密码与重复密码不一致,请核对后重新输入')
        return
      }
      http.post("/user/uptatePassword", { ...this.ruleForm, userId: JSON.parse(getUserInfo()).userId }).then((res: any) => {
        if (res.code == 200) {
          this.dialogVisible = false
          this.getList()
          this.$message.success("修改成功")
        } else {
          this.$message.info(res.message)
        }
      })
    },

    resetForm() {
      this.dialogVisible = false
    },
    close() {
      this.dialogVisible = false
    },
  }
})

</script>
<style lang='scss' scoped>
:deep(.cropper) {
  z-index: 1000;
}

.index {
  display: flex;
  width: 100%;
  height: 100%;

  .el-menu {
    border-right: 0;
  }

  .body {
    overflow: hidden;
    flex: 1;
    position: relative;

    .top {
      text-align: left;
      height: 79px;
      border-bottom: 1px solid #888;

      .title-top {
        display: flex;
        height: 50px;
        line-height: 50px;

        .breadcrumb {
          margin: 5px 20px;
          line-height: 50px;
        }

        .name {
          width: 150px;
          text-align: center;
          margin-left: auto;
          display: flex;
          align-items: center;
        }
      }

      .title-list {
        border-top: 1px solid #ccc;
        display: flex;
        overflow: hidden;
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;

        &::-webkit-scrollbar {
          display: none;
        }

        .default {
          padding: 2px 8px;
          font-size: 14px;
          margin: 2px;
          display: flex;
          align-items: center;
          border-radius: 2px;
          cursor: pointer;
        }

        .item {
          border: 1px solid #888;
          color: #333;
        }

        .isdefault {
          border: 1px solid #00ff00;
          color: #00ff00;
        }
      }
    }

    .main {
      height: calc(100% - 80px);
      z-index: 10;
    }

    .foot {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      height: 40px;
      background: #888;
      font-size: 20px;
      line-height: 40px;
      color: #fff;
    }
  }
}
</style>
