function recommend()
{
    d3.select("body").append("div").attr("id", "select-div").attr("display", "inline-block");
    let divEle = document.getElementById("select-div");
    divEle.innerHTML = "股 票 列 表 &nbsp";
    divEle.style.fontSize = "20px";
    divEle.style.margin = "0 10px 0 100px";
    d3.csv("../data/stockList.csv").then(data=>
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
            d3.select("table#table").remove();
            // let select = document.getElementById('select');
            let stockSelected = select.value;
            d3.select("svg#MACD").remove();
            d3.select("svg#DMI").remove();
            d3.select("svg#KDJ").remove();
            d3.select("svg#BIAS").remove();
            d3.select("span#title").remove();
            fetchGroup(stockSelected)
        }
    });
}

function fetchGroup(stockSelected)
{
    d3.csv("../data/Cluster.csv").then(data=>
    {
        // console.log(data);
        let table = document.createElement("table");
        table.id = "table";
        table.border = "1px";
        table.cellPadding = "10";
        table.cellspacing = "0";
        table.style.textAlign = "center";   // 设置文本居中
        table.style.margin = "0 0 0 120px";
        // 为表格设计标题
        let caption = document.createElement("caption");
        caption.innerHTML = "具 有 类 似 市 场 表 现 的 其 他 股 票";
        caption.style.fontSize = "2.0em";
        caption.style.margin = "10px 0 10px 0";
        table.appendChild(caption);
        // 配置表头
        let tr = document.createElement("tr");   // 创建表格的行
        let td1 = document.createElement("td"); td1.innerHTML = "股票代码"; tr.appendChild(td1);
        let td2 = document.createElement("td"); td2.innerHTML = "收盘价"; tr.appendChild(td2);
        let td3 = document.createElement("td"); td3.innerHTML = "最高价"; tr.appendChild(td3);
        let td4 = document.createElement("td"); td4.innerHTML = "最低价"; tr.appendChild(td4);
        let td5 = document.createElement("td"); td5.innerHTML = "收盘价"; tr.appendChild(td5);
        let td6 = document.createElement("td"); td6.innerHTML = "交易股数(百万)"; tr.appendChild(td6);
        let td7 = document.createElement("td"); td7.innerHTML = "交易金额(百万)"; tr.appendChild(td7);
        let td8 = document.createElement("td"); td8.innerHTML = "市场类型"; tr.appendChild(td8);
        let td9 = document.createElement("td"); td9.innerHTML = "交易状态"; tr.appendChild(td9);
        let td10 = document.createElement("td"); td10.innerHTML = "涨跌幅(百分比)"; tr.appendChild(td10);
        table.appendChild(tr);

        // 查询该元素在哪个位置
        let index, cluster;
        for(let i=0; i<data.length; i++)
        {
            if(data[i]["Stkcd"] === stockSelected)
            {
                index = i;
                cluster = data[i]["Cluster"];
            }
        }
        // 配置查询的这个股票的数据
        // 配置表头
        let _tr = document.createElement("tr");   // 创建表格的行
        _tr.style. fontWeight  = "bold";
        let _td1 = document.createElement("td"); _td1.innerHTML = data[index]["Stkcd"]; _tr.appendChild(_td1);
        let _td2 = document.createElement("td"); _td2.innerHTML = data[index]["Opnprc"]; _tr.appendChild(_td2);
        let _td3 = document.createElement("td"); _td3.innerHTML = data[index]["Hiprc"]; _tr.appendChild(_td3);
        let _td4 = document.createElement("td"); _td4.innerHTML = data[index]["Loprc"]; _tr.appendChild(_td4);
        let _td5 = document.createElement("td"); _td5.innerHTML = data[index]["Clsprc"]; _tr.appendChild(_td5);
        let _td6 = document.createElement("td"); _td6.innerHTML = data[index]["Dnshrtrd"]; _tr.appendChild(_td6);
        let _td7 = document.createElement("td"); _td7.innerHTML = data[index]["Dnvaltrd"]; _tr.appendChild(_td7);
        let _td8 = document.createElement("td"); _td8.innerHTML = data[index]["Markettype"]; _tr.appendChild(_td8);
        let _td9 = document.createElement("td"); _td9.innerHTML = data[index]["Trdsta"]; _tr.appendChild(_td9);
        let _td10 = document.createElement("td"); _td10.innerHTML = data[index]["ChangeRatio"]; _tr.appendChild(_td10);
        table.appendChild(_tr);


       for(let i=0; i<data.length; i++)  // 列出10个同簇的股票的信息
       {
           if(data[i]["Cluster"] === cluster && i !== index)
           {
               let tr = document.createElement("tr");   // 创建表格的行
               let td1 = document.createElement("td"); td1.innerHTML = data[i]["Stkcd"]; tr.appendChild(td1);
               let td2 = document.createElement("td"); td2.innerHTML = data[i]["Opnprc"]; tr.appendChild(td2);
               let td3 = document.createElement("td"); td3.innerHTML = data[i]["Hiprc"]; tr.appendChild(td3);
               let td4 = document.createElement("td"); td4.innerHTML = data[i]["Loprc"]; tr.appendChild(td4);
               let td5 = document.createElement("td"); td5.innerHTML = data[i]["Clsprc"]; tr.appendChild(td5);
               let td6 = document.createElement("td"); td6.innerHTML = data[i]["Dnshrtrd"]; tr.appendChild(td6);
               let td7 = document.createElement("td"); td7.innerHTML = data[i]["Dnvaltrd"]; tr.appendChild(td7);
               let td8 = document.createElement("td"); td8.innerHTML = data[i]["Markettype"]; tr.appendChild(td8);
               let td9 = document.createElement("td"); td9.innerHTML = data[i]["Trdsta"]; tr.appendChild(td9);
               let td10 = document.createElement("td"); td10.innerHTML = data[i]["ChangeRatio"]; tr.appendChild(td10);
               table.appendChild(tr);
           }
       }
        document.getElementById("select-div").appendChild(table);
    });
}
