<template>
  <editor v-model="myValue" :init="init" :disabled="disabled" :id="tinymceId" />
</template>


<script  lang="ts">
//JS部分
//在js中引入所需的主题和组件
import tinymce from "tinymce/tinymce";
import "tinymce/skins/content/default/content.css";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
import "tinymce/themes/silver/theme";
import "tinymce/icons/default"; //引入编辑器图标icon，不引入则不显示对应图标
import "tinymce/models/dom"; // 这里是个坑 一定要引入
//在TinyMce.vue中接着引入相关插件
import "tinymce/icons/default/icons";
import "tinymce/plugins/image"; // 插入上传图片插件
// import "tinymce/plugins/media"; // 插入视频插件
import "tinymce/plugins/table"; // 插入表格插件
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/code"; // 源码
import "tinymce/plugins/fullscreen"; //全屏
import "tinymce/plugins/preview"; //预览
// import 'tinymce/plugins/paste'; //粘贴插件
import "tinymce/plugins/pagebreak"; //插入分页符
import "tinymce/plugins/codesample";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/link";
import "tinymce/plugins/autosave";
import "tinymce/plugins/autolink";
import "tinymce/plugins/anchor";
// import "/public/tinymce/plugins/axupimgs/plugin.js";
// import "tinymce/plugins/fullscreen" //全屏


import { defineComponent } from "vue"
import http from '@/utils/request'

export default defineComponent({
  components: { Editor },
  emits: ["getContent"],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default: "wordcount table searchreplace preview pagebreak  fullscreen  codesample  autosave autolink anchor  autolink image lists  link code image",
    },
    toolbar: {
      type: [String, Array],
      default: "fontsize fontfamily bold  italic lineheight underline alignleft aligncenter alignright alignjustify anchor | undo redo | formatselect | forecolor backcolor | bullist numlist outdent indent | lists link  image table  | removeformat | fullscreen|preview code  codesample|searchreplace",
    }, //必填
  },
  watch: {
    myValue(val) {
      console.log(val);
      this.$emit("getContent", val)
    }
  },

  mounted() {
    tinymce.init({})
  },

  data() {
    const tinymceId = ("vue-tinymce-" + +new Date() + ((Math.random() * 1000).toFixed(0) + ""))
    return {
      myValue: "",
      tinymceId,
      init: {
        selector: "textarea",
        language_url: "/tinymce/lang/zh_CN.js", // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
        language: "zh_CN", //语言
        auto_focus: true,
        skin_url: "tinymce/skins/ui/oxide", // skin路径，具体路径看自己的项目
        height: 800, //编辑器高度
        width: "100%",
        branding: false, //是否禁用“Powered by TinyMCE”
        menubar: false, //顶部菜单栏显示
        image_dimensions: false, //去除宽高属性
        plugins: this.plugins, //这里的数据是在props里面就定义好了的
        toolbar: this.toolbar, //这里的数据是在props里面就定义好了的
        paste_convert_word_fake_lists: true, // 插入word文档需要该属性
        font_size_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
        font_family_formats: "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif",
        line_height_formats: "1 1.2 1.4 1.6 2",
        paste_webkit_styles: "all",
        paste_merge_formats: true,
        nonbreaking_force_tab: false,
        paste_auto_cleanup_on_paste: false,
        file_picker_types: "file image media",
        content_css: "tinymce/skins/content/default/content.css", //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
        file_picker_callback: (callback: any, value: any, meta: any) => { // 图片上传
          let filetype = ".jpg, .jpeg, .png, "; //限制文件的上传类型
          let inputElem: any = document.createElement("input"); //创建文件选择
          inputElem.setAttribute("type", "file");
          inputElem.setAttribute("accept", filetype);
          inputElem.click();
          inputElem.onchange = () => {
            let file = inputElem.files[0]; //获取文件信息
            let params = new FormData();
            params.append("file", file);
            if (file.type.slice(0, 5) == "image" && file.size / 1024 / 1024 > 2) {
              alert("上传失败，图片大小请控制在2M以内");
            } else {
              http.downLoad('/file/uploadFile', params).then((res: any) => {
                if (res.code == 200) {
                  if (res.data) {
                    callback(http.baseURL + '/' + res.data, {
                      text: res.data,
                      title: res.data,
                    });
                  } else {
                    callback(http.baseURL + '/' + res.data);
                  }
                } else {
                  alert("上传失败");
                }
              }).catch(() => {
                alert("上传出错，服务器开小差了呢");
              });
            }
          };
        },
      }
    }
  }
})
</script>

