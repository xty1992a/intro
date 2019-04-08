// 未编译API,需要引入polyfill
import 'core-js'

import Intro from './package/main'

const $ = e => document.querySelector(e)

const intro = new Intro({
  playCount: 3,
  steps: [
	{
	  el: () => $('#right'),
	  text: '点击这里,打开新世界大门!',
	  key: 0,
	},
	{
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

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

/*
// 调用next,使流程继续,调用skip,跳过本次
intro.on('before-next', async ({step, next, skip}) => {
  if (step.hasOwnProperty('key')) {
	const el = document.createElement('div')
	el.id = 'right'
	el.className = 'right'
	document.getElementById('head').appendChild(el)
  }
  await sleep(300)
  let el = step.el
  if (el instanceof Function) {
	el = el()
  }
  if (el) {
	next()
  }
  else {
	skip()
  }
})
*/

intro.on('done', () => {
  console.log('over')
})
