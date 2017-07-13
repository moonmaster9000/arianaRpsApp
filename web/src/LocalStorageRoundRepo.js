const { Round } = require("rps")

function LocalStorageRoundRepo(){
    let rounds = []

    this.isEmpty = function(){
        return this.all().length === 0
    }

    this.save = function(round){
        rounds.push(round)
        localStorage.setItem("rounds", JSON.stringify(rounds))
    }

    this.all = function(){
        return JSON.parse(localStorage.getItem("rounds")).map(r => new Round(r.p1Throw, r.p2Throw, r.result))
    }

    this.deleteAll = function(){
        localStorage.setItem("rounds", JSON.stringify([]))
    }
}

module.exports = LocalStorageRoundRepo