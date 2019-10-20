import React, { useState, useEffect } from 'react';
// import styled from "styled-components"; //cant seem to find this one so commented out for now
import gql from "graphql-tag";
import { useQuery, createClient, Provider } from "urql";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { LinearProgress } from '@material-ui/core';

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});


const metric = {
  "getData": "oilTemp"
};
// const QUERY = gql`
// query dynamicQuery($getData: String!) {
//   getData: getMultipleMeasurements(input: [{metricName: $getData}])
//       {
//           measurements {
//               ...measurements
//           }
//       }      
// }
//   fragment measurements on Measurement{
//       metric
//       value
//       unit
//       at
//   }
// `;

const maybeBetterQuery = `
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
    <Provider value={client}>
      <QueryMakingComponentThing props={props} />
    </Provider>
  )

const timestamp = new Date().getTime() - 30000

const QueryMakingComponentThing = (props) =>{
  //the code below is an absolute shit storm but works to varying degrees. FUCK!
  console.log("props.props.selectedMetrics.length > 0", props.props.selectedMetrics.length > 0)
  console.log(timestamp)
  // debugger

  let metricToGet = props.props.selectedMetrics.length > 0 ? props.props.selectedMetrics[props.props.selectedMetrics.length-1] : "tubingPressure"

  console.log("what our query gonna be?",metricToGet, "what is props?", props)
  const [result] = useQuery({
    query: maybeBetterQuery,
    variables: {
      measurement: metricToGet,
      startTime: timestamp
    }
  });
  const { fetching, data, error } = result;

  //   // const { loading, data } = useQuery(QUERY);
  //   console.log(data)



  if (fetching) return <LinearProgress />;
 
    const makeCard = (data) => {
        
        return <h2>some data n shit for a card not available</h2>
        
    }
    

  //   // console.log(data)
    return(
        <div>
             <h1>Card Component</h1>
            <div>{makeCard(data)}</div>
    
        </div>
        )
  return "help"
       
}

export default CardComponent