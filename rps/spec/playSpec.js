function Requests(roundRepo) {
    this.playRound = function (p1Throw, p2Throw, observer) {
        new PlayRoundRequest(p1Throw, p2Throw, observer, roundRepo).execute()
    }

    this.getHistory = function(observer) {
        if(roundRepo.isEmpty()) {
            observer.noRounds()
        } else {
            observer.rounds(roundRepo.all())
        }
    }
}

function PlayRoundRequest(p1Throw, p2Throw, observer, roundRepo){
    this.execute = function(){
        if (isInvalid(p1Throw) || isInvalid(p2Throw))
            observer.invalid()
        else if (isTie())
            observer.tie()
        else if (p1Wins()) {
            roundRepo.save(new Round(p1Throw, p2Throw, "p1"))
            observer.p1Wins()
        } else
            observer.p2Wins()
    }

    function isInvalid(theThrow) {
        return !["rock", "paper", "scissors"].includes(theThrow)
    }

    function isTie() {
        return p1Throw === p2Throw
    }

    function p1Wins() {
        return p1Throw === "rock" && p2Throw === "scissors" ||
            p1Throw === "scissors" && p2Throw === "paper" ||
            p1Throw === "paper" && p2Throw === "rock"
    }
}

function Round(p1Throw, p2Throw, result) {
    this.p1Throw = p1Throw
    this.p2Throw = p2Throw
    this.result = result
}

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
            observer = jasmine.createSpyObj("observer", ["rounds", "p1Wins"])
            requests.playRound("rock", "scissors", observer)
        })

        it("gives the observer the rounds", function () {
            requests.getHistory(observer)

            expect(observer.rounds).toHaveBeenCalledWith([new Round("rock", "scissors", "p1")])
        })

    })
})

function FakeRoundRepo() {
    const rounds = [];

    this.isEmpty = function() {
        return rounds.length === 0;
    }

    this.save = function(round) {
        rounds.push(round)
    }

    this.all = function() {
        return rounds
    }
}

describe("FakeRoundRepo", function () {
    RoundRepoContract(() => new FakeRoundRepo())
})

function RoundRepoContract(buildRoundRepo) {
    describe("RoundRepo", function () {
        let repo;

        beforeEach(function () {
            repo = buildRoundRepo()
        })

        describe("when no rounds have been saved", function () {
            it("returns true from isEmpty", function () {
                expect(repo.isEmpty()).toBe(true)
            })
        })

        describe("when some rounds have been saved", function () {
            const existingRound = new Round(Math.random(), Math.random(), Math.random())

            beforeEach(function () {
                repo.save(existingRound)
            })

            it("returns false from isEmpty", function () {
                expect(repo.isEmpty()).toBe(false)
            })

            it("returns the saved rounds from all", function () {
                expect(repo.all()).toEqual([existingRound])
            })
        })
    })
}