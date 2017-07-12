function Requests() {
    this.play = function (p1, p2, observer) {
        new PlayRequest(p1, p2, observer).execute()
    }
}

function PlayRequest(p1, p2, observer){
    this.execute = function(){
        if (isInvalid(p1) || isInvalid(p2))
            observer.invalid()
        else if (draw())
            observer.tie()
        else if (p1Won())
            observer.p1Wins()
        else
            observer.p2Wins()
    }

    function isInvalid(theShape) {
        return !["rock", "paper", "scissors"].includes(theShape)
    }

    function draw() {
        return p1 === p2
    }

    function p1Won() {
        return p1 === "rock" && p2 === "scissors" ||
            p1 === "scissors" && p2 === "paper" ||
            p1 === "paper" && p2 === "rock"
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
            requests.play("rock", "scissors", observer)

            expect(observer.p1Wins).toHaveBeenCalled()
        })

        it("scissors v. paper", function () {
            requests.play("scissors", "paper", observer)

            expect(observer.p1Wins).toHaveBeenCalled()
        })

        it("paper v. rock", function () {
            requests.play("paper", "rock", observer)

            expect(observer.p1Wins).toHaveBeenCalled()
        })

    })

    describe("p2 win scenarios", function () {
        let observer

        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["p2Wins"])
        })

        it("scissors v. rock", function () {
            requests.play("scissors", "rock", observer)

            expect(observer.p2Wins).toHaveBeenCalled()
        })

        it("paper v. scissors", function () {
            requests.play("paper", "scissors", observer)

            expect(observer.p2Wins).toHaveBeenCalled()
        })

        it("rock v. paper", function () {
            requests.play("rock", "paper", observer)

            expect(observer.p2Wins).toHaveBeenCalled()
        })
    })

    describe("tie scenarios", function () {
        let observer

        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["tie"])
        })

        it("rock v. rock", function () {
            requests.play("rock", "rock", observer)

            expect(observer.tie).toHaveBeenCalled()
        })

        it("paper v. paper", function () {
            requests.play("paper", "paper", observer)

            expect(observer.tie).toHaveBeenCalled()
        })

        it("scissors v. scissors", function () {
            requests.play("scissors", "scissors", observer)

            expect(observer.tie).toHaveBeenCalled()
        })
    })

    describe("invalid scenarios", function () {
        let observer

        beforeEach(function () {
            observer = jasmine.createSpyObj("observer", ["invalid"])
        })

        it("[invalid] v. rock", function () {
            requests.play(Math.random(), "rock", observer)

            expect(observer.invalid).toHaveBeenCalled()
        })

        it("rock v. [invalid]", function () {
            requests.play("rock", Math.random(), observer)

            expect(observer.invalid).toHaveBeenCalled()
        })

        it("INVALID v. INVALID", function () {
            requests.play("INVALID", "INVALID", observer)

            expect(observer.invalid).toHaveBeenCalled()
        })

    })
})