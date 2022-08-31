let workData
dateParser = d3.utcParse("%Y-%m-%d")
d3.csv("../data/RufflesData.csv").then(_workData => {
    workData = _workData
    workData.forEach(d => {
        d.startDate = dateParser(d.startDate)
        d.completionDate = dateParser(d.completionDate)
        d.completionDays = Math.abs(d.completionDate - d.startDate)/(1000 * 3600 * 24)
        d.completionMonth = d.completionDate.getMonth()
    })
})

scrollerVis = new Barchart({parentElement: "#barchart"}, workData);