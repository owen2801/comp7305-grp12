// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://202.45.128.135:13160', function(err, conn) {
  conn.createChannel(function(err, ch) {
    ch.assertQueue('', {exclusive: true}, function(err, q) {

      // var corr = generateUuid();
      // // input question id
      // var num = parseInt("1848");

      // console.log(' [x] Requesting fib(%d)', num);

      // ch.sendToQueue('rpc_queue',
      //   new Buffer(num.toString()),
      //   { correlationId: corr, replyTo: q.queue });

      // ch.consume(q.queue, function(msg) {
      //   if (msg.properties.correlationId === corr) {
      //     console.log(' [.] Got %s', msg.content.toString());
      //     setTimeout(function() { conn.close(); process.exit(0) }, 25500);
      //   }
      // }, {noAck: true});

      ch.consume(q.queue, function(msg) {
        // if (msg.properties.correlationId === corr) {
          // console.log(' [.] Got %s', msg.content.toString());
          var json = JSON.parse(msg.content.toString());
          console.log("Got ", json);
          if(json && json[0].Qid){
            var pid = json[0].Qid;
            json.shift();
            if(pid){
              $("#btn-predict-"+pid).html("Done");
              var template = $('#template-tag').html();
              Mustache.parse(template);   // optional, speeds up future uses
              var rendered = "";
              for(var i = 0; i < json.length; i++){
                var temp = {};
                Object.keys(json[i]).map(function (key) {
                  if(key == "grp12taghash"){
                    temp["grp12taghash"] = json[i][key];
                  } else {
                    temp["tag"] = key;
                    temp["rating"] = json[i][key].toFixed(2);
                  }
                })
                rendered += Mustache.render(template, temp);
                // rendered += Mustache.render(template, {tag: json[i].tag, rating: msg.content[i].rating});
              }
              
              // for(var i = 1; i < json.length; i++){
              //   rendered += Mustache.render(template, {tag: json[i].tag, rating: msg.content[i].rating});
              // }
              $('#tag-'+pid).html(rendered);
            }

          } else {
            var pids = "(";
            var rendered = "";
            for(var i = 0; i < json.length; i++){
              Object.keys(json[i]).map(function (key) {
                pids += "'"+key.toString() + "',";
              })
              // rendered += Mustache.render(template, {tag: json[i].tag, rating: msg.content[i].rating});
            }
            pids += "'0')";
            if(json.length){
              // Load posts
              console.log('SELECT * FROM Posts WHERE Id in '+pids);
              connection.query('SELECT * FROM Posts WHERE Id in '+pids, function (error, results, fields) {
              // connection.query('SELECT * FROM Posts WHERE Id = 1848', function (error, results, fields) {
                if (error) throw error;
                loadSuggestPosts(results);
              });
            }
          }
          
          // setTimeout(function() { conn.close(); process.exit(0) }, 25500);
        // }
      }, {noAck: true});

      _predict = function(pid){
        var corr = generateUuid();
        // input question id
        var num = parseInt(pid);

        var request = {"type": 0, "id": num};

        console.log(' [x] Requesting prediction ', JSON.stringify(request).toString());

        ch.sendToQueue('rpc_queue',
          new Buffer(JSON.stringify(request).toString()),
          { correlationId: corr, replyTo: q.queue });
      }

      _findRelated = function(hashvalue){
        var corr = generateUuid();
        // input question id
        var req = parseInt(hashvalue);

        var request = {"type": 1, "id": req};

        console.log(' [x] Requesting related ', JSON.stringify(request).toString());

        ch.sendToQueue('rpc_queue',
          new Buffer(JSON.stringify(request).toString()),
          { correlationId: corr, replyTo: q.queue });
      }

      // _predict(1848);

    });
  });
});

function generateUuid() {
  return Math.random().toString() +
         Math.random().toString() +
         Math.random().toString();
}


// For Mysql
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : '202.45.128.135',
  user     : 'root',
  password : 'root',
  database : 'group12',
  port     : '14133'
});
 
connection.connect();

// Load posts
connection.query('SELECT * FROM Posts ORDER BY RAND() LIMIT 50', function (error, results, fields) {
// connection.query('SELECT * FROM Posts WHERE Id = 1848', function (error, results, fields) {
  if (error) throw error;
  loadPosts(results);
});
 
// For age count
connection.query('SELECT * FROM age_count', function (error, results, fields) {
  if (error) throw error;
  renderAge(results);
});

// For country_count
// connection.query('(select * from country_count order by count DESC limit 20) union (select "others", sum(count) from country_count)', function (error, results, fields) {
connection.query('select * from country_count', function (error, results, fields) {
  if (error) throw error;
  renderCountry(results);
});

// For tag_count
connection.query('SELECT * FROM tag_count ORDER BY count DESC LIMIT 20', function (error, results, fields) {
  if (error) throw error;
  // console.log('The tag_count are: ', results);
  renderTag(results);
});
 
// connection.end();

// Load posts
function loadPosts(data){
  var template = $('#template').html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = "";
  var tid = 1;
  for(var i = 0; i < data.length; i++){
    var tags =  _.unescape(data[i].tag).match(/<(.*?)>/g);
    if(tags.length >= 4){
      for(var j = 0; j < tags.length; j++){
        tags[j] = tags[j].substring(1, tags[j].length-1);
      }
      rendered += Mustache.render(template, {number: tid++, title: data[i].Title, body: _.unescape(data[i].Body), pid: data[i].Id, tag: tags});
    }
  }
  $('#post-list').html(rendered);
  // for(var i = 0; i < data.length; i++){
  //   ages.push(data[i].age);
  //   counts.push(data[i].count);
  // }
}

// Load posts
function loadSuggestPosts(data){
  var template = $('#template-question').html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = "";
  var tid = 1;
  for(var i = 0; i < data.length; i++){
    // var tags =  _.unescape(data[i].tag).match(/<(.*?)>/g);
    rendered += Mustache.render(template, {number: tid++, title: data[i].Title, pid: data[i].Id});
  };
  $('#suggest-question').html(rendered);
  // for(var i = 0; i < data.length; i++){
  //   ages.push(data[i].age);
  //   counts.push(data[i].count);
  // }
}

/// Render statistics

function renderAge(data){
  var ages = [];
  var counts = [];
  for(var i = 0; i < data.length; i++){
    ages.push(data[i].age);
    counts.push(data[i].count);
  }
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('age-count'));

  // 指定图表的配置项和数据
  var option = {
      title: {
          text: 'Ages Statistics'
      },
      tooltip: {},
      legend: {
          data:['Numers of Users']
      },
      xAxis: {
        type: 'category',
        data: ages
      },
      yAxis: {
          type: 'value'
      },
      series: [{
          name: 'Numers of Users',
          data: counts,
          type: 'bar'
      }]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}

function renderCountry(data){
    var countries = [];
    var counts = [];
    var total = 0;
    var series = [];
    for(var i = 0; i < data.length; i++){
      if(i < data.length - 1){
        total += data[i].count;
        series.push( {name: data[i].country, value: data[i].count} );
      } else {
        series.push( {name: data[i].country, value: data[i].count - total} );
      }
    }
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('country-count'));

    var option = {
        title: {
            text: 'Stack Overflow User Distribution',
            subtext: '',
            left: 'left',
            top: 'top'
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                var value = (params.value + '').split('.');
                var value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
                        // + '.' + value[1];
                return params.seriesName + '<br/>' + params.name + ' : ' + value;
            }
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                // dataView: {readOnly: false},
                // restore: {},
                // saveAsImage: {}
            }
        },
        visualMap: {
            min: 0,
            max: 300000,
            text:['High','Low'],
            realtime: false,
            calculable: true,
            inRange: {
                color: ['lightskyblue','yellow', 'orangered']
            }
        },
        series: [
            {
                name: 'Stack Overflow World Population',
                type: 'map',
                mapType: 'world',
                roam: false,
                itemStyle:{
                    emphasis:{label:{show:true}}
                },
                data: series
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

function renderTag(data){
    var totalPosts = 7129362;
    var tags = [];
    var counts = [];
    var series = [];
    for(var i = 0; i < data.length; i++){
      series[data[data.length-i-1].tag] = (data[data.length-i-1].count / totalPosts * 100).toFixed(2);
    }
    // console.log(series);
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('tag-count'));

    // 指定图表的配置项和数据

    option = {
        tooltip: {},
        title: {
            text: 'Tags Statistics',
            subtext: '',
            // x: '25%',
            textAlign: 'left'
        },
        legend: {
            data:['Percentage of Tags Used in Posts']
        },
        xAxis: {
            type: 'value',
            max: 20,
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            data: Object.keys(series),
            axisLabel: {
                interval: 0,
                rotate: 30
            },
            splitLine: {
                show: false
            }
        },
        series: [{
            type: 'bar',
            stack: 'chart',
            z: 3,
            label: {
                normal: {
                    position: 'right',
                    show: true
                }
            },
            data: Object.keys(series).map(function (key) {
                return series[key];
            })
        }, {
            type: 'bar',
            stack: 'chart',
            silent: true,
            itemStyle: {
                normal: {
                    color: '#eee'
                }
            },
            data: Object.keys(series).map(function (key) {
                return totalPosts - series[key];
            })
        }]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}