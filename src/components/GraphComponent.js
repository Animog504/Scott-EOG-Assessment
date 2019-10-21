import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import gql from "graphql-tag";
import { useQuery, createClient, Provider } from "urql";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Brush } from 'recharts';
import { LinearProgress } from '@material-ui/core';
import * as actions from "../store/actions";


const metric = {
  "getData": "oilTemp"
};

const grabMetricHistory = `
query($measurement: String!, $startTime: Timestamp) {
  getMultipleMeasurements(input: [{metricName: $measurement, after: $startTime}]) {
      measurements {
        metric
        value
        unit
        at
      }
    }    
  }
`;

const GraphComponent = (props) =>
  (
    <QueryMakingComponentThing props={props} />
  )



const timestamp = new Date().getTime() - 30000

const QueryMakingComponentThing = ({ props }) => {
  //the code below is an absolute shit storm but works to varying degrees. FUCK!
  // console.log("props.selectedMetrics.length > 0", props.selectedMetrics.length > 0)
  // console.log(timestamp)
  // debugger

  let metricToGet = props.selectedMetrics.length > 0 ? props.selectedMetrics[props.selectedMetrics.length - 1] : ""

  // console.log("what our query gonna be?",metricToGet, "what is props?", props)
  const [result] = useQuery({
    query: grabMetricHistory,
    variables: {
      measurement: metricToGet,
      startTime: timestamp
    }
  });
  console.log("GC result:", result)
  const { fetching, data, error } = result;
  const dispatch = useDispatch()
  useEffect(
    () => {
      if (error) {
        dispatch({ type: actions.API_ERROR, error: error.message });
        return;
      }
      if (!data) return;
      const { getMultipleMeasurements: getMetricData } = data;
      dispatch({ type: actions.METRIC_DATA_RECEIVED, getMetricData, metricToGet });
    },
    [dispatch, data, error]
  );

  //   // const { loading, data } = useQuery(QUERY);
  //   console.log(data)

  const ourDataOrSomething = useSelector(state => state.dashboard)

  if (fetching) return <LinearProgress />;
  //   // const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}, ...];
  const makeChart = (data) => {
    console.log("makeChart data arg: ", data)
    // right now hard-coded grab for data
    console.log("What is this data?:", ourDataOrSomething)
    //gotta map this shit cuz unix timestamps are only readable by sick fucks.
    // metric value unit at

    const fixThisShit = (n) => {
      //gotta map this shit cuz unix timestamps are only readable by sick fucks.
      let getReadableDate = new Date(n)
      let hour = getReadableDate.getHours()
      let minute = `${getReadableDate.getMinutes() < 10 ? "0" : ""}${getReadableDate.getMinutes()}`
      let seconds = `${getReadableDate.getSeconds() < 10 ? "0" : ""}${getReadableDate.getSeconds()}`
      // console.log("fix this shit time: ", hour+":"+minute+":"+seconds)

      return `${hour}:${minute}:${seconds}`
    }
    let timestamps = ourDataOrSomething.map(measurement => measurement.at)
    // const betterData = ourDataOrSomething.map(measurement => ({
    //   "metric": measurement.name,
    //   "value": measurement.value,
    //   "unit": measurement.unit,
    //   "at": (measurement.at)
    // }))
    if (ourDataOrSomething != null && ourDataOrSomething.length) {
      return (
        <LineChart width={800} height={200} margin={{ top: 5, right: 50, bottom: 5, left: 5 }} data={ourDataOrSomething}>
          {/* <Brush height={10} /> */}
          {/* <Line type="monotone" dataKey="tubingPressure" stroke="#8884d8" isAnimationActive={false} />
          <Line type="monotone" dataKey="casingPressure" stroke="#ff0000" isAnimationActive={false} /> */}

          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="at" tickFormatter={fixThisShit} key={ourDataOrSomething[ourDataOrSomething.length - 1].at} />
          <Tooltip wrapperStyle={{ width: 150, backgroundColor: '#ccc' }} />
          {
            props.selectedMetrics.map((metric) => {
              console.log(metric)
              return (
                <YAxis dataKey={metric} yAxisId={metric} />
              )
            })
          } 
          {
            props.selectedMetrics.map((metric) => {
              console.log(metric)
              return (

                 
                <Line key={`line_${metric}`} dataKey={metric} yAxisId={metric} />

              )
            })
          } 
        </LineChart>)
    } else {
      return <h3>no valid data</h3>
    }

  }


  //   // console.log(data)
  return (
    <div>
      <h1>Graph Component</h1>
      <div>{makeChart(data)}</div>

    </div>
  )
  return "help" // no please, really. help.

}

export default GraphComponent