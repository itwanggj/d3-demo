;(function(){

  /* 区域图 by cgt 
  * color: 线图的颜色
  * opacity: 透明度
  * axis: 绘制的坐标轴 
  * animationTime: 动画时间 
  */
	var Area = function(opt){

    this.color = opt.color;
    this.opacity = opt.opacity;
    this.axis = opt.axis;
    this.animationTime = opt.animationTime; 
    this.graph = this.axis.graph;

	};

	Area.prototype = {

	    constructor: Area,

      bind: function(data) {
         var that = this;
         that.area = that.graph.selectAll('path.area').data([data]);

      },

      enter: function() {
        var that = this;

        that.area
          .enter()
          .append('path')
          .attr('class', 'area')
          .style('opacity', that.opacity)
          .style('fill', function(d){
            return that.color;
          });

      },
      
      render: function() {
        var that = this;

        that.areaDraw = d3.svg.area()
          .interpolate('cardinal')
          .x(function(d){
            return that.axis.xScale(d.name) + that.axis.padding.left;
          })
          .y0(that.axis.yScale(0) + that.axis.padding.top)
          .y1(function(d){
            return that.axis.yScale(d.value) + that.axis.padding.top;
          }); 

        that.area
          .transition()
          .duration(that.animationTime)
          .ease('linear')
          .attr('d', that.areaDraw);


      },

      exit: function() {
        var that = this;

        that.area
          .exit()
          .remove();
      },

      draw: function(data) {
        var that = this;
        that.bind(data);
        that.enter();
        that.render();
        that.exit();
      } 
		
	}

	window.Area = Area;

})();