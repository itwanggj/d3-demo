;(function(){

  /* 折线图 by cgt 
  * color: 线图的颜色
  * strokeWidth: 线的粗细
  * rectWidth: 点的宽度
  * axis: 绘制的坐标轴 
  * animationTime: 动画时间 
  */
	var Line = function(opt){

    this.color = opt.color;
    this.strokeWidth = opt.strokeWidth;
    this.rectWidth = opt.rectWidth;
    this.axis = opt.axis;
    this.animationTime = opt.animationTime; 
    this.graph = this.axis.graph;

	};

	Line.prototype = {

	    constructor: Line,

      bind: function(data) {
         var that = this;
         that.line = this.graph.selectAll('path.line').data([data]);
         that.dot = this.graph.selectAll('rect.dot').data(data);
      },

      enter: function() {

        var that = this;

        that.line
          .enter()
          .append('path')
          .style('stroke', function(d, i){
            return that.color;
          })
          .style('stroke-width', function(d, i){
            return that.strokeWidth;
          })
          .style('fill', 'none')
          .attr('class', 'line');

        that.dot
          .enter()
          .append('rect')
          .attr('class', 'dot')
          .style('fill', function(d, i){
            return that.color;
          })
          .attr('width', that.rectWidth)
          .attr('height', that.rectWidth);

      },
      
      render: function() {
        var that = this;

        that.lineDraw = d3.svg.line()
          .x(function(d){
            return that.axis.xScale(d.name) + that.axis.padding.left + that.axis.xScale.rangeBand() / 2;
          })
          .y(function(d){
            return that.axis.yScale(d.value) + that.axis.padding.top;
          });

        that.line
          .transition()
          .duration(that.animationTime)
          .ease('linear')
          .attr('d', that.lineDraw);

        that.dot
          .transition()
          .duration(that.animationTime)
          .ease('linear')
          .attr('x', function(d){
            return that.axis.xScale(d.name) + that.axis.padding.left + that.axis.xScale.rangeBand() / 2 - that.rectWidth / 2;
          })
          .attr('y', function(d){
            return that.axis.yScale(d.value) + that.axis.padding.top - that.rectWidth / 2;
          });


      },

      exit: function() {
        var that = this;

        this.line
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

	window.Line = Line;

})();