;(function(){

  /* 坐标轴 by 10
  * graph: 外层svg
  * width: svg宽度
  * height: svg高度
  * padding: 内边距

  * isDouble: 双轴坐标轴， 默认单轴
  * type: X轴起点是否从零开始，默认非零起点
  * horizontal: 水平坐标轴， 默认竖直

  * rotate: X轴文字倾斜角度, 默认0
  * yformat: 左侧Y轴数据格式, 默认.0f
  * y1format: 右侧Y轴数据格式, 默认.0f

  * rangePadding: X轴内部实体间距，默认0.5
  * tickSize: Y轴数值分隔大小，默认分隔4
  * xAxisTextOffsetY: X轴文字向下偏移距离，默认1.2em
  * yAxisTextOffsetX: Y轴文字向右向左偏移距离，默认0.5em

  * hideLine: 隐藏内部坐标轴线，默认不隐藏
  * hideXAxis: 隐藏X轴，默认不隐藏
  * hideYAxis: 隐藏Y轴，默认不隐藏
  */

    var Axis = function(opt){

      var that = this;

      that.graph = opt.svg;
      that.width = opt.innerWidth;
      that.height = opt.innerHeight;
      that.padding = opt.padding;

      that.isDouble = opt.isDouble ? opt.isDouble : false;
      that.type = opt.type ? opt.type : 'ordinal';
      that.horizontal =  opt.horizontal ? opt.horizontal : false;
      
      that.rotate = opt.rotate ? opt.rotate : 0;
      that.yformat = opt.yformat ? opt.yformat : '.0f'; // %, .0f, .2s
      that.y1format = opt.y1format ? opt.y1format : '.0f'; // %, .0f, .2s

      that.rangePadding = opt.rangePadding ? opt.rangePadding : 0.5;
      that.tickSize = opt.tickSize ? opt.tickSize : 4;
      that.xAxisTextOffsetY = opt.xAxisTextOffsetY ? opt.xAxisTextOffsetY : '1.2em';
      that.yAxisTextOffsetX = opt.yAxisTextOffsetX ? opt.yAxisTextOffsetX : '0.5em';

      that.hideLine = opt.hideLine ? opt.hideLine : false;
      that.hideXAxis = opt.hideXAxis ? opt.hideXAxis : false;
      that.hideYAxis = opt.hideYAxis ? opt.hideYAxis : false;

    };

    Axis.prototype = {

      constructor : Axis,

      init : function(opt){

        var that = this; 

        that.initDom();
        that.initScale();

        return that;
      },

      initDom : function () {

        var that = this;

        that.xAxisG = that.graph.append('g').attr('class', 'x axis');
        that.yAxisG = that.graph.append('g').attr('class', 'y axis');

        if(!that.horizontal){

          that.xAxisG.attr('transform', 'translate(' + that.padding.left + ',' + (that.height - that.padding.bottom) + ')');
          that.yAxisG.attr('transform', 'translate(' + that.padding.left + ',' + that.padding.top + ')');

          if(that.isDouble){

            that.y1AxisG = that.graph.append('g').attr('class', 'y1 axis')
                .attr('transform', 'translate(' + (that.width - that.padding.left) + ',' + that.padding.top + ')');
          }
        }else{
          that.xAxisG.attr('transform', 'translate(' + that.padding.left + ',' + that.padding.top + ')');
          that.yAxisG.attr('transform', 'translate(' + that.padding.left + ',' + (that.height - that.padding.top) + ')');
        }

        return that;  
      },

      initScale: function(){

        var that = this;

        that.xAxis = d3.svg.axis();
        that.yAxis = d3.svg.axis()
            .tickFormat(d3.format(that.yformat))
            .ticks(that.tickSize);
        if(that.type == 'time') {
          that.xScale = d3.time.scale();
        } else {
          that.xScale = d3.scale.ordinal();
        }
        that.x1Scale = d3.scale.ordinal();
        that.yScale = d3.scale.linear();

        if(!that.horizontal){

          that.xAxis.orient('bottom');
          that.yAxis.orient('left');

          that.yScale.range([that.height - that.padding.top - that.padding.bottom, 0]);

          if(that.type == 'time'){
            that.xScale
              .range([0, that.width - that.padding.left - that.padding.right]);
            that.xAxis.tickSize(-(that.height - that.padding.top - that.padding.bottom));
            that.yAxis.tickFormat(d3.format(that.yformat))
                .tickSize(-(that.width - that.padding.left - that.padding.right));
          
          }else{

            that.xScale.rangeRoundBands([0, that.width - that.padding.left - that.padding.right ], that.rangePadding);
            that.xAxis.tickSize(0);
            that.yAxis.tickFormat(d3.format(that.yformat)).tickSize(0);
          }
         
          if(that.isDouble){

            that.y1Scale = d3.scale.linear().range([that.height - that.padding.top - that.padding.bottom, 0]);
            that.y1Axis = d3.svg.axis()
                .tickFormat(d3.format(that.y1format))
                .ticks(4)
                .tickSize(0)
                .orient('right');
          }

        }else{

          that.xScale.rangeRoundBands([0, that.height - that.padding.top - that.padding.bottom ], that.rangePadding);
          that.yScale.range([that.width - that.padding.left - that.padding.right, 0]);
          that.xAxis.orient('left').tickSize(0);
          that.yAxis.orient('bottom').tickSize(0);
        }

        return that;
      },

      update : function(x, y, keyNames, y1){

        var that = this;

        that.xScale.domain(x);
        that.yScale.domain(y);

        if(keyNames){
          that.x1Scale.domain(keyNames).rangeRoundBands([0, that.xScale.rangeBand()]);
        }

        that.xAxis.scale(that.xScale);
        that.yAxis.scale(that.yScale);

        if(!that.hideXAxis){
          that.xAxisG.call(that.xAxis);
        }

        if(!that.hideYAxis){
          that.yAxisG.call(that.yAxis);
        }

        if(!that.horizontal){

          that.xAxisG.selectAll('text')
              .attr('dy', that.xAxisTextOffsetY)
              .style('transform', 'rotate(' + that.rotate + 'deg)');

          that.yAxisG.selectAll('text').attr('dx', '-' + that.yAxisTextOffsetX);

          if(that.isDouble){
            that.y1Scale.domain(y1);
            that.y1Axis.scale(that.y1Scale);
            that.y1AxisG.call(that.y1Axis).selectAll('text').attr('dx', that.yAxisTextOffsetX);
          }

          if(!that.hideLine){

            that.yAxisG.selectAll('.tick line')
                .attr('x2', that.width - that.padding.left - that.padding.right)
                .style('stroke', 'rgba(255, 255, 255, 0.5)');
          }
          
        }

        return that;
      }

    }

    window.Axis = Axis;
})();