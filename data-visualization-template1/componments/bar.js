;(function(){

  /* 柱形图 by cgt
  * color: 柱形图颜色
  * axis: 绘制的坐标轴 
  * animationTime: 动画时间 
  */
	var Bar = function(opt){

    this.color = opt.color;
    this.axis = opt.axis;
    this.animationTime = opt.animationTime;
    this.graph = this.axis.graph;

	};

	Bar.prototype = {

	    constructor: Bar,

      bind: function(data) {
         var that = this;
         that.rect = that.graph.selectAll('rect').data(data);
      },

      enter: function() {

        var that = this;
        that.rect
          .enter()
          .append('rect')
          .attr("class", "rect")
          .style("fill", function(d, i){
            return that.color;
          });

      },
      
      render: function() {
        var that = this;

        that.rect
          .transition()
          .duration(that.animationTime)
          .attr('x', function(d, i) {
            return that.axis.xScale(d.name) + that.axis.padding.left;
          })
          .attr('y', function(d, i) {
            return that.axis.yScale(d.value) + that.axis.padding.top;
          })  
          .attr('width', that.axis.xScale.rangeBand())
          .attr('height', function(d, i){  
            // return that.axis.height - that.axis.yScale(d.value) - that.axis.padding.top * 2;
            return that.axis.height - that.axis.yScale(d.value) - that.axis.padding.top - that.axis.padding.bottom;
          });
      },

      exit: function() {
        var that = this;

        that.rect
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

	window.Bar = Bar;

})();