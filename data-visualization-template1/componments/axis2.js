;(function(){

    var Axis = function(opt){

      var that = this;
      that.graph = opt.svg;
      that.width = opt.innerWidth;
      that.height = opt.innerHeight;
      that.padding = opt.padding;
      that.rotate = opt.rotate ? opt.rotate : 0;
      that.isDouble = opt.isDouble ? opt.isDouble : false;
      that.type = opt.type ? opt.type : 'ordinal';
      that.horizontal =  opt.horizontal ? opt.horizontal : false;
      that.rightPercentage = opt.rightPercentage ? opt.rightPercentage : false;

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

        that.xAxisG = that.graph.append('g')
          .attr('class', 'x axis');

        that.yAxisG = that.graph.append('g')
          .attr('class', 'y axis');

        if(!that.horizontal){
          that.xAxisG.attr('transform', 'translate(' + that.padding.left + ',' + (that.height - that.padding.top ) + ')');
          that.yAxisG.attr('transform', 'translate(' + that.padding.left + ',' + that.padding.top + ')');

          if(that.isDouble){
            that.y1AxisG = that.graph.append('g')
              .attr('class', 'y1 axis')
              .attr('transform', 'translate(' + (that.width - that.padding.left) + ',' + that.padding.top + ')');
          }
        }else{
          that.xAxisG.attr('transform', 'translate(' + that.padding.left + ',' + that.padding.top + ')');
          that.yAxisG.attr('transform', 'translate(' + that.padding.left + ',' + (that.height - that.padding.top ) + ')');
        }

        return that;  
      },

      initScale: function(){

        var that = this;

        that.xAxis = d3.svg.axis();
        // that.yAxis = d3.svg.axis().tickFormat(d3.format('.2s')).ticks(4);
        that.yAxis = d3.svg.axis().ticks(4);

        that.xScale = d3.scale.ordinal();
        that.x1Scale = d3.scale.ordinal();
        that.yScale = d3.scale.linear();

        if(!that.horizontal){

          that.xAxis.orient('bottom');
          that.yAxis.orient('left');

          that.yScale.range([that.height - that.padding.top * 2, 0]);

          if(that.type == 'time'){
            
            that.xScale.rangePoints([0, that.width - that.padding.left * 2]);
            that.xAxis.tickSize(-(that.height - that.padding.top * 2));
            that.yAxis.tickFormat(d3.format('.0f')).tickSize(-(that.width - that.padding.left * 2));
          }else{

            that.xScale.rangeRoundBands([0, that.width - that.padding.left * 2 ], .4);
            that.xAxis.tickSize(0);
            that.yAxis.tickFormat(d3.format('.0f')).tickSize(0);
          }
         
          if(that.isDouble){
            that.y1Scale = d3.scale.linear()
              .range([that.height - that.padding.top * 2, 0]);

            if(that.rightPercentage) {
              that.y1Axis = d3.svg.axis()
              // .tickFormat(d3.format('.2s')).ticks(4)
              .tickFormat(d3.format('%'))
              .ticks(4)
              .tickSize(0)
              .orient('right');
            }  else {
              that.y1Axis = d3.svg.axis()
              // .tickFormat(d3.format('.2s')).ticks(4)
              .tickFormat(d3.format('.0f'))
              .ticks(4)
              .tickSize(0)
              .orient('right');
            }
            
          }

        }else{

          that.xScale.rangeRoundBands([0, that.height - that.padding.top * 2 ], .5);
          that.yScale.range([that.width - that.padding.left * 2, 0]);
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

        that.xAxisG.call(that.xAxis);
        that.yAxisG.call(that.yAxis);

        if(!that.horizontal){
          that.xAxisG.selectAll('text').attr('dy', '1.5em')
            .style('transform', 'rotate(' + that.rotate + 'deg)');

          that.yAxisG.selectAll('text').attr('dx', '-0.5em');

          if(that.isDouble){
            that.y1Scale.domain(y1);
            that.y1Axis.scale(that.y1Scale);
            that.y1AxisG.call(that.y1Axis).selectAll('text').attr('dx', '0.5em');
          }else{
            that.yAxisG.selectAll('.tick line')
              .attr('x2', that.width - that.padding.left * 2)
              .style('stroke', 'rgba(255, 255, 255, .5)');
          }
        }
        // else{
        //   that.xAxisG.selectAll('text').attr('dy', '0.5em')
        // }

        return that;
      }

    }

    window.Axis = Axis;
})();