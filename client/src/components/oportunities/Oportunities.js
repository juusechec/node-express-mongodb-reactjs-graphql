import React, { Component } from "react";
import { Link } from "react-router-dom";
import config from "../../config";
import "./Oportunities.css";

class Oportunities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      oportunities: [],
      value: "",
    };
  }

  async componentDidMount() {
    const bio = JSON.parse(sessionStorage.getItem("bio"));
    const summaryOfBio = bio.person.summaryOfBio;
    const keywords = await this.getKeywords(summaryOfBio);
    console.log("keywords", keywords);
    this.getOpportunities(keywords);
  }

  getKeywords(summaryOfBio) {
    const url = "http://localhost:3001/extract";
    const body = {
      data: summaryOfBio,
      word_qty: 10,
    };
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }

  getOpportunities(keywords) {
    const apiUrl = `${config.postEndpoint}/opportunities/_search/?currency=USD%24&page=0&periodicity=hourly&lang=en&size=20&aggregate=false&offset=0`;
    const body = {
      or: [
        {
          "skill/role": {
            text: "machine learning",
            experience: "potential-to-develop",
          },
        },
        { "skill/role": { text: "react", experience: "potential-to-develop" } },
        {
          "skill/role": { text: "angular", experience: "potential-to-develop" },
        },
      ],
    };
    console.log("getOpportunities api url", apiUrl);
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("OPPORTUNITIES DATA", data);
        if (!data.results) {
          this.setState({
            error: "That link isn't exists!",
            isLoaded: false,
          });
        } else {
          this.setState({
            isLoaded: true,
            oportunities: data.results,
            error: null,
          });
        }
      });
  }

  render() {
    if (!this.state.isLoaded) {
      return (
        <div className="container">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Cargando...</h3>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">That's your work selection</h3>
              <h4>Opportunities</h4>
            </div>
            <div className="panel-body">
              <ul>
                {this.state.oportunities.map((opportunity, index) => (
                  <a href={`https://torre.co/jobs/${opportunity.id}`}>
                    <li key={index}>{opportunity.objective}</li>
                  </a>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Oportunities;
