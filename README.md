### 截图上传组件

#### 简介
一个简单的引导插件.
支持事件钩子并跳过步骤.
umd格式,可`<script>`和import引入使用.


#### 安装
js: `npm i @redbuck/intro`或`yarn add @redbuck/intro`

css: 位于`@redbuck/intro/lib/intro.css`

#### 使用
```
const intro = new Intro(options)
```

options:

属性 | 类型 | 默认值|描述
--:|--:|--:|--:
steps| `Array` | []|步骤
stepCount|`Number`|1|播放次数
storageKey|`String`|'intro_play_count'|标识播放次数

steps为一个成员为对象(step)的数组.对象必须包含el,text字段
其中,el字段应为DOM对象,或DOM对象组成的数组,引导窗将聚焦这个(些)DOM围合成的矩形.
text字段将自动排布在剩余方向中,最大的一个.


实例支持浏览器事件风格绑定回调.
```
intro.on(event, callback)
```
支持事件

事件|参数|描述
--:|--:|--:|
before-next|{step, next, skip}|下一步之前,传入下一步step对象,调用next以继续插件流程,也可以调用skip跳过该步骤
done|无|结束事件

#### 示例
```javascript
const intro = new Intro({
  playCount: 3,
  steps: [
	{
	  el: $('#left'),
	  text: '点击这里,打开新世界大门!',
	},
	{
	// el can be on array
	  el: [$('#block1'), $('#block2'), $('#block3')],
	  text: '根据你想【赠送的奖励】,选择不同的活动类型',
	},
	{
	  el: $('#block4'),
	  text: '选择第5项活动',
	},
	{
	  el: $('#block6'),
	  text: '当你同时要赠送多种奖励时，请选择组合送吧！',
	},
	{
	  el: $('#item1'),
	  text: '点这里，可以查看和管理所有的活动1',
	},
	{
	  el: $('#item2'),
	  text: '点这里，可以查看和管理所有的活动2',
	},
	{
	  el: $('#item3'),
	  text: '点这里，可以查看和管理所有的活动3',
	},
	{
	  el: $('#item4'),
	  text: '点这里，可以查看和管理所有的活动4',
	},
	{
	  el: $('#item5'),
	  text: '点这里，可以查看和管理所有的活动5',
	},
  ],
})

// if you did not listen this event, intro will auto next
intro.on('before-next', async ({step, next, skip}) => {
  // do something
  console.log('before-next', step)
  // continue this step
  if (step.el) {
	next()
  }
  // you can skip this step
  else {
	skip()
  }
})

```

