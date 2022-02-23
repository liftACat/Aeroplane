const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerBulletMove extends cc.Component {
	
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
		// cc.log(this.node.Attack);
	}
	
	onEnable() {
		// 当出现 endPoint.x 为零时用到
		this.initX = this.node.x;
		this.onMove();
	}
	
	reuse(bulletPool) {
		// get 中传入的管理类实例
		this.bulletManager = bulletPool;
		// cc.log(this.bulletManager.rotation)
	}
	
	unuse() {
		// put() 的时候调用
	}
	
	hit() {
		// 通过之前传入的管理类实例回收子 bullet
		this.moveSpeed.stop();
		// cc.log(this.node.Attack);
		this.bulletManager.onKilled(this.node);
	}
	
	getEndPoint(rotation, r) {
		let RADIAN = 2 * Math.PI / 360;
	    // let r = cc.winSize.width;
	    let x = r * Math.sin(rotation * RADIAN);
	    let y = r * Math.cos(rotation * RADIAN);
	    return cc.v2(x, y);
	}
	
	onMove() {
		// 计算终点
		let endPoint = cc.v2(0, 0);
		// cc.log(cc.winSize.height - Math.abs(this.node.y));
		endPoint = this.getEndPoint(this.bulletManager.rotation, cc.winSize.height);
		// 修复当 rotation 为零的时候，x 坐标往 0 走的情况
		if(endPoint.x == 0) {
			endPoint.x = this.initX;
		}
		// 计算距离时间
		let distance = endPoint.sub(this.node.position).mag();
		let duration = distance / this.bulletManager.speed;
		
		// cc.log(endPoint.x);
		// cc.log(endPoint.y);
		//
		let _t = this;
		this.moveSpeed = cc.tween(this.node)
			.to(duration, {position: cc.v2(endPoint.x, endPoint.y)})
			.call(()=>{
				this.hit();
			})
			.start();
		// let moveBy = cc.moveBy(duration, endPoint);
		// let remove = this.hit();
		// let sequence = cc.sequence(moveBy, remove);
		// cc.tween(this.node).then(sequence).start();
	}
	
	/*
	 * 当碰撞产生的时候调用
	 * @param  {Collider} other 产生碰撞的另一个碰撞组件
	 * @param  {Collider} self  产生碰撞的自身的碰撞组件
	*/
	onCollisionEnter(other, self) {
		if(other.node.group == "enemy") {
			// 回收
			this.hit();
		}
	}
}
