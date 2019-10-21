import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "./CardHeader";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "./Avatar";
import SearchBar from "./SearchBar";
import { Provider, createClient, useQuery, defaultExchanges, subscriptionExchange } from "urql";
import { render } from "react-dom";
import GraphComponent from "./GraphComponent";
import Time from "./Time"
import { useDispatch, useSelector } from "react-redux";
import CardComponent from "./CardComponent"
import { SubscriptionClient } from "subscriptions-transport-ws";

// const link = createHttpLink({ uri: "https://react.eogresources.com/graphql" });
// const cache = new InMemoryCache();
// const client = new ApolloClient({ link, cache });

const subscriptionClient = new SubscriptionClient(
  "ws://react.eogresources.com/graphql",
  {
    reconnect: true,
    timeout: 20000
  }
);

// not using this for now.
const client = createClient({
  url: "https://react.eogresources.com/graphql",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    }),
  ],
});


const useStyles = makeStyles({
  card: {
    margin: "5% 5%",
    height: "80%"
  }
});

//-------------------------------------------

const selectMetric = (e) => {
  //pass back the specific metric and values
  console.log("myValue: ", e.target.value)
  // fetchMeasurementData(e.target.value)
};

// fetchMeasurementData = (measurementType) => {
  
// }

const query = `
query($latLong: WeatherQuery!) {
  getWeatherForLocation(latLong: $latLong) {
    description
    locationName
    temperatureinCelsius
  }
}
`;

const coolerQuery = `query($metric: String!) {
  getData: getMultipleMeasurements(input: [{metricName: $metric}])
      {
          measurements {
              metric
                value
                unit
                at
          }
      }      
}`

const metricQuery = `query{
  getMetrics
}`





export default () => {
  // const dispatch = useDispatch();
  // const { temperatureinFahrenheit, description, locationName } = useSelector(
  //   getWeather
  // );

  // const [result] = useQuery({
  //   query,
  //   variables: {
  //     latLong
  //   }
  // });
  // const { fetching, data, error } = result;
  // useEffect(
  //   () => {
  //     if (error) {
  //       dispatch({ type: actions.API_ERROR, error: error.message });
  //       return;
  //     }
  //     if (!data) return;
  //     const { getWeatherForLocation } = data;
  //     dispatch({ type: actions.WEATHER_DATA_RECEIVED, getWeatherForLocation });
  //   },
  //   [dispatch, data, error]
  // );

  // if (fetching) return <LinearProgress />;

  const selectedMetrics = useSelector(state => state.metrics)
 

  const classes = useStyles();
  return (
    <Provider value={client}>
      <Card className={classes.card}>
        <CardHeader title="Dashboard" />
        <SearchBar selectMetric={selectMetric} />
        <GraphComponent selectedMetrics={selectedMetrics}/>
        <CardComponent selectedMetrics={selectedMetrics}/>
      </Card>
    </Provider>
    
  );
};
