# swagger-ui-theme


运行方式
前提: 需要安装node和umiJs

方式一:
直接将根目录下的`docker/dist`目录拷贝到nginx或tomcat即可直接访问运行

方式二:

* 命令行进入`docker/dist`执行docker命令,打包为一个镜像
 `docker build -t swagger-ui-theme:1.0 .`
* 运行docker容器
  `docker run -d --name swagger-ui-theme -p 8088:80 swagger-ui-theme:1.0` 
* 待容器启动之后,打开浏览器访问 http://localhost:8088

方式三:
进入项目根目录执行`umi dev`即可启动,访问

方式四:
进入项目根目录执行`umi build`即可启动，会生成dist目录,该目录就可以直接放到ngnix运行




