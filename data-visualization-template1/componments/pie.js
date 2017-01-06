;(function(){

  /* 饼图 by cgt 
  * colors: 颜色数组
  * animationTime: 动画时间 
  * graph: 绘制画布
  */
	var Pie = function(opt){

    this.colors = opt.colors;
    this.animationTime = opt.animationTime; 
    this.graph = opt.graph;
    this.outerRadius = opt.outerRadius;
    this.innerRadius = opt.innerRadius;

    this.endAngle = 2 * Math.PI

	};

	Pie.prototype = {

	    constructor: Pie,

      dataFormat: function(data) {

        var that = this;
        var startAngle = 0;

        var sum = d3.sum(data, function (d){
          return +d.value;
        }); 

        var pieData = data.map(function (d, i){
          var rate = (+d.value / sum);
          var o = {
            startAngle: startAngle,
            endAngle: startAngle + rate * that.endAngle,
            outerRadius: that.outerRadius,
            innerRadius: that.innerRadius,
            value: +d.value
          }

          startAngle = o.endAngle;
          return o;
        }); 

        return pieData;

      },

      bind: function(data) {
         var that = this;

         that.slices = that.graph.selectAll('path.arc').data(that.dataFormat(data));

      },

      enter: function() {

        var that = this;
        console.log(that.graph[0][0].clientWidth / 2, that.graph[0][0].clientHeight / 2);
        that.slices
          .enter()
          .append('path')
          .attr('class', 'arc')
          .style('fill', function (d, i) { return that.colors[i]; })
          .attr('transform', 'translate(' + that.graph[0][0].clientWidth / 2 + ',' + that.graph[0][0].clientHeight / 2 + ')');

      },
      
      render: function() {
        var that = this;

        that.arc = d3.svg.arc();

        that.slices
          .transition()
          .duration(that.animationTime)
          .attrTween('d', function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);

            return function (t) {
                return that.arc(interpolate(t));
            };
          });

      },

      exit: function() {
        var that = this;

        that.slices
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

	window.Pie = Pie;

})();