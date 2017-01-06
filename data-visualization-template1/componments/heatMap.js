;(function(){

  /* 热度图 by cgt 
  * colors: 热度图的颜色数组
  * graph: 画布区域
  * animationTime: 动画时间 
  * cardWidth: 卡片宽度
  * cardHeight: 卡片高度
  * cardRadius: 卡片弧度
  * padding: 内边距
  */
  var HeatMap = function(opt){

    this.colors = opt.colors;
    this.animationTime = opt.animationTime; 
    this.graph = opt.graph;
    this.cardWidth = opt.cardWidth;
    this.cardHeight = opt.cardHeight;
    this.cardRadius = opt.cardRadius;
    this.offset = opt.offset;
    this.padding = opt.padding;
  };

  HeatMap.prototype = {

      constructor: HeatMap,

      bind: function(data) {
        var that = this;

        var minArr = data.map(function(d){
          return d3.min(d.children, function(d){
            return d.value;
          })
        });

        var min = d3.min(minArr, function(d){
          return d;
        });

        var maxArr = data.map(function(d){
          return d3.max(d.children, function(d){
            return d.value;
          })
        });

        var max = d3.max(maxArr, function(d){
          return d;
        });

        that.colorScale = d3.scale.quantile()
            .domain([min, max])
            .range(that.colors);

        that.rowLabels = data.map(function(d){
          return d.row;
        });

        that.colLabels = data[0].children.map(function(d){
          return d.col;
        });

        that.rows = that.graph.selectAll('g.rows').data(data);
        that.aRows = that.graph.selectAll('.rowsLabel').data(that.rowLabels);
        that.aCols = that.graph.selectAll('.colsLabel').data(that.colLabels);
      },

      enter: function() {

        var that = this;

        that.aRows
          .enter()
          .append('text')
          .text(function(d) { return d; })
          .attr('class', 'rowsLabel')
          .attr('text-anchor', 'end')
          .attr('transform', function(d, i) { 
            return 'translate('+ that.padding.left +', '+ (i * (that.cardHeight + that.offset) + that.padding.top + (that.cardHeight + that.offset)/2) +')'; 
          })
          .style('fill', '#fff')
          .style('font-size', '24px');

        that.aCols
          .enter()
          .append('text')
          .text(function(d) { return d; })
          .attr('class', 'colsLabel')
          .attr('text-anchor', 'middle')
          .attr('transform', function(d, i) { 
            return 'translate('+ (i  * (that.cardWidth + that.offset) + that.padding.left + that.offset + that.cardWidth / 2) +', '+ (that.padding.top - that.offset) +')'; 
          })
          .style('fill', '#fff')
          .style('font-size', '24px');

        that.rows
          .enter()
          .append('g')
          .attr('class', 'rows')
          .attr('transform', function(d, i) { 
              return 'translate('+ that.padding.left +', '+ (i * (that.cardHeight + that.offset) + that.padding.top) +')'; 
          })
          .selectAll('rect.cols')
          .data(function(d) {
            return d.children;
          })
          .enter()
          .append('rect')
          .attr('class','cols')
          .attr('x', function(d, i){
            return i * (that.cardWidth + that.offset) + that.offset;
          })
          .attr('rx', that.cardRadius)
          .attr('ry', that.cardRadius)
          .attr('width', that.cardWidth)
          .attr('height', that.cardHeight);
      },
      
      render: function() {
        var that = this;

        that.rows
          .selectAll('rect.cols')
          .data(function(d) {
            return d.children;
          })
          .transition()
          .duration(that.animationTime)
          .style('fill', function(d){
            return that.colorScale(d.value);
          });

      },

      exit: function() {
        var that = this;

        that.rows
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

  window.HeatMap = HeatMap;

})();