const React = require("react")
const ReactDom = require("react-dom")
const TestUtils = require("react-dom/test-utils")

class PlayForm extends React.Component {
    constructor () {
        super()
        this.state = {
            message: "",
            p1Throw: "",
            p2Throw: ""
        }
    }

    submit() {
        this.props.rps.play(this.state.p1Throw, this.state.p2Throw, this)
    }

    p1ThrowChanged(event) {
        this.setState({ p1Throw: event.target.value })
    }

    p2ThrowChanged(event) {
        this.setState({ p2Throw: event.target.value })
    }

    p1Wins() {
        this.setState({ message: "P1 Wins!" })
    }

    p2Wins() {
        this.setState({ message: "P2 Wins!" })
    }

    tie() {
        this.setState({ message: "TIE!" })
    }

    invalid() {
        this.setState({ message: "INVALID!" })
    }

    render () {
        return (
            <div>
                <p>{this.state.message}</p>
                <input onChange={this.p1ThrowChanged.bind(this)} type="text" name="p1"/>
                <input onChange={this.p2ThrowChanged.bind(this)} type="text" name="p2"/>
                <button onClick={this.submit.bind(this)}>DO IT</button>
            </div>
        )
    }
}

describe("PlayForm", function () {
    let domFixture
    beforeEach(setupDom)
    afterEach(teardownDom)

    describe("when input is invalid", function () {
        beforeEach(function () {
            renderApp({
                play(p1Throw, p2Throw, observer) {
                    observer.invalid()
                }
            })
        })

        it("tells the user that the input is invalid", function () {
            expect(pageText()).not.toContain("INVALID!")
            submitForm()
            expect(pageText()).toContain("INVALID!")
        })
    })

    describe("when p1 wins", function () {
        beforeEach(function () {
            renderApp({
                play(p1Throw, p2Throw, observer) {
                    observer.p1Wins()
                }
            })
        })

        it("tells the user that P1 wins", function () {
            expect(pageText()).not.toContain("P1 Wins!")
            submitForm()
            expect(pageText()).toContain("P1 Wins!")
        })
    })

    describe("when p2 wins", function () {
        beforeEach(function () {
            renderApp({
                play(p1Throw, p2Throw, observer) {
                    observer.p2Wins()
                }
            })
        })

        it("tells the user that P2 wins", function () {
            expect(pageText()).not.toContain("P2 Wins!")
            submitForm()
            expect(pageText()).toContain("P2 Wins!")
        })
    })

    describe("for a tie", function () {
        beforeEach(function () {
            renderApp({
                play(p1Throw, p2Throw, observer) {
                    observer.tie()
                }
            })
        })

        it("tells the user that it was a tie", function () {
            expect(pageText()).not.toContain("TIE!")
            submitForm()
            expect(pageText()).toContain("TIE!")
        })
    })

    it("it passes the entered throws to RPS", function () {
        let spyRps = jasmine.createSpyObj("spyRps", ["play"])
        renderApp(spyRps)

        fillInput("p1", "p1-throw")
        fillInput("p2", "p2-throw")

        submitForm()
        expect(spyRps.play).toHaveBeenCalledWith("p1-throw", "p2-throw", jasmine.any(Object))
    })

    function submitForm () {
        domFixture.querySelector("button").click()
    }

    function fillInput (name, value) {
        let input = domFixture.querySelector(`[name='${name}']`)
        input.value = value
        TestUtils.Simulate.change(input)
    }

    function pageText () {
        return domFixture.innerText
    }

    function renderApp (rps) {
        ReactDom.render(
            <PlayForm rps={rps}/>,
            domFixture
        )
    }

    function setupDom () {
        domFixture = document.createElement("div")
        document.body.appendChild(domFixture)
    }

    function teardownDom () {
        domFixture.remove()
    }
})