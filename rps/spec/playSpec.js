function Requests() {
    this.playRound = function (p1Throw, p2Throw, observer) {
        new PlayRoundRequest(p1Throw, p2Throw, observer).execute()
    }
}

function PlayRoundRequest(p1Throw, p2Throw, observer){
    this.execute = function(){
        if (isInvalid(p1Throw) || isInvalid(p2Throw))
            observer.invalid()
        else if (isTie())
            observer.tie()
        else if (p1Wins())
            observer.p1Wins()
        else
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

describe("play", function () {
    let requests

    beforeEach(function () {
        requests = new Requests()
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