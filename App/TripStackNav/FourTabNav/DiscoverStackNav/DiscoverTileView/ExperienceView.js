import { SearchBar } from 'react-native-elements'
import React, {Component} from "react";
import {Image, Text, TouchableOpacity, View} from 'react-native';
import ButtonSquare from "../../../../../assets/elements/ButtonSquare";
import styles from "../../../../../assets/styles/ChooseCityPlannerStyles";
import NetIcon from "../../../../../assets/elements/NetIcon";
import Metrics from "../../../../../assets/styles/Themes/Metrics";
import TriprStore from "../../../../../assets/services/TriprStore";
import POIListComponent from "./POIListComponent";
import POITilesComponent from "./POITilesComponent";

export default class ExperienceView extends React.Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        title: `Experience ${navigation.state.params.cityName}`,
        tabBarIcon: <Image source={require('../../../../../assets/images/discover_icon.png')}
                           style={{
                               height: 30,
                               width: 30,
                               resizeMode: 'contain'
                           }} />,
        tabBarLabel: "Experience",
        headerTitle: `Experience`.toUpperCase(),
        headerStyle: {
        },
        headerTitleStyle: {
            color:'#494949',
            alignSelf:'center',
            fontFamily: 'LeagueSpartan',
            fontSize:Metrics.h2,
            fontWeight:'200'
        },
        headerRight:(<NetIcon/>)
    });

    /*
    * Experience View
    * purpose:
    *   to allow users to search and filter down a list of POI's to find a specific POI
    * props:
    *   (navigation prop) cityName: the name of the city the user is viewing (=cityID)
    * state:
    *   screen: the component that we are displaying at any point
    *   currentList: an array of JSON objects. each object is a POI
    *   currentCategory: the category that the user has selected to filter the POI list
    * */
    constructor(props) {
        super(props);
        console.log("(INFO) [ExperienceView.constructor] props are: ", this.props);
        const { navigate } = this.props.navigation;
        this.navigate = navigate;
        this.state = {
            screen: 'tiles',
            fullList: [],
            displayList: [],
            currentCategory: null,
            currentSearchQuery: ''
        }
        TriprStore.getPOIList().then(list=>this.state.fullList=list);
        //TriprStore.getPOIList().then((list) => this.state.currentList = list)
    }

    async updateList() {
        console.log("(INFO) [ExperienceView.updateList] updating the list");
        console.log("(INFO) [ExperienceView.updateList] currentCategory is: ", this.state.currentCategory);
        console.log("(INFO) [ExperienceView.updateList] currentSearchQuery is: ", this.state.currentSearchQuery);

        if(this.state.currentCategory) {
            if(this.state.currentSearchQuery.length !== 0) {
                //category and search
                console.log("(INFO) [ExperienceView.updateList] by category and search");

                this.state.currentList = TriprStore.filterByCategory(this.state.fullList, this.state.currentCategory);
                this.state.currentList = TriprStore.startingWith(this.state.currentList, this.state.currentSearchQuery);
            } else {
                //category and no search
                console.log("(INFO) [ExperienceView.updateList] by category and no search");

                this.state.currentList = TriprStore.filterByCategory(this.state.fullList, this.state.currentCategory);
            }
        } else {
            if(this.state.currentSearchQuery.length !== 0) {
                //no category and search
                console.log("(INFO) [ExperienceView.updateList] by no category and search");

                this.state.currentList = TriprStore.startingWith(this.state.fullList, this.state.currentSearchQuery);
            } else {
                //no category and no search
                console.log("(INFO) [ExperienceView.updateList] by no category and no search");

                this.state.currentList = this.state.fullList
            }
        }
        console.log("(INFO) [ExperienceView.updateList] updated list to: ", this.state.currentList);

    }

    setTheState(object) {
        this.updateList().then(()=>{
            console.log("(INFO) [ExperienceView.setTheState] setting the state to: ", object);

            this.setState(object);
        });
    }

    resetToTiles() {
        this.setState({
            screen: 'tiles',
            displayList: [],
            currentCategory: null,
            currentSearchQuery: ''
        })
    }

    handleSearch(query) {
        console.log("(INFO) [ExperienceView.handleSearch] handling search for query: ", query);
        this.state.currentSearchQuery = query;
        this.setTheState({screen: 'list'})
    }

    screenOptions(){
        if(this.state.screen === 'tiles') {
            //render the tiles screen component
            return (
                <POITilesComponent

                    setParentState={this.setTheState.bind(this)}
                />
            )
        } else if(this.state.screen === 'list') {
            //render the list component
            return (
                <POIListComponent
                    list={this.state.currentList}
                    resetToTiles={this.resetToTiles.bind(this)}
                    setParentState={this.setTheState.bind(this)}
                    navigate={this.navigate}
                />
            )
        }
    }
    render() {
        return (
            <View>
                <SearchBar
                    lightTheme
                    inputStyle={{
                        backgroundColor:"#ffffff"}}
                    containerStyle={{backgroundColor:'transparent',borderTopColor:'transparent',borderBottomColor:'transparent',marginHorizontal:10,marginVertical:10}}
                    placeholder='Type Here...'
                    onChangeText={(query)=>this.handleSearch(query)}
                />
                <View>
                    {this.screenOptions()}
                </View>
            </View>
        )
    }
}