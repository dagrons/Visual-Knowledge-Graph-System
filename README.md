## Deps
```bash
cd frontend && yarn && yarn add -g http-server 
cd backend && yarn
mkdir frontend/js/src
```
**NOTE**:
需要将相关js文件移动到frontend/js/src下

默认neoj数据库在localhost下，默认端口7474,7687

## Run
```bash
cd backend && node index.js
cd frontend && yarn http-server . -p 8080
```
**NOTE**
index.js默认端口为3000

http-server默认端口为8080