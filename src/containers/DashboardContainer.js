import React, { Component } from "react";
import { connect } from "react-redux";
// import { selectMovie } from "../actions/index";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import { bindActionCreators } from "redux";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import axios from "axios";
// import style from "../../style/style.css";
const BASE_URL = `https://api.themoviedb.org/3/search/movie`;
const API_KEY = "6bd58b642499ed2744d9100a5a3e6a71";
const DEBOUNCER_TIME = 2000;
const IMAGE_BASE_URL = `https://image.tmdb.org/t/p/w500`;
import { setFavorites } from "../actions/testActions";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { bisectCenter, treemapSquarify } from "d3";
const DEFAULT_QUERY = "a";
const TABS = {
  home: { label: "Home", name: "home" },
  favorites: { label: "Favorites", name: "favorites" },
};
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { query: DEFAULT_QUERY, movies: [], selectedTab: "home" };
  }
  fetchMoviesList = () => {
    //fetching all the movies from the server
    // let url = `${BASE_URL}?api_key=${API_KEY}&query=${this.state.query}`;
    let params = { api_key: API_KEY, query: this.state.query };
    axios.get(BASE_URL, { params }).then((resp) => {
      if (resp && resp.data && resp.data.results) {
        this.setState({ movies: resp.data.results });
      } else {
        this.setState({ movies: [] });
      }
    });
    // console.log("====debug===resp", resp);
  };

  debounce = (callback, wait) => {
    let timeout;
    return (...args) => {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        callback.apply(context, args);
      }, wait);
    };
  };
  querify = this.debounce(async (query) => {
    this.setState({ query: query ? query : DEFAULT_QUERY }, () => {
      this.fetchMoviesList();
    });
  }, DEBOUNCER_TIME);
  componentDidMount() {
    this.fetchMoviesList();
    this.setState({ selectedTab: "home" });
  }
  changeFavorite = (movie) => {
    // if (this.isMovieInFavs(movie)) {
    //   let favorites = this.props.favorites;
    //   const foundIndex = this.props.favorites.findIndex(
    //     (fav) => fav.id === movie.id
    //   );
    //   favorites = favorites.splice(foundIndex, 1);
    //   this.props.setFavorites(favorites);
    //   this.setState({
    //     updated: new Date().getTime(),
    //   });
    // } else {
    const favorites = this.props.favorites || [];
    favorites.push(movie);
    this.props.setFavorites(favorites);
    this.setState({
      updated: new Date().getTime(),
    });
    // }
  };

  isMovieInFavs = (movie) => {
    if (this.props.favorites && this.props.favorites.length) {
      const foundMovie = this.props.favorites.find((favMovie) => {
        return favMovie.id === movie.id;
      });
      if (foundMovie) {
        return true;
      }
    }
    return false;
  };
  renderMovieCard = (movie) => {
    return (
      <div style={{ padding: "20px", maxWidth: "480px" }}>
        <Card>
          <CardMedia
            style={{ height: "140px" }}
            image={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
            title={movie.title}
          />
          <CardContent>
            {movie.title}
            <Typography variant="body2" color="textSecondary" component="p">
              {movie.overview}
            </Typography>

            <Typography variant="body2" color="textPrimary" component="p">
              Rating: {movie.vote_average}
            </Typography>
            <Typography variant="body2" color="textPrimary" component="p">
              Release date: {movie.release_date}
            </Typography>
          </CardContent>
          {!this.isMovieInFavs(movie) && (
            <CardActions>
              <Button
                variant="contained"
                onClick={() => this.changeFavorite(movie)}
                color={"primary"}
              >
                {"Add to favorites"}
              </Button>
            </CardActions>
          )}
        </Card>
      </div>
    );
  };
  renderMovieList() {
    let movieElements = [];
    //TODO:see info in movie object and add that to card. like image: actor, rating.
    //TODO: make a button, favorite, integrate one onclick function.
    //INFO: how to create images: https://image.tmdb.org/t/p/w500/
    if (this.state.movies && this.state.movies.length) {
      this.state.movies.map((movie) => {
        movieElements.push(this.renderMovieCard(movie));
      });
    }
    return <div>{movieElements}</div>;
  }
  handleSearchQuery = (event) => {
    let query = event.target.value;
    this.querify(query);
  };
  renderSearchBox() {
    //TODO:make it align
    //TODO: ADD A LINE BELOW: type name of movie, actor or director
    return (
      <div style={{ padding: "20px" }} className="search-box">
        <TextField
          style={{ width: "300px" }}
          id="outlined-basic"
          label="Enter movie name or actor or director"
          onChange={this.handleSearchQuery}
          variant="outlined"
        />
      </div>
    );
  }
  handleTabChange = (event) => {
    // const tabVal = event.target.value;
    this.setState({ selectedTab: event });
  };
  renderTabs = () => {
    return (
      <AppBar position="static">
        <Tabs
          value={this.state.selectedTab}
          aria-label="wrapped label tabs example"
        >
          <Tab
            value={TABS.home.name}
            onClick={() => this.handleTabChange(TABS.home.name)}
            label={TABS.home.label}
          />
          <Tab
            value={TABS.favorites.name}
            onClick={() => this.handleTabChange(TABS.favorites.name)}
            label={TABS.favorites.label}
          />
        </Tabs>
      </AppBar>
    );
  };
  renderFavorites() {
    if (this.props.favorites && this.props.favorites.length) {
      const favorites = [];
      if (this.props.favorites && this.props.favorites.length) {
        this.props.favorites.map((movie) => {
          favorites.push(this.renderMovieCard(movie));
        });
      }

      return <div>{favorites}</div>;
    }
    return (
      <div
        style={{ padding: "50px", display: "flex", justifyContent: "center" }}
      >
        <Typography variant="body2" color="textPrimary" component="p">
          There are no favorites added till now. Please add movies to favorites.{" "}
        </Typography>
      </div>
    );
  }
  renderTabContent = () => {
    switch (this.state.selectedTab) {
      case "home":
        return (
          <div>
            {this.renderSearchBox()}
            {this.renderMovieList()}
          </div>
        );
      case "favorites":
        return <div>{this.renderFavorites()}</div>;
    }
  };
  render() {
    return (
      <div>
        {this.renderTabs()}
        {this.renderTabContent()}
      </div>
    );
  }
}
function mapStateToProps(state) {
  /*movies was assigned to state by our reducer reducer_movies*/
  return { favorites: state.favorites };
}

/*The function  returns action function as this.props.action*/
function mapDispatchToProps(dispatch) {
  /*What bindActionCreator does is whenever this.props.selectBook is called
   * its result is gonna flow through the dispatch function which will pass it through all the reducers*/

  return bindActionCreators({ setFavorites }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
