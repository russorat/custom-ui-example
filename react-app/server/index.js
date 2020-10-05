const path = require("path");
const {InfluxDB} = require('@influxdata/influxdb-client')
const {DashboardsAPI, BucketsAPI, TasksAPI, ChecksAPI} = require('@influxdata/influxdb-client-apis')
var {url, token, org, bucket} = require('./env')
const express = require("express");
const bodyParser = require('body-parser');
const app = express(); // create express app
//app.use(bodyParser.urlencoded({ extended: true }));

// add middlewares
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.get('/count', async(req, res, next) => {
    let bucket = req.query.bucket;
    let interval = req.query.interval;
    const influxDB = new InfluxDB({url, token})
    const fluxQuery = `
        from(bucket: "${bucket}") 
            |> range(start: -${interval})
            |> group(columns: ["_stop"])
            |> count() 
            |> set(key: "bucket", value: "${bucket}")
            |> group(columns: ["_stop","bucket"]) 
    `.trim()
    await influxDB.getQueryApi(org)
    .queryLines(
        fluxQuery,
        {
            error(error) {
                res.setHeader('Content-Type', 'application/json');
                res.json(error)
                res.end()
            },
            next(line) {
                if(!res.headersSent) {
                    res.setHeader('Content-Type', 'text/csv');
                }
                res.write(line+'\n')
            },
            complete() {
                res.end()
            },
        }
    );
});

app.get('/query', async(req, res, next) => {
    let bucket = req.query.bucket;
    let field = req.query.field;
    let tags = req.query.tags;
    if(tags) {
        tags = tags.split('||').map((v) => {
            let [key,val] = v.split('|');
            return `|> filter(fn: (r) => r["${key}"] == "${val}") `
        });
    } else {
        tags = []
    }
    const influxDB = new InfluxDB({url, token})
    const fluxQuery = `
        from(bucket: "${bucket}") 
            |> range(start: -15m) 
            |> filter(fn: (r) => r["_field"] == "${field}")` + tags.join('')
    await influxDB.getQueryApi(org)
    .queryLines(
        fluxQuery,
        {
            error(error) {
                res.setHeader('Content-Type', 'application/json');
                res.json(JSON.parse(error.body))
                res.end()
            },
            next(line) {
                if(!res.headersSent) {
                    res.setHeader('Content-Type', 'text/csv');
                }
                res.write(line+'\n')
            },
            complete() {
                res.end()
            },
        }
    );
});

app.get('/:resource', async(req, res, next) => {
    const influxDB = new InfluxDB({url, token})
    let resourceList = []
    if(req.params.resource === "buckets") {
        const api = new BucketsAPI(influxDB)
        await api.getBuckets({org},{limit: 100})
        .then((result) => {
            for(let i = 0; i < result.buckets.length; i++) {
                resourceList.push(result.buckets[i])
            }
        })
        .catch(error => {
            console.error(error)
            console.log('\nFinished ERROR')
        })
    } else if(req.params.resource === "dashboards") {
        const api = new DashboardsAPI(influxDB)
        await api.getDashboards({org},{limit: 100})
        .then((result) => {
            for(let i = 0; i < result.dashboards.length; i++) {
                resourceList.push(result.dashboards[i])
            }
        })
        .catch(error => {
            console.error(error)
            console.log('\nFinished ERROR')
        })
    } else if(req.params.resource === "tasks") {
        const api = new TasksAPI(influxDB)
        await api.getTasks({org},{limit: 100})
        .then((result) => {
            for(let i = 0; i < result.tasks.length; i++) {
                resourceList.push(result.tasks[i])
            }
        })
        .catch(error => {
            console.error(error)
            console.log('\nFinished ERROR')
        })
    } else if(req.params.resource === "checks") {
        const api = new ChecksAPI(influxDB)
        await api.getChecks({org},{limit: 100})
        .then((result) => {
            for(let i = 0; i < result.checks.length; i++) {
                resourceList.push(result.checks[i])
            }
        })
        .catch(error => {
            console.error(error)
            console.log('\nFinished ERROR')
        })
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(resourceList));
});

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});