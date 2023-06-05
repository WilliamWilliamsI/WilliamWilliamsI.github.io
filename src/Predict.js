function Predict()
{
    const div = d3.select("body").append("div").attr("id", "select-div").attr("display", "inline-block");

    let divEle = document.getElementById("select-div");
    divEle.innerHTML = "股 票 列 表 &nbsp";
    divEle.style.fontSize = "20px";
    divEle.style.margin = "10px 10px 10px 100px";
    d3.csv("../data/stockListHuShen300.csv").then(data=>
    {
        // let stockList = Array.from(new Set(data.map(d=>d["Stkcd"])));
        let stockList = data.map(d=>d["Stkcd"]);
        stockList = stockList.sort();
        let select = document.createElement("select");
        select.id = "select"
        select.style.width = "200px";
        select.style.height = "30px";
        for(let i=0; i<stockList.length; i++)
        {
            let option = document.createElement("option");
            option.value = stockList[i];
            option.innerHTML = stockList[i];
            select.appendChild(option);
        }
        divEle.appendChild(select);
        document.getElementById('select').onchange = function () {
            d3.select("svg#mainBoard").remove();
            let select = document.getElementById('select');
            let stockSelected = select.value;
            d3.select("svg#MACD").remove();
            d3.select("svg#DMI").remove();
            d3.select("svg#KDJ").remove();
            d3.select("svg#BIAS").remove();
            d3.select("span#title").remove();
            Indicator_Line(stockSelected)
        }
    });
}

function Indicator_Line(stockSelected)
{
    const MACD_SVG = d3.select("body").append("svg").attr("id", "MACD").attr("width", 1500).attr("height", 130);
    const DMI_SVG = d3.select("body").append("svg").attr("id", "DMI").attr("width", 1500).attr("height", 130);
    const KDJ_SVG = d3.select("body").append("svg").attr("id", "KDJ").attr("width", 1500).attr("height", 130);
    const BIAS_SVG = d3.select("body").append("svg").attr("id", "BIAS").attr("width", 1500).attr("height", 130);
    const margin = {top: 40, right:50, bottom:20, left:100};
    const innerHeight = MACD_SVG.attr("height") - margin.top - margin.bottom;
    const innerWidth = MACD_SVG.attr("width") - margin.left - margin.right;

    const MACD_MainGroup = MACD_SVG.append("g").attr(`transform`, `translate(${margin.left}, ${margin.top})`);
    const DMI_MainGroup = DMI_SVG.append("g").attr(`transform`, `translate(${margin.left}, ${margin.top})`);
    const KDJ_MainGroup = KDJ_SVG.append("g").attr(`transform`, `translate(${margin.left}, ${margin.top})`);
    const BIAS_MainGroup = BIAS_SVG.append("g").attr(`transform`, `translate(${margin.left}, ${margin.top})`);

    d3.csv("../data/Indicator" + stockSelected + ".csv").then(data=>
    {
        data.forEach(d=>{
            d["Date"] = new Date(d["Date"]);
            d["MACD_DIF"] = +d["MACD_DIF"];
            d["MACD_DEA"] = +d["MACD_DEA"];
            d["MACD_MACD"] = +d["MACD_MACD"];
            d["DMI_ADX"] = +d["DMI_ADX"];
            d["DMI_ADXR"] = +d["DMI_ADXR"];
            d["PSY_PSY"] = +d["PSY_PSY"];
            d["PSY_PSYMA"] = +d["PSY_PSYMA"];
            d["KDJ_K"] = +d["KDJ_K"];
            d["KDJ_D"] = +d["KDJ_D"];
            d["KDJ_J"] = +d["KDJ_J"];
            d["BOLL_Mid"] = +d["BOLL_Mid"];
            d["BOLL_Top"] = +d["BOLL_Top"];
            d["BOLL_Bottom"] = +d["BOLL_Bottom"];
            d["BIAS_BIAS1"] = +d["BIAS_BIAS1"];
            d["BIAS_BIAS2"] = +d["BIAS_BIAS2"];
            d["BIAS_BIAS3"] = +d["BIAS_BIAS3"];
            d["VR_VR"] = +d["VR_VR"];
            d["ARBR_AR"] = +d["ARBR_AR"];
            d["ARBR_BR"] = +d["ARBR_BR"];
            d["ROC_ROC"] = +d["ROC_ROC"];
            d["ROC_MAROC"] = +d["ROC_MAROC"];
            d["MTM_MTM"] = +d["MTM_MTM"];
            d["MTM_MTMMA"] = +d["MTM_MTMMA"];
        })
        // 设置映射关系
        const xScale = d3.scaleTime().domain(d3.extent(data, d=>d["Date"])).range([0, innerWidth]).nice();
        const yScale = d3.scaleLinear()
            .domain([Math.min(d3.min(data.map(d=>d["MACD_DEA"])), d3.min(data.map(d=>d["MACD_MACD"])), d3.min(data.map(d=>d["MACD_DIF"]))),
                Math.max(d3.max(data.map(d=>d["MACD_DEA"])), d3.max(data.map(d=>d["MACD_MACD"])), d3.max(data.map(d=>d["MACD_DIF"])))])
            .range([innerHeight, 0]);
        // 设置坐标轴
        const timeFormat = d3.timeFormat("%B-%d")
        const xAxis = d3.axisBottom(xScale).tickFormat(timeFormat).ticks(15);
        const yAxis = d3.axisLeft(yScale).ticks(3);
        const xAxisGroup = MACD_MainGroup.append('g').call(xAxis);
        const yAxisGroup = MACD_MainGroup.append('g').call(yAxis);
        d3.selectAll('.tick text').attr('font-size', '1.5em');
        xAxisGroup.append('text').attr('class', 'axisTitle');
        yAxisGroup.append('text').attr('class', 'axisTitle').attr('transform', 'rotate(-90)');
        xAxisGroup.attr('transform', `translate(${0}, ${innerHeight})`);
        d3.selectAll('.axisTitle').attr('text-anchor', "middle").attr('fill', 'black').attr('font-size', '2em');
        // 绘图
        const MACD_MACD_Path = d3.line().x(d=>xScale(d["Date"])).y(d=>yScale(d["MACD_MACD"]));
        const MACD_DIF_Path = d3.line().x(d=>xScale(d["Date"])).y(d=>yScale(d["MACD_DIF"]));
        const MACD_DEA_Path = d3.line().x(d=>xScale(d["Date"])).y(d=>yScale(d["MACD_DEA"]));
        MACD_MainGroup.append("path").datum(data).attr("stroke", "steelblue").attr("fill", "none").attr("d", MACD_MACD_Path).attr("stroke-width", 2);
        MACD_MainGroup.append("path").datum(data).attr("stroke", "indianred").attr("fill", "none").attr("d", MACD_DIF_Path).attr("stroke-width", 2);
        MACD_MainGroup.append("path").datum(data).attr("stroke", "forestgreen").attr("fill", "none").attr("d", MACD_DEA_Path).attr("stroke-width", 2)
        // 加标签
        MACD_MainGroup.append("text").attr("id", "MACD_MACD-text").attr("x", innerWidth-500).attr("y", -10).text("MACD-MACD").attr("text-anchor", "left")
        MACD_MainGroup.append("text").attr("id", "MACD_DIF-text").attr("x", innerWidth-300).attr("y", -10).text("MACD-DIF").attr("text-anchor", "left")
        MACD_MainGroup.append("text").attr("id", "MACD_DEA-text").attr("x", innerWidth-100).attr("y", -10).text("MACD-DEA").attr("text-anchor", "left")
        MACD_MainGroup.append("rect").attr("id", "MACD_MACD-line").attr("x", innerWidth-560).attr("y", -17).attr("height", 3).attr("width", 50).attr("fill", "steelblue")
        MACD_MainGroup.append("rect").attr("id", "MACD_DIF-line").attr("x", innerWidth-360).attr("y", -17).attr("height", 3).attr("width", 50).attr("fill", "indianred")
        MACD_MainGroup.append("rect").attr("id", "MACD_DEA-line").attr("x", innerWidth-160).attr("y", -17).attr("height", 3).attr("width", 50).attr("fill", "forestgreen")



        // 设置映射关系
        const xScale2 = d3.scaleTime().domain(d3.extent(data, d=>d["Date"])).range([0, innerWidth]).nice();
        const yScale2 = d3.scaleLinear()
            .domain([Math.min(d3.min(data.map(d=>d["DMI_ADX"])), d3.min(data.map(d=>d["DMI_ADXR"]))),
                Math.max(d3.max(data.map(d=>d["DMI_ADX"])), d3.max(data.map(d=>d["DMI_ADXR"])))])
            .range([innerHeight, 0]);
        // 设置坐标轴
        const timeFormat2 = d3.timeFormat("%B-%d")
        const xAxis2 = d3.axisBottom(xScale2).tickFormat(timeFormat2).ticks(15);
        const yAxis2 = d3.axisLeft(yScale2).ticks(3);
        const xAxisGroup2 = DMI_MainGroup.append('g').call(xAxis2);
        const yAxisGroup2 = DMI_MainGroup.append('g').call(yAxis2);
        d3.selectAll('.tick text').attr('font-size', '1.5em');
        xAxisGroup2.append('text').attr('class', 'axisTitle');
        yAxisGroup2.append('text').attr('class', 'axisTitle').attr('transform', 'rotate(-90)');
        xAxisGroup2.attr('transform', `translate(${0}, ${innerHeight})`);
        d3.selectAll('.axisTitle').attr('text-anchor', "middle").attr('fill', 'black').attr('font-size', '2em');
        // 绘图
        const DMI_ADX_Path = d3.line().x(d=>xScale2(d["Date"])).y(d=>yScale2(d["DMI_ADX"]));
        const DMI_ADXR_Path = d3.line().x(d=>xScale2(d["Date"])).y(d=>yScale2(d["DMI_ADXR"]));
        DMI_MainGroup.append("path").datum(data).attr("stroke", "indianred").attr("fill", "none").attr("d", DMI_ADX_Path).attr("stroke-width", 2);
        DMI_MainGroup.append("path").datum(data).attr("stroke", "steelblue").attr("fill", "none").attr("d", DMI_ADXR_Path).attr("stroke-width", 2);
        // 加标签
        DMI_MainGroup.append("text").attr("id", "DMI_ADX-text").attr("x", innerWidth-300).attr("y", -10).text("DMI-ADX").attr("text-anchor", "left")
        DMI_MainGroup.append("text").attr("id", "DMI_ADXR-text").attr("x", innerWidth-100).attr("y", -10).text("DMI-ADXR").attr("text-anchor", "left")
        DMI_MainGroup.append("rect").attr("id", "DMI_ADX-line").attr("x", innerWidth-360).attr("y", -17).attr("height", 3).attr("width", 50).attr("fill", "steelblue")
        DMI_MainGroup.append("rect").attr("id", "DMI_ADXR-line").attr("x", innerWidth-160).attr("y", -17).attr("height", 3).attr("width", 50).attr("fill", "indianred")



        // 设置映射关系
        const xScale3 = d3.scaleTime().domain(d3.extent(data, d=>d["Date"])).range([0, innerWidth]).nice();
        const yScale3 = d3.scaleLinear()
            .domain([Math.min(d3.min(data.map(d=>d["KDJ_K"])), d3.min(data.map(d=>d["KDJ_D"])), d3.min(data.map(d=>d["KDJ_J"]))),
                Math.max(d3.max(data.map(d=>d["KDJ_K"])), d3.max(data.map(d=>d["KDJ_D"])), d3.max(data.map(d=>d["KDJ_J"])))])
            .range([innerHeight, 0]);
        // 设置坐标轴
        const timeFormat3 = d3.timeFormat("%B-%d")
        const xAxis3 = d3.axisBottom(xScale3).tickFormat(timeFormat3).ticks(15);
        const yAxis3 = d3.axisLeft(yScale3).ticks(3);
        const xAxisGroup3 = KDJ_MainGroup.append('g').call(xAxis3);
        const yAxisGroup3 = KDJ_MainGroup.append('g').call(yAxis3);
        d3.selectAll('.tick text').attr('font-size', '1.5em');
        xAxisGroup3.append('text').attr('class', 'axisTitle');
        yAxisGroup3.append('text').attr('class', 'axisTitle').attr('transform', 'rotate(-90)');
        xAxisGroup3.attr('transform', `translate(${0}, ${innerHeight})`);
        d3.selectAll('.axisTitle').attr('text-anchor', "middle").attr('fill', 'black').attr('font-size', '2em');
        // 绘图
        const KDJ_K_Path = d3.line().x(d=>xScale3(d["Date"])).y(d=>yScale3(d["KDJ_K"]));
        const KDJ_D_Path = d3.line().x(d=>xScale3(d["Date"])).y(d=>yScale3(d["KDJ_D"]));
        const KDJ_J_Path = d3.line().x(d=>xScale3(d["Date"])).y(d=>yScale3(d["KDJ_J"]));
        KDJ_MainGroup.append("path").datum(data).attr("stroke", "steelblue").attr("fill", "none").attr("d", KDJ_K_Path).attr("stroke-width", 2);
        KDJ_MainGroup.append("path").datum(data).attr("stroke", "indianred").attr("fill", "none").attr("d", KDJ_D_Path).attr("stroke-width", 2);
        KDJ_MainGroup.append("path").datum(data).attr("stroke", "forestgreen").attr("fill", "none").attr("d", KDJ_J_Path).attr("stroke-width", 2);
        // 加标签
        KDJ_MainGroup.append("text").attr("id", "KDJ_K-text").attr("x", innerWidth-500).attr("y", -10).text("KDK-K").attr("text-anchor", "left")
        KDJ_MainGroup.append("text").attr("id", "KDJ_D-text").attr("x", innerWidth-300).attr("y", -10).text("KDK-D").attr("text-anchor", "left")
        KDJ_MainGroup.append("text").attr("id", "KDJ_J-text").attr("x", innerWidth-100).attr("y", -10).text("KDK-J").attr("text-anchor", "left")
        KDJ_MainGroup.append("rect").attr("id", "KDJ_K-line").attr("x", innerWidth-560).attr("y", -17).attr("height", 3).attr("width", 50).attr("fill", "steelblue")
        KDJ_MainGroup.append("rect").attr("id", "KDJ_D-line").attr("x", innerWidth-360).attr("y", -17).attr("height", 3).attr("width", 50).attr("fill", "indianred")
        KDJ_MainGroup.append("rect").attr("id", "KDJ_J-line").attr("x", innerWidth-160).attr("y", -17).attr("height", 3).attr("width", 50).attr("fill", "forestgreen")



        // 设置映射关系
        const xScale4 = d3.scaleTime().domain(d3.extent(data, d=>d["Date"])).range([0, innerWidth]).nice();
        const yScale4 = d3.scaleLinear()
            .domain([Math.min(d3.min(data.map(d=>d["BIAS_BIAS1"])), d3.min(data.map(d=>d["BIAS_BIAS2"])), d3.min(data.map(d=>d["BIAS_BIAS3"]))),
                Math.max(d3.max(data.map(d=>d["BIAS_BIAS1"])), d3.max(data.map(d=>d["BIAS_BIAS2"])), d3.max(data.map(d=>d["BIAS_BIAS3"])))])
            .range([innerHeight, 0]);
        // 设置坐标轴
        const timeFormat4 = d3.timeFormat("%B-%d")
        const xAxis4 = d3.axisBottom(xScale4).tickFormat(timeFormat4).ticks(15);
        const yAxis4 = d3.axisLeft(yScale4).ticks(3);
        const xAxisGroup4 = BIAS_MainGroup.append('g').call(xAxis4);
        const yAxisGroup4 = BIAS_MainGroup.append('g').call(yAxis4);
        d3.selectAll('.tick text').attr('font-size', '1.5em');
        xAxisGroup4.append('text').attr('class', 'axisTitle');
        yAxisGroup4.append('text').attr('class', 'axisTitle').attr('transform', 'rotate(-90)');
        xAxisGroup4.attr('transform', `translate(${0}, ${innerHeight})`);
        d3.selectAll('.axisTitle').attr('text-anchor', "middle").attr('fill', 'black').attr('font-size', '2em');
        // 绘图
        const BIAS_BIAS1_Path = d3.line().x(d=>xScale4(d["Date"])).y(d=>yScale4(d["BIAS_BIAS1"]));
        const BIAS_BIAS2_Path = d3.line().x(d=>xScale4(d["Date"])).y(d=>yScale4(d["BIAS_BIAS2"]));
        const BIAS_BIAS3_Path = d3.line().x(d=>xScale4(d["Date"])).y(d=>yScale4(d["BIAS_BIAS3"]));
        BIAS_MainGroup.append("path").datum(data).attr("stroke", "steelblue").attr("fill", "none").attr("d", BIAS_BIAS1_Path).attr("stroke-width", 2);
        BIAS_MainGroup.append("path").datum(data).attr("stroke", "indianred").attr("fill", "none").attr("d", BIAS_BIAS2_Path).attr("stroke-width", 2);
        BIAS_MainGroup.append("path").datum(data).attr("stroke", "forestgreen").attr("fill", "none").attr("d", BIAS_BIAS3_Path).attr("stroke-width", 2);
        // 加标签
        BIAS_MainGroup.append("text").attr("id", "BIAS_BIAS1-text").attr("x", innerWidth-500).attr("y", -10).text("BIAS-BIAS1").attr("text-anchor", "left")
        BIAS_MainGroup.append("text").attr("id", "BIAS_BIAS2-text").attr("x", innerWidth-300).attr("y", -10).text("BIAS-BIAS2").attr("text-anchor", "left")
        BIAS_MainGroup.append("text").attr("id", "BIAS_BIAS3-text").attr("x", innerWidth-100).attr("y", -10).text("BIAS-BIAS3").attr("text-anchor", "left")
        BIAS_MainGroup.append("rect").attr("id", "BIAS_BIAS1-line").attr("x", innerWidth-560).attr("y", -17).attr("height", 3).attr("width", 50).attr("fill", "steelblue")
        BIAS_MainGroup.append("rect").attr("id", "BIAS_BIAS2-line").attr("x", innerWidth-360).attr("y", -17).attr("height", 3).attr("width", 50).attr("fill", "indianred")
        BIAS_MainGroup.append("rect").attr("id", "BIAS_BIAS3-line").attr("x", innerWidth-160).attr("y", -17).attr("height", 3).attr("width", 50).attr("fill", "forestgreen")

        d3.csv("../data/TestingResult.csv").then(data=>{
            let predict = "";
            for(let i=0; i<data.length; i++)
            {
                if(data[i]["Code"] === stockSelected)
                {
                    predict = data[i]["PredictState"];
                }
            }
            if(predict === "1")
            {
                let span = document.createElement("span");
                span.id = "title"
                span.style.fontSize = "25px";
                span.style.color = "red";
                span.innerHTML = "&nbsp &nbsp &nbsp &nbsp 近 期 可 看 涨 (基于朴素贝叶斯)";
                document.getElementById("select-div").appendChild(span);
            }
            else
            {
                let span = document.createElement("span");
                span.id = "title"
                span.style.fontSize = "25px";
                span.style.color = "green";
                span.innerHTML = "&nbsp &nbsp &nbsp &nbsp 近 期 可 看 跌 (基于朴素贝叶斯)";
                document.getElementById("select-div").appendChild(span);
            }
        })

    })

}