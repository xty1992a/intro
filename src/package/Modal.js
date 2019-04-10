import preact, {h, render, Component} from 'preact'
import './modal.less'

export default class Modal extends Component {
  state = {
	style: '',
	text: '',
	textStyle: '',
	manStyle: '',
	textPosition: 'bottom',
  }

  modalLeftRect = {}

  get modalProps() {
	if (!this.currentStep) return {}
	let {el, text} = this.currentStep
	if (el instanceof Function) {
	  el = el()
	}
	let rect = {}
	if (el instanceof Element) {
	  rect = el.getBoundingClientRect()
	}
	else if (Array.isArray(el)) {
	  let {clientWidth, clientHeight} = this
	  let left = clientWidth, right = 0, top = clientHeight, bottom = 0
	  el.forEach(dom => {
		let r = dom.getBoundingClientRect()
		left = Math.min(left, r.left)
		top = Math.min(top, r.top)
		right = Math.max(right, r.right)
		bottom = Math.max(bottom, r.bottom)
	  })
	  rect = {left, top, width: right - left, height: bottom - top}
	}
	let {width, height, left, top} = rect
	return {
	  width, height, left, top, text, right: width + left, bottom: top + height,
	}
  }

  get currentStep() {
	if (!this.props.steps.length) return null
	return this.props.steps[this.step] || null
  }

  constructor(props) {
	super(props);
	this.clientWidth = document.documentElement.clientWidth
	this.clientHeight = document.documentElement.clientHeight
	this.step = -1
	this.next()
  }

  onStep() {
	if (this.step >= this.props.steps.length || !this.currentStep) {
	  this.exit()
	  return
	}

	this.getTextPosition()
	this.setStyle()
	this.setTextStyle()
	// this.setManStyle()

	this.setState({
	  text: this.currentStep.text,
	})

  }

  next = () => {
	if (this.onWaiting) return
	let nextStep = this.props.steps[this.step + 1]

	if (!nextStep) {
	  this.exit()
	  return
	}

	this.onWaiting = true

	this.props.onBeforeNext(nextStep, () => {
	  this.onWaiting = false
	  this.step++
	  this.onStep()
	}, () => {
	  this.onWaiting = false
	  this.step += 2
	  this.onStep()
	})
  }

  setStyle() {
	let {width, height, left, top} = this.modalProps
	this.setState({
	  style: `
	width: ${width}px;
	height: ${height}px;
	left: ${left}px;
	top: ${top}px;
	`,
	})
  }

  getTextPosition() {
	let {clientWidth, clientHeight} = this
	let {right, bottom, left, top} = this.modalProps

	const map = this.modalLeftRect = {
	  left, top, right: clientWidth - right, bottom: clientHeight - bottom,
	}
	const keys = Object.keys(map)

	const max = Math.max(...keys.reduce((p, k) => [...p, map[k]], []))

	console.log('position ', keys.find(k => map[k] === max), ' is largest')

	this.setState({
	  textPosition: keys.find(k => map[k] === max),
	})

  }

  setTextStyle() {
	let textPosition = this.state.textPosition
	let {width, height, left, top} = this.modalProps
	let transform = ''
	let right = 'auto', bottom = 'auto'

	switch (textPosition) {
	  case 'bottom':
		top = top + height + 20;
		// bottom = top + height + 20
		// top = 'auto'
		break
	  case 'top':
		top = top - 150;
		break
	  case 'right':
		left = left + width + 20
		break
	  case 'left':
		left = left - 260
		break
	}

	console.log(top, left, bottom, right)
	top = Math.min(Math.max(top, 0), this.clientHeight - 160)
	left = Math.min(Math.max(left, 0), this.clientWidth - 240)

	console.log(top, left, bottom, right)

	this.setState({
	  textPosition,
	  textStyle: `
	  	transform: ${transform};
	  	width: ${240}px;
	  	top: ${top === 'auto' ? 'auto' : top + 'px'};
	  	left: ${left === 'auto' ? 'auto' : left + 'px'};
	  	bottom: ${bottom === 'auto' ? 'auto' : bottom + 'px'};
	  	right: ${right === 'auto' ? 'auto' : right + 'px'};
	  `,
	})
  }

  /*
	setManStyle() {
	  let textPosition = this.state.textPosition
	  let {width, height, left, top} = this.modalProps
	  switch (textPosition) {
		case 'bottom':
		  top = top + height + 10;
		  left = left - 80
		  break
		case 'top':
		  top = top - 90;
		  left = left - 40
		  break
		case 'right':
		  top = top + height / 2 - 100
		  left = left + width + 20
		  break
		case 'left':
		  top = top + height / 2 - 100
		  left = left - 150
		  break
	  }

	  this.setState({
		manStyle: `
			top: ${top}px;
			left: ${left}px;
		`,
	  })
	}*/

  close = () => {
	let el = this.base;
	if (!el) return
	render(null, el.parentNode, el);
	el.remove();
  }

  exit = () => {
	this.close()
	this.props.onDone && this.props.onDone()
  }

  render(props, state, context) {
	return <div class="intro-container">
	  <div className={`intro-modal`} style={this.state.style} onClick={this.props.onClickModal}>
	  </div>
	  {/*<div className="man" style={this.state.manStyle}></div>*/}
	  <div class={`text arrow arrow__${this.state.textPosition}`} style={this.state.textStyle}>
		<p>{this.state.text}</p>
		<div className="btn-wrap">
		  <button onClick={this.exit}>跳过</button>
		  <button onClick={this.next} class="next">继续</button>
		</div>
	  </div>
	</div>
  }

}

