import "react";
import * as dvb from "dvbjs";
import Head from "next/head";
import Link from "next/link";
import "../../../static/tailwind.css";
import { BarLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExchangeAlt,
  faClock,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
var moment = require("moment");
require("moment-duration-format");

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: {},
      err: "",
      loading: true,
      imageError: false
    };
  }

  componentDidMount = async () => {
    var query = this.props.originalProps.router.query;

    var origin = await dvb.findStop(query.origin);
    var destination = await dvb.findStop(query.destination);

    var time = query.time.split(":");
    var date = query.date.split(".");

    var departure = new Date();
    departure.setUTCHours(time[0]);
    departure.setUTCMinutes(time[1]);
    departure.setUTCFullYear(date[2], date[1] - 1, date[0]);

    var route = await dvb
      .route(origin[0].id, destination[0].id, departure)
      .catch((error) => {
        this.setState({
          err: error.name + ": " + error.message,
          loading: false
        });
      });

    if (this.state.err === "") {
      console.log(route);
      this.setState({ route: route, loading: false });
    }
  };

  render() {
    return (
      <div className="p-6 pt-12 sm:p-20 lg:pl-56">
        <Head>
          <title>Public Transport Planner</title>
        </Head>
        <div className="flex">
          <Link href="/planner" as="/planner">
            <button className="text-gray-300 bg-gray-900 px-4 h-12 w-12 mr-3 rounded sm:hover:shadow-outline focus:outline-none trans">
              <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
            </button>
          </Link>
          <h1 className="font-semibold font-sans text-2xl my-auto text-gray-200 mb-3 leading-tight">
            Public Transport Planner
          </h1>
        </div>

        {this.state.loading ? (
          <div className="rounded overflow-hidden max-w-xs pb-2 pt-3">
            <BarLoader
              heightUnit={"px"}
              height={4}
              widthUnit={"px"}
              width={330}
              color={"#e2e8f0"}
              loading={true}
            />
          </div>
        ) : this.state.err !== "" ? (
          <p className="p-1 pl-2 bg-red-600 text-gray-300 mt-4 mb-5 max-w-xs rounded font-semibold">
            {this.state.err}
          </p>
        ) : (
          <></>
        )}
        {this.state.err === "" &&
        this.state.route.trips &&
        this.state.route.trips.length > 0 ? (
          <div>
            {this.state.route.trips.map((trip, index) => (
              <div className="p-1 pl-4 pr-4 pt-4 bg-gray-900 text-gray-300 mt-4 max-w-sm rounded">
                {trip.departure !== undefined ? (
                  <p className="leading-tight font-semibold truncate mt-2">
                    {trip.departure.platform !== undefined ? (
                      <>
                        <span className="uppercase font-mono tracking-wide font-bold text-sm text-gray-600">
                          {trip.departure.platform.type +
                            " " +
                            trip.departure.platform.name}
                        </span>{" "}
                        <br></br>
                      </>
                    ) : (
                      <></>
                    )}
                    {trip.departure.name + ", " + trip.departure.city} <br></br>
                    <span className="tracking-tighter text-gray-500 font-light font-mono">
                      {String(trip.departure.time.getHours()).padStart(2, "0") +
                        ":" +
                        String(trip.departure.time.getMinutes()).padStart(
                          2,
                          "0"
                        ) +
                        " " +
                        String(trip.departure.time.getDate()).padStart(2, "0") +
                        "." +
                        String(trip.departure.time.getMonth() + 1).padStart(
                          2,
                          "0"
                        ) +
                        "." +
                        String(trip.departure.time.getFullYear())}
                    </span>
                  </p>
                ) : (
                  <></>
                )}
                <div className="my-3 ml-2 font-mono">
                  <p>
                    <FontAwesomeIcon
                      icon={faExchangeAlt}
                      className="mr-3 h-4"
                    ></FontAwesomeIcon>
                    <span className="my-auto">
                      {trip.interchanges}{" "}
                      {trip.interchanges === 1 ? "interchange" : "interchanges"}
                    </span>
                  </p>
                  <p>
                    <FontAwesomeIcon
                      icon={faClock}
                      className="mr-3 h-4"
                    ></FontAwesomeIcon>
                    <span className="my-auto">
                      {trip.duration < 60
                        ? moment
                            .duration(trip.duration, "minutes")
                            .format("m") +
                          (moment
                            .duration(trip.duration, "minutes")
                            .format("m") === "1"
                            ? " minute"
                            : " minutes")
                        : moment
                            .duration(trip.duration, "minutes")
                            .format("h") +
                          (moment
                            .duration(trip.duration, "minutes")
                            .format("h") === "1"
                            ? " hour"
                            : " hours")}
                    </span>
                  </p>
                </div>
                {trip.arrival !== undefined ? (
                  <>
                    <p className="leading-tight font-semibold truncate">
                      {trip.arrival.platform !== undefined ? (
                        <>
                          <span className="uppercase font-mono tracking-wide font-bold text-sm text-gray-600">
                            {trip.arrival.platform.type +
                              " " +
                              trip.arrival.platform.name}
                          </span>{" "}
                          <br></br>
                        </>
                      ) : (
                        <></>
                      )}
                      {trip.arrival.name + ", " + trip.arrival.city} <br></br>
                      <span className="tracking-tighter text-gray-500 font-light font-mono">
                        {String(trip.arrival.time.getHours()).padStart(2, "0") +
                          ":" +
                          String(trip.arrival.time.getMinutes()).padStart(
                            2,
                            "0"
                          ) +
                          " " +
                          String(trip.arrival.time.getDate()).padStart(2, "0") +
                          "." +
                          String(trip.arrival.time.getMonth() + 1).padStart(
                            2,
                            "0"
                          ) +
                          "." +
                          String(trip.arrival.time.getFullYear())}
                      </span>
                    </p>
                  </>
                ) : (
                  <></>
                )}
                <hr className="mt-6 mb-3 border-gray-700"></hr>
                {trip.nodes.map((node, index) => (
                  <div className="mb-6">
                    <div className="flex justify-between my-2">
                      <div className="flex">
                        <img
                          style={
                            this.state.imageError
                              ? { display: "hidden", marginRight: "0" }
                              : {
                                  height: "24px",
                                  marginRight: "0.5rem"
                                }
                          }
                          className="my-auto w-auto"
                          src={
                            typeof node.line === "string" &&
                            node.line.includes("U") &&
                            node.mode.title.includes("undefined")
                              ? "https://upload.wikimedia.org/wikipedia/commons/a/a3/U-Bahn.svg"
                              : node.mode.title.includes("taxi")
                              ? "https://www.dvb.de/assets/img/trans-icon/transport-alita.svg"
                              : node.mode.icon_url
                          }
                          onError={() => {
                            this.setState({ imageError: true });
                          }}
                        />
                        <div className="w-48 leading-tight">
                          <p className="font-semibold truncate mr-1">
                            {node.line === "" ? node.mode.title : node.line}
                          </p>
                          <p className="truncate">{node.direction}</p>
                        </div>
                      </div>
                      <p className="my-auto whitespace-no-wrap text-gray-600 tracking-wide mr-4">
                        {node.duration} min
                      </p>
                    </div>
                    {node.departure !== undefined &&
                    node.arrival !== undefined ? (
                      <div className="border-l-2 border-gray-700 pl-2 ml-2 text-gray-500 leading-tight">
                        <h3 className="text-gray-400 mb-2">
                          {node.departure.name + ", " + node.departure.city}
                          {node.stops.length > 0 &&
                          typeof node.stops[0].platform !== "undefined" ? (
                            <p className="uppercase font-mono tracking-wide font-bold text-sm text-gray-600">
                              {String(node.departure.time.getHours()).padStart(
                                2,
                                "0"
                              ) +
                                ":" +
                                String(
                                  node.departure.time.getMinutes()
                                ).padStart(2, "0") +
                                " | " +
                                node.stops[0].platform.type +
                                " " +
                                node.stops[0].platform.name}
                            </p>
                          ) : (
                            <></>
                          )}
                        </h3>
                        <h3 className="text-gray-400">
                          {node.arrival.name + ", " + node.arrival.city}
                          {node.stops.length > 0 &&
                          typeof node.stops[node.stops.length - 1].platform !==
                            "undefined" ? (
                            <p className="uppercase font-mono tracking-wide font-bold text-sm text-gray-600">
                              {String(node.arrival.time.getHours()).padStart(
                                2,
                                "0"
                              ) +
                                ":" +
                                String(node.arrival.time.getMinutes()).padStart(
                                  2,
                                  "0"
                                ) +
                                " | " +
                                node.stops[node.stops.length - 1].platform
                                  .type +
                                " " +
                                node.stops[node.stops.length - 1].platform.name}
                            </p>
                          ) : (
                            <></>
                          )}
                        </h3>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default Index;
