	var ul = document.querySelector('ul');
	var wrap = document.querySelector('.wrap');
	var chanzi = document.getElementById('chanzi');
	var bozhong = document.getElementById('bozhong');
	var shoutao = document.getElementById('shoutao');
	var quanshou = document.getElementById('quanshou');
	var liArr = ul.children;
	var btns = document.getElementsByTagName('button');
	var none = "img/none.png";
	var seed = "img/seed.png";
	var bud = "img/bud.png";
	var ripe =  "img/ripe.png";
	var flower =  "img/flower.gif";
	var harvest =  "img/harvest.png";
	var timer = null;
    var targetx,targety;
    var leaderx,leadery;
	//状态机 1.播种 2.发芽 3.结果 4.采摘 5.翻地
	var state = 1;//整体按钮状态
	var allLand = [];
	for (var i = 0; i < 12; i++) {
		allLand[i] = [];
		allLand[i][0] = 1;//状态
		allLand[i][1] = 30;//时间
	}
	for (var i = 0; i < btns.length; i++) {
		btns[i].onclick = function(){
			changeState(this.value);
		}
	}
	for (var i = 0; i < liArr.length; i++) {
		liArr[i].onclick = function(j){
			return function(){
				changePic(j,this);
			}
		}(i);
	}
	//控制状态进行图片切换
	function changeState(s) {
		switch (s) {
			case "播种":
				state = 1;
				utils(state);
				break;
			case "发芽":
				state = 2;
				utils(state);
				break;
			case "结果":
				state = 3;
				utils(state);
				break;
			case "采摘":
				state = 4;
				utils(state);
				break;
			case "翻地":
				state = 5;
				utils(state);
				break;
			case "全收":
				state = 6;
				utils(state);
				break;
			default:
				break;
		}
	}
	//图片切换
	function changePic(imgid,e) {
		switch (state) {
			case 1: //播种
				if (allLand[imgid][0] == 1) {
					//图片切换
					e.children[0].src = seed;
					//设置成长时间
					allLand[imgid][1] = 30;
					//改变成下一个状态
					allLand[imgid][0] = 2;
					countdown(imgid,e);
				}else {
					alert("不能播种");
				}
				break;
			case 4: //采摘
				if (allLand[imgid][0] == 4) {
					//图片切换
					e.children[0].src = harvest;
					//改变成下一个状态
					allLand[imgid][0] = 5;
					e.children[1].style.display = "block";
					animate(e.children[1],-400);
					e.children[1].style.top = 45 +'px';//恢复原位
				}else {
					alert("不能采摘");
				}
				break;
			case 5: //翻地
				if (allLand[imgid][0] == 5) {
					//图片切换
					e.children[0].src = none;
					//改变成下一个状态
					allLand[imgid][0] = 1;
				}else {
					alert("不能翻地");
				}
				break;
			case 6: //全收
				for (var i = 0; i < allLand.length; i++) {
					if(allLand[i][0] == 4){
						liArr[i].children[0].src = harvest;
						allLand[i][0] = 5;
						liArr[i].children[1].style.display = "block";
						animate(liArr[i].children[1],-400);
						liArr[i].children[1].style.top = 45 +'px';//恢复原位
					}
				}
			break;
		}
	}
	//发芽需要10秒--发芽状态--结果需要10秒--结果状态--改成下一状态
	//需要不停的执行
	function countdown(imgid,e){
		//结果完毕
		if(allLand[imgid][1] != 0){
			if(allLand[imgid][1] >= 25){
				e.children[0].title = '距离发芽还有'+(allLand[imgid][1]-25)+'秒';
			}else if(allLand[imgid][1] >= 15){
				e.children[0].src = bud;
				e.children[0].title = '距离开花还有'+(allLand[imgid][1]-15)+'秒';		
			}else {
				e.children[0].src = ripe;
				e.children[0].title = '距离成熟还有'+(allLand[imgid][1])+'秒';	
			}
			allLand[imgid][1]-- ;
			//不停执行
			setTimeout(function(){
				countdown(imgid,e);
			},1000);
		}else{//结果
			//切换下一个状态
			allLand[imgid][0] = 4;
			e.children[0].title = "已成熟，可采摘";
			e.children[0].src = flower;
		}	
	}
	//工具
	function utils(state){
		if(state == 1){
			hide()
			bozhong.style.display = "block";
			move(bozhong);
		}
		else if(state == 5){
			hide()
			chanzi.style.display = "block";
			move(chanzi);
		}
		else if(state == 4){
			hide()
			shoutao.style.display = "block";
			move(shoutao);
		}
		else if(state == 6){
			hide()
			quanshou.style.display = "block";
			move(quanshou);
		}
		else{
			hide()
		}
	}
	function hide(){
		bozhong.style.display = "none";
		shoutao.style.display = "none";
		chanzi.style.display = "none";
		quanshou.style.display = "none";
	}
	function move(util){
		document.onmousemove = function(event){
			//兼容获取事件对象
	        event = event || window.event;
	        //鼠标在页面的位置 = 被卷去的部分+可视区域部分。
	        var pagey = event.pageY || scroll().top + event.clientY;
	        var pagex = event.pageX || scroll().left + event.clientX;
	        targetx = pagex-util.offsetWidth/2;
	        targety = pagey-util.offsetHeight/2;
	        var temp = (document.body.offsetWidth - wrap.offsetWidth)/2;
	        util.style.left = pagex + 15 - temp + 'px';//+15为了微调图片的位置以至于不挡住鼠标，鼠标能点击
	        util.style.top = targety + 'px';
		}
	}
	//兼容性获取卷去部分
	function scroll(){
      if(window.pageXOffset !== undefined){
        return{
          "top":pageYOffset,
          "left":pageXOffset
        };
      }else if(document.compatMode === 'CSS1Compat'){
        return{
          "top":document.documentElement.scrollTop,
          "left":document.documentElement.scrollLeft
        };
      }else{
        return{
        "top":document.body.scrollTop,
        "left":document.body.scrollLeft
      };
        
      }
  }
  //缓动
  function animate(ele,target) {
    clearInterval(ele.timer);
    ele.timer = setInterval(function () {
        var step = (target-ele.offsetTop)/10;
        step = step>0?Math.ceil(step):Math.floor(step);
        ele.style.top = ele.offsetTop + step + "px";
        console.log(1);
        if(Math.abs(target-ele.offsetTop)<Math.abs(step)){
            ele.style.top = target + "px";
            clearInterval(ele.timer);
        }
    },50);
}