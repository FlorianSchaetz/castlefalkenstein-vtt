// Import Modules
import { CastleFalkensteinActor } from "./actor/actor.js";
import { CastleFalkensteinActorSheet } from "./actor/actor-sheet.js";
import { CastleFalkensteinItem } from "./item/item.js";
import { CastleFalkensteinItemSheet } from "./item/item-sheet.js";

Hooks.once('init', async function() {

  game.castlefalkenstein = {
    CastleFalkensteinActor,
    CastleFalkensteinItem
  };

  /**
   * Set an initiative formula for the system
   * @type {String}
   
  CONFIG.Combat.initiative = {
    formula: "{{ skillToNumber @skills.perception.value }}",
    decimals: 2
  };
  */
    Combat.prototype._getInitiativeFormula = function(combatant) {
	  const actor = combatant.actor;
	  if ( !actor ) return "1d10";	  
	  const init = skillToNumberFunction(actor.data.data.skills.perception.value);	  
	  return "" + init;
	};
	
  // Define custom Entity classes
  CONFIG.Actor.entityClass = CastleFalkensteinActor;
  CONFIG.Item.entityClass = CastleFalkensteinItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("castlefalkenstein", CastleFalkensteinActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("castlefalkenstein", CastleFalkensteinItemSheet, { makeDefault: true });

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
  
  Handlebars.registerHelper('localizeSkill', function(str) {
    return game.i18n.localize("CastleFalkenstein.Skill." + str.toLowerCase());
  });
  
	Handlebars.registerHelper('ifCond', function(v1, v2, options) {
		if(v1 === v2) {
			return options.fn(this);
		}
		return options.inverse(this);
	});
	
	
	const skillToNumberFunction = function(skill) {
		
		var string = "";
		if (skill) {
			string = skill.toUpperCase();
		}
		
		if(string === "POOR" || string === "PR") {
			return 2;
		}
		if(string === "AVERAGE" || string === "AV") {
			return 4;
		}
		if(string === "GOOD" || string === "GD") {
			return 6;
		}
		if(string === "GREAT" || string === "GR") {
			return 8;
		}
		if(string === "EXCEPTIONAL" || string === "EXC") {
			return 10;
		}
		if(string === "EXTRAORDINARY" || string === "EXT") {
			return 12;
		}
		
		return 0;
	};
	  
	Handlebars.registerHelper('ifNotCond', function(v1, v2, options) {
		if(v1 === v2) {
			return options.inverse(this);
		}
		return options.fn(this);
	});
	
	Handlebars.registerHelper('skillToNumber', skillToNumberFunction);
  
  
});