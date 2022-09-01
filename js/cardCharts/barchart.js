class Barchart {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: 700,
            containerHeight: 400,
            yAxisWidth: 50,
            xAxisWidth: 50,
            margin: { top: 30, right: 10, bottom: 30, left: 30 }
        }
        this.data = this.processData(_data)
        this.initVis()
    }

    processData(_data) {
        var formatMonthYear = d3.utcParse("%m-%Y")
        var processedData = []
        var groupedData = d3.rollup(_data, v => v.length, d => d.completionDate.getFullYear(), d => d.completionDate.getMonth())
        groupedData.forEach(function (yearlyData, _currYear) {
            let currYear = _currYear
            yearlyData.forEach(function (monthlyData, currMonth) {
                var monthYear = formatMonthYear(String(currMonth + 1) + "-" + String(currYear))
                var monthlyDataObject = {
                    "monthYear": monthYear,
                    "workItems": monthlyData
                }
                processedData.push(monthlyDataObject)
            }
            )
        }
        )
        return processedData
    }

    initVis() {
        var vis = this

        vis.config.visWidth = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right
        vis.config.visHeight = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom

        vis.xScale = d3.scaleBand()
            .range([0, vis.config.visWidth - vis.config.yAxisWidth])
            .domain(vis.data.map(function(d){return d.monthYear}))
        vis.yScale = d3.scaleLinear()
            .range([0, vis.config.visHeight])
            .domain([d3.max(vis.data, function(d){return d.workItems}), 0])

        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale)
            .tickFormat(d3.timeFormat("%b %Y"))

        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale)
            .ticks(8)

        vis.svg = d3.select(vis.config.parentElement).append('svg')
            .attr("width", vis.config.containerWidth)
            .attr("height", vis.config.containerHeight)

        vis.chart = vis.svg.append('g')
            .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);
        vis.xAxisGroup = vis.chart.append("g")
            .attr("class", "axis x-axis")
            .attr('transform', `translate(0,${vis.config.visHeight})`)
            .call(vis.xAxis)
        vis.yAxisGroup = vis.chart.append("g")
            .attr("class", "axis y-axis")
            .call(vis.yAxis)

        vis.svg.append('text')
            .attr('class', "axis-title")
            .attr("x", 60)
            .attr('y', 15)
            .style("text-anchor", "middle")
            .style("fill", "black")
            .text("# of Work Items");

        vis.updateVis()
    }

    updateVis() {
        var vis = this

        vis.renderVis()
    }

    renderVis(){
        var vis = this

        vis.chart.selectAll(".bar")
            .data(vis.data)
            .join("rect")
                .attr('class', 'bar')
                .attr("fill", "#9695D9")
                .attr("x", d => vis.xScale(d.monthYear))
                .attr("y", d => vis.yScale(d.workItems))
                .attr("height", d => vis.config.visHeight - vis.yScale(d.workItems))
                .attr("width", 50)

    }

}