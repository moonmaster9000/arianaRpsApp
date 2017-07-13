const React = require("react")
const ReactDOM = require("react-dom")
const {Requests} = require("rps")
const LocalStorageRoundRepo = require("./src/LocalStorageRoundRepo")
const PlayForm = require("./src/PlayForm")

const roundRepo = new LocalStorageRoundRepo()

ReactDOM.render(
    <PlayForm rps={new Requests(roundRepo)}/>,
    document.getElementById("app")
)