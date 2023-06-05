window.addEventListener("load", main);

function main()
{
    // 设置方块, 用于菜单切换
    const svg = d3.select("svg#menu").style("background", "white");
    const width = svg.attr("width");
    const height = svg.attr("height");
    let Index = ["沪 深 300", "中 证 500", "上 证 50", "个 股 详 情", "个 股 预 测", "相 似 推 荐"];

    svg.append("rect").attr("x", 0).attr("y", 0).attr("width", width).attr("height", 70).attr("fill", "whitesmoke");
    // 设置方块上的文字, 用于菜单切换
    const optionText = svg.selectAll("text.IndexOption").data(Index).join("text")
        .text(d=>d)
        .attr("stroke", "black")
        .attr("class", "IndexOption")
        .attr("y", 45)
        .attr("x", (d, i, nodes)=> i* width/(Index.length+1) + 200)
        .attr("font-size", "1.5em")
        .attr("text-anchor", "middle")

    optionText.on("click", function(event, d)
    {
        d3.select("svg#mainBoard").remove();
        d3.select("div#select-div").remove();
        d3.select("svg#MACD").remove();
        d3.select("svg#DMI").remove();
        d3.select("svg#KDJ").remove();
        d3.select("svg#BIAS").remove();

        let name = d3.select(this)._groups[0][0].__data__;
        if(name === "沪 深 300")  Index_K_Graph("../data/HuShen300.csv", name);
        else if(name === "中 证 500") Index_K_Graph("../data/ZhongZheng500.csv", name);
        else if(name === "上 证 50") Index_K_Graph("../data/ShangZheng50.csv", name);
        else if(name === "个 股 详 情") stockList();
            // window.location.href='./stockList.html';
        else if(name === "个 股 预 测") Predict();
        else recommend();

    });
    optionText.on("mousemove", function(event, d)
    {
        d3.select(this)
            .attr("fill", "blue")
            .attr("font-size", "1.8em")
    });
    optionText.on("mouseleave", function(event, d)
    {
        d3.select(this)
            .attr("fill", "black")
            .attr("font-size", "1.5em")
    });
}


