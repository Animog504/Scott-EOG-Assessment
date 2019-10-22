import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "./CardHeader";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import SearchBar from "./SearchBar";
import { useSubscription } from "urql";
import GraphComponent from "./GraphComponent";
import { useDispatch, useSelector } from "react-redux";
import CardComponent from "./CardComponent"
import * as actions from "../store/actions";


const useStyles = makeStyles({
  card: {
    margin: "3% 3%",
    height: "100%"
  }
});

const DataSubscription = `
subscription DataSubscription{
	newMeasurement{
  	value
  	metric
    unit
    at
  }
}`;


const handleDataSubscription = dispatch => (existingData = {}, newData) => {

  if (newData) {
      existingData[newData.newMeasurement.metric] = newData
  }

  dispatch({ type: actions.NEW_MEASUREMENT_DATA_RECEIVED, newMeasurement: newData.newMeasurement });

}



export default () => {
  

  const selectedMetrics = useSelector(state => state.metrics)

  const classes = useStyles();

  const dispatch = useDispatch();

 useSubscription({
    query: DataSubscription
  }, handleDataSubscription(dispatch))
  
  // console.log('Dont rerender')
  return (
      <Card className={classes.card}>
        <CardHeader title="Dashboard" />
        <CardContent key={2}>
          <SearchBar />
          <GraphComponent selectedMetrics={selectedMetrics}/>
          <List>
              <CardComponent selectedMetrics={selectedMetrics}/>
          </List> 
        </CardContent>
      </Card>
  );
};
