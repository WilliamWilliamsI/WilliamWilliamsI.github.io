/* 展示指数视图 */
function Index_K_Graph(path, name)
{
    d3.select("body").append("svg").attr("id", "mainBoard").attr("width", 1500).attr("height", 550);
    // 配置SVG
    const svg = d3.select("svg#mainBoard").style("background", "white");
    const width = svg.attr("width");
    const height = svg.attr("height");
    const margin = {top: 60, right:50, bottom:60, left:80};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const mainGroup = svg.append("g").attr(`transform`, `translate(${margin.left}, ${margin.top})`);

    // 设置标题
    const title = mainGroup.append("text").attr("class", "title")
        .text(name +" 日 K 线")
        .attr("x", innerWidth/2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .attr("font-size", "2.5em");

    d3.csv(path).then(data=>
    {
        console.log(data);
        data.forEach(d=>{
            d["Open"] = +d["Idxtrd02"];   // 开盘价
            d["High"] = +d["Idxtrd03"];    // 最高价
            d["Low"] = +d["Idxtrd04"];     // 最低价
            d["Close"] = +d["Idxtrd05"];   // 收盘价
            d["Date"] = new Date(d["Idxtrd01"]);  // 日期
            d["Color"] = d["Open"] > d["Close"] ? "green" : "red";
        });
        data = data.slice(60)

        // 设置横纵轴映射关系
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d=>d["Date"]))
            .range([0, innerWidth]).nice();
        const yScale = d3.scaleLinear()
            .domain([d3.min(data, d=>d["Low"]), d3.max(data, d=>d["High"])])
            .range([innerHeight, 0]).nice();
        // 设置坐标轴
        const timeFormat = d3.timeFormat("%B-%d")
        const xAxis = d3.axisBottom(xScale).tickFormat(timeFormat).ticks(15);
        const yAxis = d3.axisLeft(yScale);
        const xAxisGroup = mainGroup.append('g').call(xAxis);
        const yAxisGroup = mainGroup.append('g').call(yAxis);
        d3.selectAll('.tick text').attr('font-size', '1.5em');
        xAxisGroup.append('text').attr('class', 'axisTitle');
        yAxisGroup.append('text').attr('class', 'axisTitle').attr('transform', 'rotate(-90)');
        xAxisGroup.attr('transform', `translate(${0}, ${innerHeight})`);
        d3.selectAll('.axisTitle').attr('text-anchor', "middle").attr('fill', 'black').attr('font-size', '2em');

        // 设置鼠标交叉线
        let cursorX = svg.append("line").attr("class", "CursorX");
        let cursorY = svg.append("line").attr("class", "CursorY");

        // 随鼠标移动的交叉线
        svg.on("mousemove", function(event, d)
        {
            let pt = d3.pointer(event, "svg");
            cursorX.attr("y1", pt[1] - 90)
                .attr("y2", pt[1] - 90)
                .attr("x1", 0)
                .attr("x2", innerWidth+margin.right)
                .attr("stroke-width", 1)
                .attr("stroke", "dimgray")
            cursorY.attr("y1", innerHeight+margin.top)
                .attr("y2", margin.top)
                .attr("x1", pt[0]-5)
                .attr("x2", pt[0]-5)
                .attr("stroke-width", 1)
                .attr("stroke", "dimgray")
        });

        // 绘制箱体
        let stacks = mainGroup.selectAll("rect.StackBlock")
            .data(data).join("rect")
            .attr("class", "StackBlock")
            .attr("x", d=>xScale(d["Date"])-9)
            .attr("y", d=>Math.min(yScale(d["Open"]), yScale(d["Close"])))
            .attr("height", d=>Math.abs(yScale(d["Open"]) - yScale(d["Close"])) )
            .attr("width", 15)
            .attr("fill", d=>d["Color"])
        // .attr("visibility", "hidden")

        // 绘制胡须
        let lines = mainGroup.selectAll("line.StackLine")
            .data(data).join("line")
            .attr("class", "StackLine")
            .attr("x1", d=>xScale(d["Date"]))
            .attr("x2", d=>xScale(d["Date"]))
            .attr("y1", d=>yScale(d["High"]))
            .attr("y2", d=>yScale(d["Low"]))
            .attr("stroke", d=>d["Color"])
            .attr("stroke-line", 2)

        // 设置标签
        const tip = d3.tip().html((event, d) =>
            `时间: ${d.Idxtrd01} </p>
            证券代码: 沪深300 </p>
            开盘: ${d.Open} </p>
            收盘: ${d.Close} </p>
            最高: ${d.High} </p>
            最低: ${d.Low} </p>
            成交量: ${d.Idxtrd06} </p>
            成交额: ${d.Idxtrd07} </p>
            回报率: ${d.Idxtrd08}`
        );
        tip.attr('class', 'd3-tip');
        mainGroup.call(tip);


        // 设置动作事件
        stacks.on("mouseover", function (event, d)
        {
            d3.select(this).attr("stroke-width", 3).attr("stroke", "black")
            if(d3.select(this).attr("x") < innerWidth/2)
                tip.direction("e");
            else
                tip.direction("w");
            tip.show(event, d);
        });
        stacks.on("mouseout", function (event, d)
        {
            d3.select(this).attr("stroke-width", 0).attr("stroke", svg.attr("background"));
            tip.hide(event, d);
        });
    });
}