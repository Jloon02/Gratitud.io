let workData;
dateParser = d3.utcParse("%Y-%m-%d");
d3.csv("../data/RufflesData.csv").then(_workData => {
    workData = _workData;
    workData.forEach(d => {
        d.startDate = dateParser(d.startDate);
        d.completionDate = dateParser(d.completionDate); 
        d.completionDays = d.completionDate.getDate() - d.startDate.getDate();
    })
})