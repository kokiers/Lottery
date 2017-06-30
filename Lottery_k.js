/*
 刮刮卡游戏
 2017 by kokier.
*/

function Lottery(id, cover, coverType, width, height) {
    this.conId = id;
    this.conNode = document.getElementById(this.conId);
    this.cover = cover;
    this.coverType = coverType;
    this.background = null;
    this.backCtx = null;
    this.mask = null;
    this.maskCtx = null;
    this.lottery = null;
    this.lotteryType = 'image';
    this.width = width || 300;
    this.height = height || 100;
    this.clientRect = null; 
}
Lottery.prototype = {
    createElement: function (tagName, attributes) {
        var ele = document.createElement(tagName);
        for (var key in attributes) {
            ele.setAttribute(key, attributes[key]);
        }
        return ele;
    },
    getTransparentPercent: function(ctx, width, height) {
        var imgData = ctx.getImageData(0, 0, width, height),
            pixles = imgData.data,
            transPixs = [];
            
        for (var i = 0, j = pixles.length; i < j; i += 4) {
            var a = pixles[i + 3];
            if (a < 128) {
                transPixs.push(i);
            }
        }
        return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
    },
    getcash:function(flag,rel){
        document.getElementById('mymask').style.opacity = 0;
    },
    resizeCanvas: function (canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').clearRect(0, 0, width, height);
    },
    duijiang : function (imei,type,token,user_id) { 
        console.log('duijiang ing')
    },
    drawPoint: function (x, y) {
        var per = this.getTransparentPercent(this.maskCtx, this.width, this.height);       
        if(per<=40){
            this.maskCtx.beginPath();
            var cuxi = 40;
            if(tScale<=2){
                cuxi = 40;
            }else if(tScale>2 && tScale<=3){
                cuxi = 40*1.5;
            }
            else if(tScale>3 ){
                cuxi = 40*2;
            }
            this.maskCtx.arc(x, y, cuxi, 0, Math.PI * 2, true);
            this.maskCtx.fill();
            this.maskCtx.beginPath();
            this.maskCtx.lineWidth = 50;
            this.maskCtx.lineCap = this.maskCtx.lineJoin = 'round';
            if (this.lastPosition) {
                this.maskCtx.moveTo(this.lastPosition[0], this.lastPosition[1]);

            }
            this.maskCtx.lineTo(x, y);
            this.maskCtx.fill();            
            this.lastPosition = [x,y];
        }else if(per>40){//根据刮奖面积大小 结束刮奖
            this.isend = true;
            this.getcash()
        }     
    },
    bindEvent: function () {
        var _this = this;
        var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
        var clickEvtName = device ? 'touchstart' : 'mousedown';
        var moveEvtName = device? 'touchmove': 'mousemove';
        var _top = document.getElementById('lotteryContainer').offsetTop;
        if (!device) {
            var isMouseDown = false;
            document.addEventListener('mouseup', function(e) {
                isMouseDown = false;
            }, false);
        } else {
            document.addEventListener("touchmove", function(e) {
                if (isMouseDown) {
                    e.preventDefault();
                }
            }, false);
            document.addEventListener('touchend', function(e) {
                isMouseDown = false;
            }, false);
        }
        this.mask.addEventListener(clickEvtName, function (e) {
            isMouseDown = true;
            var docEle = document.documentElement;
            
            if (!_this.clientRect) {
                _this.clientRect = {
                    left: 0,
                    top:0
                };
            }
            var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
            var y = (device ? (e.touches[0].pageY  - _top) : (e.clientY -  _this.clientRect.top))+ docEle.scrollTop - docEle.clientTop;

            _this.drawPoint(x*_this.tScale, y*_this.tScale);            
        }, false);

        this.mask.addEventListener(moveEvtName, function (e) {
            if (!device && !isMouseDown) {
                return false;
            }
            var docEle = document.documentElement;
           
            if (!_this.clientRect) {
                _this.clientRect = {
                    left: 0,
                    top:0
                };
            }
            
            var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
           
            var y = (device ? (e.touches[0].pageY - _top ): (e.clientY-  _this.clientRect.top))+ docEle.scrollTop - docEle.clientTop;

            _this.drawPoint(x*_this.tScale, y*_this.tScale);
        }, false);
    },
    drawLottery: function () {
        this.background = this.background || this.createElement('canvas', { 
            style: 'position:absolute;left:0;top:0;',  
        });
        this.mask = this.mask || this.createElement('canvas', {
            style: 'position:absolute;left:0;top:0;',
        });
        this.background.setAttribute("id","mydiv");
        this.mask.setAttribute("id","mymask");
        this.mask.innerHTML='您的浏览器版本不支持刮刮游戏';
        
        if (!this.conNode.innerHTML.replace(/[\w\W]| /g, '')) {
            this.conNode.appendChild(this.background);
            this.conNode.appendChild(this.mask);
            this.clientRect = this.conNode ? this.conNode.getBoundingClientRect() : null;
            this.bindEvent();
        }

        this.backCtx = this.backCtx || this.background.getContext('2d');
        this.maskCtx = this.maskCtx || this.mask.getContext('2d');

        var thatw = this.width,
            thath = this.height;            
        if (this.lotteryType == 'image') {//刮开图片
            var image = new Image(),
                _this = this;               
            image.onload = function () {
                _this.width = thatw;
                _this.height = thath;
                _this.resizeCanvas(_this.background, thatw, thath);                
                _this.backCtx.drawImage(this, 0.258*thatw,0.228*thath,0.187*thatw,0.187*thatw); 
                _this.backCtx.font=15*_this.tScale+"px  microsoft yahei";
                _this.backCtx.fillStyle = "#6c3d2b";
                if(_this.is_need==1){
                    var istxt ='获得一等奖';
                }else{
                    var istxt ='很遗憾未中奖';
                }
                _this.backCtx.fillText(istxt,0.517*thatw,0.4*thath);
                _this.backCtx.font='bold '+18*_this.tScale+"px microsoft yahei";
                _this.backCtx.fillStyle = "#6c3d2b";
                _this.backCtx.fillText(_this.txt,0.517*thatw,0.66*thath);
                _this.drawMask();
            }
            image.src = this.lottery;  


        }else if (this.lotteryType == 'text') {//刮开文字
            this.width = thatw;
            this.height = thath;
            this.resizeCanvas(this.background, thatw, thath);
            if(this.type=='getbouns' ||this.type=='is_cash'){
                this.backCtx.font='bold '+16*this.tScale+"px microsoft yahei";
                this.backCtx.fillStyle = "#ffdf61";
                var text = "恭喜获得"+this.lottery+'元';
                this.backCtx.textBaseline = 'middle'; 
                this.backCtx.textAlign = 'center';
                this.backCtx.fillText(text,0.5*thatw,0.4*thath);
                this.backCtx.font='bold '+14*this.tScale+"px microsoft yahei";
                this.backCtx.fillStyle = "#ffdf61";
                this.backCtx.textBaseline = 'middle'; 
                this.backCtx.textAlign = 'center';
                this.backCtx.fillText('已存入您的钱包',0.5*thatw,0.66*thath);
            } else if (this.type=='getcredit' || this.type=='is_getcredit'){
                this.backCtx.font='bold '+14*this.tScale+"px microsoft yahei";
                this.backCtx.fillStyle = "#6c3d2b";
                this.backCtx.textBaseline = 'middle'; 
                this.backCtx.textAlign = 'center';
                this.backCtx.fillText(this.lottery,0.5*thatw,0.5*thath);
            } else{
                this.backCtx.font='bold '+14*this.tScale+"px microsoft yahei";
                this.backCtx.fillStyle = "#6c3d2b";
                this.backCtx.textBaseline = 'middle'; 
                this.backCtx.textAlign = 'center';
                this.backCtx.fillText(this.lottery,0.5*thatw,0.5*thath);
            }            
            this.drawMask();
        }
    },
    drawMask: function() {//背景
        this.resizeCanvas(this.mask, this.width, this.height);
        var thatw=this.width;
        var thath=this.height;
        if (this.coverType == 'color') { 
            this.maskCtx.fillStyle = this.cover;
            this.maskCtx.fillRect(0, 0, this.width, this.height);  
            this.maskCtx.fill();
            this.maskCtx.globalCompositeOperation = 'destination-out';           
        } else if (this.coverType == 'image'){
            var image = new Image(),
                _this = this;
            image.onload = function () {
                _this.maskCtx.drawImage(this, 0, 0,thatw, thath);
              if(_this.uptext && (_this.type=='getitem')){
                    _this.maskCtx.font='bold '+14*_this.tScale+"px microsoft yahei";
                    _this.maskCtx.fillStyle = "#6c3d2b";
                    _this.maskCtx.textBaseline = 'middle'; 
                    _this.maskCtx.textAlign = 'center';
                    _this.maskCtx.fillText(_this.uptext,0.5*thatw,0.5*thath);  
                }                
                _this.maskCtx.globalCompositeOperation = 'destination-out';
            }
            image.src = this.cover; 

        }
    },
    init: function (lottery, lotteryType) {
        this.lottery = lottery;
        this.lotteryType = lotteryType || 'image';
        this.drawLottery(); 
    }
}