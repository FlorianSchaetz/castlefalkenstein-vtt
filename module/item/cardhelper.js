	/**
	 * @returns {array} An array with all actors that are of type "character"
	 */
	export const getPlayers = function() 
	{
		var players = [];
		var allActors = ActorDirectory.collection;
		allActors.forEach( (value, key) => {
		  if (value.data.type === "character")
			{
				players.push(value);
		}});
		return players;
	}
	
	/**
	 * Clears the decks of all actors that are of type "character"
	 */
	export const emptyPlayerDecks = function() {
		var players = getPlayers();	
		players.forEach( (p) => p.update( { "-=data.cards.card0" : null } ) );			
		players.forEach( (p) => p.update( { "-=data.cards.card1" : null } ) );			
		players.forEach( (p) => p.update( { "-=data.cards.card2" : null } ) );			
		players.forEach( (p) => p.update( { "-=data.cards.card3" : null } ) );	
	}
	
		
	/**
	 * Clears the decks of all actors that are of type "character"
	 */
	export const emptyPlayerSorceryDecks = function() {
		var players = getPlayers();	
		players.forEach( (p) => p.update( { "data.gatheredpower" : [] } ) );					
	}
	
	/**
	 * @returns {boolean} true, if the given player actor has a free slot in their card deck
	 */
	export const hasEmptyField = function(player) {
		
		var cards = player.data.data.cards;
		
		if (cards.card0 && cards.card1 && cards.card2 && cards.card3 ) {
			return false;
		}
		
		return true;
	}
	
	/**
	 * Deals a given card to the player actor's card deck. It is assumed that the player actor has a free slot in their card deck.
	 *
	 * @param {CastleFalkensteinActor} player The player to deal the card to
	 * @param {object} card The card to deal
	 */
	export const dealCard = async function(player, card) {
		var cards = player.data.data.cards;
		
		if (!cards.card0) {
			await player.update({"data.cards.card0" : card});			
		}
		else if (!cards.card1) {
			await player.update({"data.cards.card1" : card});
		}
		else if (!cards.card2) {
			await player.update({"data.cards.card2" : card});
		}
		else if (!cards.card3) {
			await player.update({"data.cards.card3" : card});
		}
		else {
			console.error("No slots for for" + player.name);
		}
	}	
	
		/**
	 * Deals a given card to the player actor's sorcery card list. 
	 *
	 * @param {CastleFalkensteinActor} player The player to deal the card to
	 * @param {object} card The card to deal
	 */
	export const dealSorceryCard = async function(player, card) {
		var cards = player.data.data.gatheredpower.slice();		
		cards.push(card);		
		await player.update({"data.gatheredpower" : cards});					
	}	
	
	/**
	 * This method deals cards from the given deck to the given player actor until they have no free slots in their card deck left.
	 *
	 * @param {array} deck The array of cards to take deal the cards from
	 * @param {CastleFalkensteinActor} player The player actor to deal the cards to
	 */
	export const dealCardsToPlayer = async function(deck, player)
	{
		if (!player)
		{
			alert("No player");
			return;
		}	  
		
		while(hasEmptyField(player))
		{
			var card = deck.pop();
			if (!card) {
				alert("No card left");
				return;
			}

			console.log("Dealt " + card.name + "to " + player.name);
			await dealCard(player, card);			
		}
	}
	
	/**
	 * This method deals cards from the given deck to the given player actor until they have no free slots in their card deck left.
	 *
	 * @param {array} deck The array of cards to take deal the cards from
	 * @param {CastleFalkensteinActor} player The player actor to deal the cards to
	 */
	export const dealSorceryCardToPlayer = async function(deck, player)
	{
		if (!player)
		{
			alert("No player");
			return;
		}	  
		
		var card = deck.pop();
		if (!card) {
			alert("No card left");
			return;
		}
		
		await dealSorceryCard(player, card);			
		
		console.log("Dealt " + card.name + "to sorcery card list " + player.name);		
	}
	
	/**
	 * @returns {array} An array of all cards currently in the decks of all players
	 */
	export const getAllPlayerCards = function() 
	{
		var playerCards = [];
		
		var players = getPlayers();	
		
		players.forEach( (p) => {
			var cards = p.data.data.cards;

			if (cards.card0) {
				playerCards.push(cards.card0);
			}
			if (cards.card1) {
				playerCards.push(cards.card1);
			}
			if (cards.card2) {
				playerCards.push(cards.card2);
			}
			if (cards.card3) {
				playerCards.push(cards.card3);
			}
		});
		
		return playerCards;
	}
	
	/**
	 * @returns {array} A new array of cards with all cards except those already in any player's deck
	 */
	export const createDeckWithoutPlayerCards = function()
	{
		var deck = createDeck();
		var playerCards = getAllPlayerCards();
	
		while(playerCards.length > 0) 
		{
			var card = playerCards.pop();
			for(var i=0; i<deck.length; i++) 
			{
				var deckCard = deck[i];
				if (deckCard.filename === card.filename) {
					deck.splice(i,1);
					break;				 
				}
			}		 
		}
		
		return deck;
	}
	
	/**
	  * @returns {array} A new deck, filled with 50 cards (12 of each suit plus 2 jokers)
	  */
	export const createDeck = function()
	{
		var suits = ["spades", "clubs", "hearts", "diamonds"];
		var deck = [];
		for (var s = 0; s < 4; s++) {
			for (var i = 2; i <= 13; i++) {				
				deck.push(createCard(i, suits[s]));
			} 	
		} 
		
		deck.push(createCard(14, "joker"));
		var blackjoker = createCard(14, "joker");
		blackjoker.filename = "black_joker.png";
		deck.push(blackjoker);
		
		shuffle(deck);
		return deck;		
	}
	
	/**
	 * @param {number} value The value of the card (2 - 14), with 14 being a joker
	 * @param {string} suit The suit of the card (one of spades, hearts, diamonds, clubs)
	 * @returns {object} A new card object for the given values
	 */
	export const createCard = function(value, suit)
	{
		var card = {					
					suit : suit,
					value : value,
					selected : false,
					name : cardName(value, suit),
					filename : cardFileName(value, suit)
				};
		return card;
	}
	
	/** 
	 * @param {number} value The value of the card
	 * @param {string} suit The suit of the card
	 * @returns {string} The filename of the image representing this card
	 */
	export const cardFileName = function(value, suit)
	{
		if (!value)
			return "";
		
		if (value < 11) 
		{	
			return "" + value + "_of_" + suit + ".png";
		}
		
		if (value == 11) 
		{
			return "jack_of_" + suit + ".png";
		}
		
		if (value == 12) 
		{
			return "queen_of_" + suit + ".png";
		}
		
		if (value == 13) 
		{
			return "king_of_" + suit + ".png";
		}
		
		if (value == 14) 
		{
			return "red_joker.png";
		}
		
		return "";
	}
	
	/** 
	 * @param {number} value The value of the card
	 * @param {string} suit The suit of the card
	 * @returns {string} The human readable name of this card (@ToDo: Refactor into card key for different languages)
	 */
	export const cardName = function(value, suit)
	{
		if (!value)
			return "";
		
		if (value < 11) 
		{	
			return "" + value + " of " + suit;
		}
		
		if (value == 11) 
		{
			return "Jack of " + suit;
		}
		
		if (value == 12) 
		{
			return "Queen of " + suit;
		}
		
		if (value == 13) 
		{
			return "King of " + suit;
		}
		
		if (value == 14) 
		{
			return "Joker";
		}
		
		return "";
	}
	
	/**
	 * Shuffles the given array (probably a card deck, but works for all arrays)
	 *
	 * @param {array} array The array to be shuffled
	 */
	export const shuffle = function(array) {
		array.sort(() => Math.random() - 0.5);
	}
	