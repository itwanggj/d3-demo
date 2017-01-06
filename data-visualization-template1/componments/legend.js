;(function(){
  /* 图例 by cgt
  * legend: 图例的外层ul dom
  */
	var Legend = function(opt){
		var that = this;
    that.legend = opt.legend;
	};

	Legend.prototype = {

		constructor: Legend,

    draw: function(items) {
      var that = this;
      that.lis = that.legend.selectAll('li').data(items); 

      that.lis.enter().append('li');  

      that.lis.each(function (d, i){

        var icon = d3.select(this).selectAll('.icon').data([d]);
        var content = d3.select(this).selectAll('.content').data([d]);  

        icon.enter().append('div').attr('class', 'icon');
          
        content.enter().append('div').attr('class', 'content'); 

        icon.style('background-color', function(d){return d.color;});            
        content.text(function (d){ return d.name;}); 

        icon.exit().remove();
        content.exit().remove();

      });

      that.lis.exit().remove();
      return that;
    }

	}

	window.Legend = Legend;

})();