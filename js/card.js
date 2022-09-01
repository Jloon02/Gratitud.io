function donutChart() {

    let workData;
    dateParser = d3.utcParse("%Y-%m-%d");
    d3.csv("../data/RufflesData.csv").then(_workData => {
        workData = _workData;
        workData.forEach(d => {
            d.startDate = dateParser(d.startDate);
            d.completionDate = dateParser(d.completionDate);
            d.completionDays = d.completionDate.getDate() - d.startDate.getDate();
        });

        //donutVis = new DonutVis({parentElement: '#vis'}, workData);
        
        artifactByType = d3.group(workData, d => d.artifactType);

        // get count of each artifactType
        const techDebt = artifactByType.get('technical debt') ? artifactByType.get('technical debt').length : 0;
        const defect = artifactByType.get('defect') ? artifactByType.get('defect').length : 0;
        const stories = artifactByType.get('feature') ? artifactByType.get('feature').length : 0;
        const buildIssue = artifactByType.get('build issue') ? artifactByType.get('build issue').length : 0;
        const ta = artifactByType.get('technical analysis') ? artifactByType.get('technical analysis').length : 0;
        const versionSupport = artifactByType.get('version support') ? artifactByType.get('version support').length : 0;

        const total = workData.length;

        // get percentage of each artifactType
        const techDebtPercentage = Math.floor(techDebt / total * 100);
        const defectPercentage = Math.floor(defect / total * 100);
        const storiesPercentage = Math.floor(stories / total * 100);
        const buildIssuePercentage = Math.floor(buildIssue / total * 100);
        const taPercentage = Math.floor(ta / total * 100);
        const versionSupportPercentage = Math.floor(versionSupport / total * 100);

        const artifactColor = ['#ff7f0e', '#d62728', '#2ca02c', '#7f7f7f', '#17becf', '#e377c2']
        const artifactName = ["Tech_Debt: ", "Defects: ", "Stories: ", "Build_Issues: ", "TAs: ", "Version_Support: "]

        const artifactDataPercentage = [techDebtPercentage, defectPercentage, storiesPercentage, buildIssuePercentage, taPercentage, versionSupportPercentage];
        var artifactNameWithPercentage = []

        artifactName.forEach((num1, index) => {
            const num2 = artifactDataPercentage[index];
            artifactNameWithPercentage[index] = num1.concat(num2);
        }
        )
        artifactNameWithPercentage = artifactNameWithPercentage.map(i => i + '%');

        // create svg element:
        var svg = d3.select("#data").append("svg").attr("width", 1800).attr("height", 400)

        // Add the path using this helper function
        for(var i=0; i<2; i++) {
            for(var j=0; j<3; j++) {
                svg.append('text')
                .attr('x', j*600 + 300)
                .attr('y', i*150 + 100)
                .attr("font-size", 19)
                .attr('stroke', artifactColor[i*3+j])
                .text(artifactNameWithPercentage[i*3+j])
            }
        }

        // set the dimensions and margins of the graph
        var width = 1400
        height = 450
        margin = 40

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        const radius = Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'
        const chart = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        // Create data
        var data = { Tech_Debt: techDebt, Defects: defect, Stories: stories, Build_Issues: buildIssue, TAs: ta, Version_Support: versionSupport }

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
    })
}