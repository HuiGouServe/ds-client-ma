import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'

export default ({command, mode}: { command: any, mode: any }) => {
    // 根据当前工作目录中的 `mode` 加载 .env 文件
    // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
    const envConfig: any = loadEnv(mode, process.cwd(), '')
    let pageEntry = '';
    // let target = envConfig.VITE_TARGET || 'default'
    let NODE_ENV = envConfig.NODE_ENV || 'development';

    if (NODE_ENV == 'production') {
        pageEntry = resolve(__dirname, 'index.html')
    } else {
        pageEntry = resolve(__dirname, 'index.html')
    }

    //views文件夹中添加文件即可，会获取里面的文件夹名在pages中生产模板
    return defineConfig({
        define: {
            'process.env': envConfig
        },
        plugins: [vue()],
        base: NODE_ENV === 'development' ? '/' : './',
        // vite config
        // root: "./src/",//设置为src文件夹内(项目入口)
        // 静态资源服务文件夹
        publicDir: 'public',
        // envDir: '../',//(检测环境变量文件所在文件夹)
        // 因为root设为了src所以需要../回到上一层,也可以把.env文件放到src内指定加载环境变量文件的目录,相对于root路径
        server: {
            host: 'localhost',//'0.0.0.0',//解决 Network: use `--host` to expose
            port: 8080,//envConfig.VITE_PORT,//定义端口
            // port: 8080,
            open: false, // 是否自动在浏览器打开
            https: false,  // 是否开启 https
            cors: true, // 允许跨域
            // 设置代理，根据我们项目实际情况配置
            // proxy: {
            //   '/api': {
            //     target: 'http://localhost:8001/',	//实际请求地址
            //     changeOrigin: true,
            //     rewrite: (path) => path.replace(/^\/api/, '')
            //   },
            // }
        },
        resolve: {//配置别名,需要配置tsconfig.json文件，compilerOptions中编辑器会自动读取
            alias: [
                {
                    find: '@',
                    replacement: resolve(__dirname, 'src')
                },
            ]
        },
        build: {
            target: 'modules',//浏览器兼容性modules|esnext
            sourcemap: false,//构建后是否生成soutrce map文件
            minify: 'terser', // 混淆器,terser构建后文件体积更小
            // outDir: envConfig.VITE_OUTPUT_DIR,  //指定输出文件包名
            outDir: 'dist',
            assetsDir: 'assets', // 指定生成静态资源的存放路径
            chunkSizeWarningLimit: 1500, //警报门槛，限制大文件大小B为单位
            assetsInlineLimit: 4096,//小于此阈值的导入或引用资源将内联为base64编码,以避免额外的http请求,设置为0可以完全禁用此项
            brotliSize: false,//启用|禁用brotli压缩大小报告
            // 清除console和debugger(minify: 'terser',)设置后这个terserOptions才有用
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
            rollupOptions: {
                input: pageEntry,
                output: {//自动分割包名输出 chunkSizeWarningLimit 配置大小
                    chunkFileNames: 'js/[name]-[hash].js',//入口文件名
                    entryFileNames: 'js/[name]-[hash].js',//出口文件名位置
                    assetFileNames: '[ext]/[name]-[hash].[ext]',//静态文件名位置
                    // assetFileNames: 'assets/static/[name]-[hash].[ext]',//静态文件名位置
                    manualChunks(id: any) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    }
                }
            },
        }

    })
}