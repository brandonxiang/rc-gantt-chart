# 甘特图的React实现

## 安装

```bash
pnpm i rc-gantt-chart antd
```

## 使用

```javascript
import Gantt from 'rc-gantt-chart';
    
    
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Gantt data={res} startDate={initStart} endDate={initEnd}/>
  </React.StrictMode>
)

```

## 参数说明

参数名 | 解释 | 格式
---------|----------|---------
 data | 甘特图的 | 
 startDate | 开始时间 | Moment时间对象
 endDate | 结束时间 | Moment时间对象
 