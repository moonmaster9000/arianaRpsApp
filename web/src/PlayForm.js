const React = require("react")

class PlayForm extends React.Component {
    constructor() {
        super()
        this.state = {
            message: "",
            p1Throw: "",
            p2Throw: ""
        }
    }

    componentDidMount() {
        this.props.rps.getHistory(this)
    }

    noRounds() {
        this.setState({roundsDisplay: <h1>NO ROUNDS</h1>})
    }

    rounds(rs) {
        this.setState({
            roundsDisplay: <ul>
                {rs.map(
                    (r,i) => <li key={i}>{r.p1Throw} {r.p2Throw} {r.result}</li>
                )}
            </ul>
        })
    }


    submit(e) {
        e.preventDefault()
        this.props.rps.playRound(this.state.p1Throw, this.state.p2Throw, this)
        this.props.rps.getHistory(this)
    }

    p1ThrowChanged(event) {
        this.setState({p1Throw: event.target.value})
    }

    p2ThrowChanged(event) {
        this.setState({p2Throw: event.target.value})
    }

    p1Wins() {
        this.setState({message: "P1 Wins!"})
    }

    p2Wins() {
        this.setState({message: "P2 Wins!"})
    }

    tie() {
        this.setState({message: "TIE!"})
    }

    invalid() {
        this.setState({message: "INVALID!"})
    }

    render() {
        return (
            <div>
                <form onSubmit={this.submit.bind(this)}>
                    <p>{this.state.message}</p>

                    <input onChange={this.p1ThrowChanged.bind(this)} type="text" name="p1"/>
                    <input onChange={this.p2ThrowChanged.bind(this)} type="text" name="p2"/>
                    <button>DO IT</button>
                </form>

                {this.state.roundsDisplay}
            </div>
        )
    }
}

module.exports = PlayForm