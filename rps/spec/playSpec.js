const {Requests, Round, FakeRoundRepo, RoundRepoContract} = require("../src/rps")

describe("play", function () {
    let requests

    beforeEach(function () {
        requests = new Requests(new FakeRoundRepo())
    })

    describe("p1 wins scenarios", function () {
        let observer

        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["p1Wins"])
        })

        it("rock v. scissors", function () {
            requests.playRound("rock", "scissors", observer)

            expect(observer.p1Wins).toHaveBeenCalled()
        })

        it("scissors v. paper", function () {
            requests.playRound("scissors", "paper", observer)

            expect(observer.p1Wins).toHaveBeenCalled()
        })

        it("paper v. rock", function () {
            requests.playRound("paper", "rock", observer)

            expect(observer.p1Wins).toHaveBeenCalled()
        })

    })

    describe("p2 win scenarios", function () {
        let observer

        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["p2Wins"])
        })

        it("scissors v. rock", function () {
            requests.playRound("scissors", "rock", observer)

            expect(observer.p2Wins).toHaveBeenCalled()
        })

        it("paper v. scissors", function () {
            requests.playRound("paper", "scissors", observer)

            expect(observer.p2Wins).toHaveBeenCalled()
        })

        it("rock v. paper", function () {
            requests.playRound("rock", "paper", observer)

            expect(observer.p2Wins).toHaveBeenCalled()
        })
    })

    describe("tie scenarios", function () {
        let observer

        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["tie"])
        })

        it("rock v. rock", function () {
            requests.playRound("rock", "rock", observer)

            expect(observer.tie).toHaveBeenCalled()
        })

        it("paper v. paper", function () {
            requests.playRound("paper", "paper", observer)

            expect(observer.tie).toHaveBeenCalled()
        })

        it("scissors v. scissors", function () {
            requests.playRound("scissors", "scissors", observer)

            expect(observer.tie).toHaveBeenCalled()
        })
    })

    describe("invalid scenarios", function () {
        let observer

        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["invalid"])
        })

        it("[invalid] v. rock", function () {
            requests.playRound(Math.random(), "rock", observer)

            expect(observer.invalid).toHaveBeenCalled()
        })

        it("rock v. [invalid]", function () {
            requests.playRound("rock", Math.random(), observer)

            expect(observer.invalid).toHaveBeenCalled()
        })

        it("INVALID v. INVALID", function () {
            requests.playRound("INVALID", "INVALID", observer)

            expect(observer.invalid).toHaveBeenCalled()
        })

    })
})

describe("history", function () {
    describe("when no rounds have been played", function () {
        it("tells the observer there are no rounds", function () {
            let observer = jasmine.createSpyObj("observer", ["noRounds"])

            new Requests(new FakeRoundRepo()).getHistory(observer)

            expect(observer.noRounds).toHaveBeenCalled()
        })
    })

    describe("when some rounds have been played before", function () {
        let observer
        let requests
        let roundRepo

        beforeEach(function () {
            roundRepo = new FakeRoundRepo()
            requests = new Requests(roundRepo)
            observer = jasmine.createSpyObj("observer", ["rounds", "p1Wins", "p2Wins", "tie", "invalid"])
            requests.playRound("rock", "scissors", observer)
            requests.playRound("scissors", "rock", observer)
            requests.playRound("rock", "rock", observer)
            requests.playRound("rock", "sailboat", observer)
        })

        it("gives the observer the rounds", function () {
            requests.getHistory(observer)

            expect(observer.rounds).toHaveBeenCalledWith([
                new Round("rock", "scissors", "p1"),
                new Round("scissors", "rock", "p2"),
                new Round("rock", "rock", "tie"),
                new Round("rock", "sailboat", "invalid"),
            ])
        })

    })
})


describe("FakeRoundRepo", function () {
    RoundRepoContract(() => new FakeRoundRepo())
})

