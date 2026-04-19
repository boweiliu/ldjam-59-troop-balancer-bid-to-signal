# Troop Balancer: Bid to Signal

Troop Balancer is a 2-player cooperative card game where 2 players are dealt troop cards, take turns silently bidding on a team contract, then deploy their troop cards in one of the 2 lanes, and finally reveal their decisions to see if they fulfilled the contract.

The game is meant to be played multiple times with the same pair of players, accumulating knowledge and conventions specific to that pair of players.

Each game takes from 5 min - 2 hours. Metagame discussion is expected to occupy the majority of the game time, resulting in a total playtime of 5-20 hours.

# GAMEPLAY

1. Decide on a difficulty modifier: medium (1x), difficult (2x), or puzzling (3x).
2. Shuffle and deal hands.
3. Silently bid on a contract.
4. Secretly deploy troops.
5. Conduct battle by revealing all cards and determining the outcome: defeat, victory, or OPTIMAL victory.

## DECK

The deck consists of 24 cards, separated into 3 suits, Red, Green, and Blue, with 8 cards in each suit.

The 8 cards in each suit are:

* 2 copies of `+1` 

* 2 copies of `+2`

* 2 copies of `+4`

* 1 copy of `x 1.5`

* 1 copy of `x 2`

### HANDS

At the start of the game, each player is dealt a private hand of 8 cards from the deck of 24. They may look at their dealt cards.

8 cards remain unused in the deck. These will not be used during the game.

## Bidding

Flip a coin to determine who gets to start bidding. Players alternate bidding. No communication is allowed during this bidding phase.

A valid bid is either `pass`, or is a bid of the form `[number] [color]` where `[number]` is a whole number strictly greater than the last bid, and `[color]` is one of *R*ed, *G*reen, or *B*lue.

The first player to start bidding cannot pass. Bidding does not have to start at `1[color]`, and bids can skip numbers freely. Bidding the same number but a different color from the last bid is NOT permitted.

Bidding ends immediately after any player passes. The final bid determines the contract.

### Example

P1 can start with `1R` .

P2 cannot bid `1G` or `1B`, but can bid anything else, e.g. `3G`.

P1 can bid `10R`.

P2 can pass.

The contract is now `10R`.

## Deployment

There are 2 lanes of combat corresponding to the 2 colors not specified in the contract. For instance, if the contract was 13G, then the 2 lanes are called "Red" and "Blue".

Each player decides silently and simultaneously how to deploy their troops. Troops of the contract color can be deployed into either lane; troops of the other 2 colors must be deployed into their respective lane. All troop cards must be deployed (regardless, there is no incentive not to).

No communication is allowed during this phase. If playing over the table, it is recommended to use a divider so the other player cannot inspect how many cards you are deploying into each lane.

### Example

Suppose player 1 has the following hand:

```
Red:   +1, +4, x2
Green: +2, +2
Blue:  +1, +4, x1.5
```

Suppose that the final bid is `10R`.

Then there are 2 lanes: Green and Blue.

Player 1 might choose to put all their Red troops in the Green lane:

```
GREEN lane: R+1, R+4, Rx2, G+2, G+2
BLUE  lane: B+1, B+4, Bx1.5
```

Or they might try for a more even split:

```
GREEN lane: R+1, Rx2, G+2, G+2
BLUE  lane: B+1, R+4, B+4, Bx1.5, R+1, Rx2, 
```

## Battle

For each lane:

First add up all the additive cards from both players. Then multiply by all the multiplier cards from all players. This is the combat power in each lane.

If the combat power in each lane is at least `[difficulty modifier] x [contract amount]`, then the players are victorious.

Otherwise, if the combat power in either lane is less than the target `[difficulty modifier] x [contract amount]`, then the players lose.

### Example

In the contract for `10R`, in the easy `1x` difficulty mode, suppose player 1 has deployed only 2 troops in the Green lane:

```
p1: G+2, G+2
```

and player 2 has also only deployed 2 cards:

```
p2: G+4, Gx2
```

Then the total combat power in Green is `(2 + 2 + 4) x 2 = 16`. Since this is at least `10`, this lane is sufficient, and we should check the second lane.

Suppose the troops in the Blue lane are:

```
p1: B+1, B+4, Bx1.5, R+1, R+4, Rx2, 
p2: B+1, B+2, B+2,   R+2, R+2, Rx1.5
```

Then the total combat power in Blue is `((1 + 4 + 1 + 4) + (1 + 2 + 2 + 2 + 2)) x 1.5 x 2 x 1.5 = 19 x 4.5 = 85.5`. Since this is also at least `10 x 1`, the players are victorious.

## Extra: optimization and discussion

After players have revelead their troop deployments, it is possible to calculate the optimal bid and score given the distribution of cards in both players' hands. For instance, in the last example, the split amongst the lanes was (16, 85.5), whereas the optimal troop distribution was (39, 42). So they did not have an OPTIMAL victory which would have been at a bid of `39R`.

Players are encouraged to discuss their bidding convention and how they might have bid higher and also better coordinated their troop deployments via sending signals during the bidding phase.
