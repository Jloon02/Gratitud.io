class DonutVis {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            graphWidth: 1400,
            graphHeight: 450,
            graphMargin: 40,
            cellWidth: 1500,
            cellHeight: 400,
        }
        this.workData = _data;
        this.initVis();
    }

    /**
     * We initialize scales/axes and append static elements, such as axis titles.
     */
    initVis() {
        let vis = this;
        let artifactByType = d3.group(vis.workData, d => d.artifactType);
        vis.artifactCountArr(artifactByType);

    }

    artifactCountArr(artifactByType) {
        let vis = this;

        // get count of each artifactType
        const techDebt = artifactByType.get('technical debt') ? artifactByType.get('technical debt').length : 0;
        const defect = artifactByType.get('defect') ? artifactByType.get('defect').length : 0;
        const stories = artifactByType.get('feature') ? artifactByType.get('feature').length : 0;
        const buildIssue = artifactByType.get('build issue') ? artifactByType.get('build issue').length : 0;
        const ta = artifactByType.get('technical analysis') ? artifactByType.get('technical analysis').length : 0;
        const versionSupport = artifactByType.get('version support') ? artifactByType.get('version support').length : 0;

        const artifactData = [techDebt, defect, stories, buildIssue, ta, versionSupport]

        const total = vis.workData.length;

        // get percentage of each artifactType
        const techDebtPercentage = Math.floor(techDebt / total * 100);
        const defectPercentage = Math.floor(defect / total * 100);
        const storiesPercentage = Math.floor(stories / total * 100);
        const buildIssuePercentage = Math.floor(buildIssue / total * 100);
        const taPercentage = Math.floor(ta / total * 100);
        const versionSupportPercentage = Math.floor(versionSupport / total * 100);

        const artifactColor = ['#ff7f0e', '#d62728', '#2ca02c', '#7f7f7f', '#17becf', '#e377c2']
        const artifactName = ["Tech_Debt: ", "Defects: ", "Stories: ", "Build_Issues: ", "TAs: ", "Version_Support: "]

        const artifactDataPercentage = [techDebtPercentage, defectPercentage, storiesPercentage,
            buildIssuePercentage, taPercentage, versionSupportPercentage];
        var artifactNameWithPercentage = []

        artifactName.forEach((num1, index) => {
            const num2 = artifactDataPercentage[index];
            artifactNameWithPercentage[index] = num1.concat(num2);
        }
        )

        // Label with # of artifacts
        artifactNameWithPercentage = artifactNameWithPercentage.map(i => i + '%');
        for(var i=0; i<6; i++) {
            artifactNameWithPercentage[i] = artifactNameWithPercentage[i] + ' - ' + artifactData[i] +  ' Ticket(s)';
        }

        vis.createTextBoxes(artifactColor, artifactNameWithPercentage);
        vis.createDonutGraph(artifactColor, artifactName, artifactData)
    }



    createTextBoxes(artifactColor, artifactNameWithPercentage) {
        // create svg element:
        var svg = d3.select("#data").append("svg").attr("width", this.config.cellWidth).attr("height", this.config.cellHeight)

        // Add the path using this helper function
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 3; j++) {
                svg.append('text')
                    .attr('x', j * 550 + 50)
                    .attr('y', i * 100 + 125)
                    .attr("font-size", 19)
                    .attr('stroke', artifactColor[i * 3 + j])
                    .text(artifactNameWithPercentage[i * 3 + j])
            }
        }
    }

    createDonutGraph(artifactColor, artifactName, artifactData) {
        // set the dimensions and margins of the graph
        var width = this.config.graphWidth
        var height = this.config.graphHeight
        var margin = this.config.graphMargin

        // The radius of the pieplot
        const radius = Math.min(width, height) / 2 - margin

        const chart = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Create data
        var data = {
            Tech_Debt: artifactData[0], Defects: artifactData[1],
            Stories: artifactData[2], Build_Issues: artifactData[3], TAs: artifactData[4],
            Version_Support: artifactData[5]
        }

        // set the color scale
        var color = d3.scaleOrdinal()
            .domain(artifactName)
            .range(artifactColor);

        // Compute the position of each group on the pie:
        const pie = d3.pie()
            .sort(null) // Do not sort group by size
            .value(d => d[1])
        const data_ready = pie(Object.entries(data))

        // The arc generator
        const arc = d3.arc()
            .innerRadius(radius * 0.5)         // This is the size of the donut hole
            .outerRadius(radius * 0.8)

        // Another arc that won't be drawn. Just for labels positioning
        const outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9)

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        chart
            .selectAll('allSlices')
            .data(data_ready)
            .join('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data[0]))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)

        // Add the polylines between chart and labels:
        chart
            .selectAll('allPolylines')
            .data(data_ready)
            .join('polyline')
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function (d) {
                const posA = arc.centroid(d) // line insertion in the slice
                const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                const posC = outerArc.centroid(d); // Label position = almost the same as posB
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC]
            })

        // Add the polylines between chart and labels:
        chart
            .selectAll('allLabels')
            .data(data_ready)
            .join('text')
            .text(d => d.data[0])
            .attr('transform', function (d) {
                const pos = outerArc.centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .style('text-anchor', function (d) {
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
    }

}