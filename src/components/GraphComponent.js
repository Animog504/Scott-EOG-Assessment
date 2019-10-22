import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import gql from "graphql-tag";
import { useQuery, createClient, Provider } from "urql";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Brush, Label } from 'recharts';
import { LinearProgress } from '@material-ui/core';
import * as actions from "../store/actions";

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

const mapMetricToUnit = {
  tubingPressure: "psi",
  injValveOpen: '%',
  flareTemp: "F",
  oilTemp: "F",
  casingPressure: "psi",
  waterTemp: "F"
}
const mapMetricToColor = {
  tubingPressure: "#FF0000",
  injValveOpen: "#00FF00",
  flareTemp: "#0000FF",
  oilTemp: "#FF0F00",
  casingPressure: "#FF00FF",
  waterTemp: "#00FFFF"
}



const timestamp = new Date().getTime() - 30000

const QueryMakingComponentThing = ({ props }) => {

  let metricToGet = props.selectedMetrics.length > 0 ? props.selectedMetrics[props.selectedMetrics.length - 1] : ""

  const [result] = useQuery({
    query: grabMetricHistory,
    variables: {
      measurement: metricToGet,
      startTime: timestamp
    }
  });

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

  const ourDataOrSomething = useSelector(state => state.dashboard)

  if (fetching) return <LinearProgress />;

  const makeChart = (data) => {

    const fixThisShit = (n) => {
      let getReadableDate = new Date(n)
      let hour = getReadableDate.getHours()
      let minute = `${getReadableDate.getMinutes() < 10 ? "0" : ""}${getReadableDate.getMinutes()}`
      let seconds = `${getReadableDate.getSeconds() < 10 ? "0" : ""}${getReadableDate.getSeconds()}`

      return `${hour}:${minute}:${seconds}`
    }

    let timestamps = ourDataOrSomething.map(measurement => measurement.at)
   
    if (ourDataOrSomething != null && ourDataOrSomething.length) {
      return (
        <LineChart width={800} height={200} margin={{ top: 5, right: 50, bottom: 5, left: 5 }} data={ourDataOrSomething}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="at" tickFormatter={fixThisShit} key={ourDataOrSomething[ourDataOrSomething.length - 1].at} />
          <Tooltip wrapperStyle={{ width: 150, backgroundColor: '#ccc' }} />
          {
            props.selectedMetrics.map((metric) => {
              return (
                <YAxis dataKey={metric} yAxisId={metric} >
                  <Label value={mapMetricToUnit[metric]} />
                </YAxis>
              )
            })
          }
          {
            props.selectedMetrics.map((metric) => {
              return (
                <Line key={`line_${metric}`} dataKey={metric} yAxisId={metric} stroke={mapMetricToColor[metric]} />
              )
            })
          }
        </LineChart>)
    } else {
      return <h3>no metric selected</h3>
    }

  }

  return (
    <div>
      <h3>Graph Component</h3>
      <div>{makeChart(data)}</div>

    </div>
  )


}

export default GraphComponent