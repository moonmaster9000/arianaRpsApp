const React = require("react")
const ReactDom = require("react-dom")
const TestUtils = require("react-dom/test-utils")

const {Round, RoundRepoContract} = require("rps")
const PlayForm = require("../src/PlayForm")
const LocalStorageRoundRepo = require("../src/LocalStorageRoundRepo")

describe("PlayForm", function () {
    let domFixture
    beforeEach(setupDom)
    afterEach(teardownDom)

    describe("when input is invalid", function () {
        beforeEach(function () {
            renderApp({
                playRound(p1Throw, p2Throw, observer) {
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
                playRound(p1Throw, p2Throw, observer) {
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
                playRound(p1Throw, p2Throw, observer) {
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
                playRound(p1Throw, p2Throw, observer) {
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
        let spyRps = jasmine.createSpyObj("spyRps", ["playRound"])
        renderApp(spyRps)

        fillInput("p1", "p1-throw")
        fillInput("p2", "p2-throw")

        submitForm()
        expect(spyRps.playRound).toHaveBeenCalledWith("p1-throw", "p2-throw", jasmine.any(Object))
    })

    describe("when the rps module tells us there are no rounds", function () {
        beforeEach(function () {
            renderApp({
                getHistory(observer) {
                    observer.noRounds()
                }
            })
        });

        it("display NO ROUNDS on the page", function () {
            expect(pageText()).toContain("NO ROUNDS")
        });

    });

    describe("when the rps modules sends us rounds", function () {
        beforeEach(function () {
            renderApp({
                getHistory(observer){
                    observer.rounds([new Round("foo", "bar", "baz")])
                }
            })
        });

        it("should display the rounds", function () {
            expect(pageText()).toContain("foo", "bar", "baz")
        });
    });

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
        rps.getHistory = rps.getHistory || function(){}

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

RoundRepoContract(() => new LocalStorageRoundRepo())