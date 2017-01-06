;(function(){

  /* 容器 by cgt
  * dom: 外层dom
  * dataUrl: 数据来源url,便于测试，调用getData后会轮询这个数组里的url获取数据
  * padding: 内边距 
  * width: 容器宽度
  * height: 容器高度
  * refreshTime: 刷新时间
  */
	var Container = function(opt){
		  
      this.dom = opt.dom;
      this.dataUrl = opt.dataUrl;
      this.padding = opt.padding;
      this.width = opt.width;
      this.height = opt.height;
      this.refreshTime = opt.refreshTime;
      this.urlIndex = 0;

	};

	Container.prototype = {

	   constructor: Container,
     //初始化容器,建立dom结构
     init: function(){
        var that = this;

        that.dom.style('height', that.height - that.padding.top + 'px').style('padding-top', that.padding.top + 'px');

        that.innerWidth = that.width - that.padding.left - that.padding.right;
        that.innerHeight = that.height - that.padding.top - that.padding.bottom;

        that.legend = that.dom.append('ul').attr('class', 'legend').style('right', that.padding.right * 2 + 'px');

        that.svg = that.dom
          .append('svg')
          .attr('width', that.innerWidth)
          .attr('height', that.innerHeight);

        return that;

     },
     //获取数据
     getData: function(callback){

        var that = this;

        d3.json(that.dataUrl[that.urlIndex], callback);
        that.urlIndex = (that.urlIndex + 1) % that.dataUrl.length;

        setTimeout(function(){
          that.getData(callback);
        }, that.refreshTime);

     }
		
	}

	window.Container = Container;

})();