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
   */
  CONFIG.Combat.initiative = {
    formula: "1d20",
    decimals: 2
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
  
  
});