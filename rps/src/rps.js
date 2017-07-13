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
        if (isInvalid(p1Throw) || isInvalid(p2Throw)){
            handleInvalid()
        }
        else if (isTie()){
            handleTie()
        }
        else if (p1Wins()) {
            handleP1Wins()
        } else{
            handleP2Wins()
        }
    }

    function save(result) {
        roundRepo.save(new Round(p1Throw, p2Throw, result))
    }

    function handleTie() {
        save("tie")
        observer.tie()
    }

    function handleP1Wins() {
        save("p1")
        observer.p1Wins()
    }

    function handleP2Wins() {
        save("p2")
        observer.p2Wins()
    }

    function handleInvalid() {
        save("invalid")
        observer.invalid()
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

function FakeRoundRepo() {
    let rounds = [];

    this.isEmpty = function() {
        return rounds.length === 0;
    }

    this.save = function(round) {
        rounds.push(round)
    }

    this.all = function() {
        return rounds
    }

    this.deleteAll = function(){
        rounds = []
    }
}

function RoundRepoContract(buildRoundRepo) {
    describe("RoundRepo", function () {
        let repo;

        beforeEach(function () {
            repo = buildRoundRepo()
            repo.deleteAll()
        })

        afterEach(function () {
            repo.deleteAll()
        });

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

module.exports = {
    Requests,
    Round,
    FakeRoundRepo,
    RoundRepoContract
}