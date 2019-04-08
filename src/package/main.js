import preact, {h, render, Component} from 'preact'

import Modal from './Modal'

const storage = {
  getItem(key) {
	try {
	  return JSON.parse(localStorage.getItem(key))
	} catch (e) {
	  return null
	}
  },
  setItem(key, data) {
	try {
	  localStorage.setItem(key, JSON.stringify(data))
	  return true
	} catch (e) {
	  return false
	}
  },
}

class EmitAble {
  constructor() {
	this._task = {}
  }

  on(event, callback) {
	this._task[event] = callback
  }

  off(event) {
	this._task[event] = null
  }

  fire(event, payload) {
	this._task[event] && this._task[event](payload)
  }
}

const defOptions = {
  steps: [],
  playCount: 1,
  storageKey: 'intro_play_count',
}

export default class Intro extends EmitAble {
  constructor(opt) {
	super();
	this.$options = {
	  ...defOptions,
	  ...opt,
	}

	if (storage.getItem(this.$options.storageKey) >= this.$options.playCount) {
	  console.log('intro play count is over the limit !')
	  return
	}

	this.show()
  }

  onBeforeNext = (step, next, skip) => {
	if (this._task['before-next']) {
	  this.fire('before-next', {step, next, skip})
	}
	else {
	  next()
	}
  }

  onDone = () => {
	let count = storage.getItem(this.$options.storageKey) || 0
	storage.setItem(this.$options.storageKey, count + 1)
	this.fire('done')
  }

  onAbort = () => {
	this.fire('abort')
  }

  hide = () => {
	render(null, this.$el.parentNode, this.$el);
  }

  show() {
	const el = this.$el = document.createElement('div');
	document.body.appendChild(el);
	render(<Modal {...this.$options}
				  onBeforeNext={this.onBeforeNext}
				  onDone={this.onDone}
				  onClickModal={this.onClickModal}
				  onAbort={this.onAbort}/>, document.body, el);
  }
}
