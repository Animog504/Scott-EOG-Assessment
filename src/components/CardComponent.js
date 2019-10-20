import React, { useState, useEffect } from 'react';
// import styled from "styled-components"; //cant seem to find this one so commented out for now
import gql from "graphql-tag";
import { useQuery, createClient, Provider } from "urql";
import Card from '@material-ui/core/Card';
import { LinearProgress } from '@material-ui/core';

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});

const getLastMeasurement = `
query($metricName: String!){
  getLastKnownMeasurements(metricName: $metricName){
      measurements {
        metric
        value
        unit
        at
      }
    }    
  }
`;

const CardComponent = ({selectedMetrics}) => 
  (
    <Provider value={client}>
    {
        //some sort of map over selected Metrics
    }
      <MetricCard props={selectedMetrics} />
    </Provider>
  )

const timestamp = new Date().getTime() - 30000

const MetricCard = ({props}) =>{
  console.log("CC props:", props)
  let {metricName} = props

  console.log("metricName: ",metricName, "metricValue: "/*,value*/);

  const [result] = useQuery({
    query: getLastMeasurement,
    variables: {
        metricName: metricName
    }
  });
  const { fetching, data, error } = result;

  //   // const { loading, data } = useQuery(QUERY);
  //   console.log(data)



  if (fetching) return <LinearProgress />;
  
 
    const makeCard = (data) => {
        console.log("data in card:",data)
        
        return (
            <Card width={200}>
                <h1> something something data </h1>
            </Card>
        )
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