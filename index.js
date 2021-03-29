var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'API-KEY-HERE';
const PREFIX = '!';

const { Kayn, REGIONS } = require('kayn')

const kayn = Kayn('API-KEY-HERE')({
    region: 'euw',
    apiURLPrefix: 'https://%s.api.riotgames.com',
    locale: 'en_EU',
    debugOptions: {
        isEnabled: true,
        showKey: false,
    },
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 1000,
        burst: false,
        shouldExitOn403: false,
    },
    cacheOptions: {
        cache: null,
        timeToLives: {
            useDefault: false,
            byGroup: {},
            byMethod: {},
        },
    },
})

//==============================================================================
//==============================================================================

function games(match, champion){
  var string = "";
  for (var j = 0; j < match.participants.length; j++) {
    if (match.participants[j].championId == champion){
      let itswin = match.participants[j].stats.win
    if (itswin == false){
      string = string + '🟥' + " - ";
    }
    else {
      string = string + '🟦' + " - ";
    }
    let sec = match.gameDuration % 60
    let min = (match.gameDuration - sec)/60
    string = string + match.gameMode + " - " + min + ":" + sec + " - ";
    string = string + " KDA : " + match.participants[j].stats.kills + "/" + match.participants[j].stats.deaths + "/" + match.participants[j].stats.assists;

  }
}
return string;
}

//==============================================================================
//==============================================================================

client.on('message', message => {

  let args = message.content.substring(PREFIX.length).split(" ");

try {

  switch(args[0]){
    /// ========== Sommaire =========
    case 'help' :
      message.delete()
      message.channel.send("**=====Général=====** \n !ping : pong ! \n !hello : hello world \n !love : réagit avec AMOUR \n !roll AdB : Lance A dès de valeur B, trié dans l'ordre croissant \n \n **=====League of Legend=====** \n !keyAPI : lien pour l'API LOL \n !infop *nom* : Affiche le profile d'un joueur \n !masteries *nom* (chiffre) : Affiche les masteries d'un joueur. 3 de base, sinon (chiffre) \n !chest *nom* : Affiche les champions où il vous reste à obtenir un coffre \n")
    break;
    /// ========== Général =========
    case 'clear' :
      message.channel.send('WIP')
    break;
    case 'ping' :
      message.reply('pong !')
    break;
    case 'hello' :
      message.channel.send('Hello world')
    break;
    case 'love' :
     message.react('💞');
    break;
    case 'roll' :
    var nbd = 0;
    var chiffd = 0;
    var messageEnvoie = "";
    var list = [];

    if (args[1] == null){
      message.reply('Warning : First argument lost ')
    }
    else if ((args[1][0] != null)  && !( (-1 != args[1][0].search(/[A-Z]/g)) || (-1 != args[1][0].search(/[a-z]/g)) ) ){
      if ((args[1][1] != null)  && args[1][1] == "d"){
        if ((args[1][2] != null)  && !( (-1 != args[1][2].search(/[A-Z]/g)) || (-1 != args[1][2].search(/[a-z]/g)) ) ){
          if ((args[1][3] != null)  && !( (-1 != args[1][3].search(/[A-Z]/g)) || (-1 != args[1][3].search(/[a-z]/g)) ) ){
            nbd = args[1][0]
            chiffd = args[1][2] + args[1][3]
          }
          else{
            nbd = args[1][0]
            chiffd = args[1][2]
          }
        }
        else{
          message.reply('Warning : Seconde partie de commande incorrecte ')
        }
      }
      else if((args[1][1] != null)  && !( (-1 != args[1][1].search(/[A-Z]/g)) || (-1 != args[1][1].search(/[a-z]/g)) ) ){
        if ((args[1][2] != null)  && args[1][2] == "d"){
          if ((args[1][3] != null)  && !( (-1 != args[1][3].search(/[A-Z]/g)) || (-1 != args[1][3].search(/[a-z]/g)) ) ){
            if ((args[1][4] != null)  && !( (-1 != args[1][4].search(/[A-Z]/g)) || (-1 != args[1][4].search(/[a-z]/g)) ) ){
              nbd = args[1][0]+args[1][1]
              chiffd = args[1][3] + args[1][4]
            }
            else{
              nbd = args[1][0]+args[1][1]
              chiffd = args[1][3]
            }
          }
          else{
            message.reply('Warning : Seconde partie de commande incorrecte  ')
          }
        }
        else{
          message.reply('Warning : d introuvable  ')
        }
      }
      else {
        message.reply('Warning : Seconde partie de commande incorrecte  ')
      }
    }
    else{
      message.reply('Warning : Verifiez votre commande ')
    }
    for (var i = 0; i < nbd; i++) {
      var int = Math.floor(Math.random() * (chiffd) + 1);
      list[i] = int;
    }
    var passage = 0;
    var permutation = true;
    var en_cours;
    while (permutation) {
        permutation = false;
        passage++;
        for (en_cours=0;en_cours<20-passage;en_cours++) {
            if (list[en_cours]>list[en_cours+1]){
                permutation = true;
                var temp = list[en_cours];
                list[en_cours] = list[en_cours+1];
                list[en_cours+1] = temp;
            }
        }
    }
    for (var i = 0; i < list.length; i++) {
      messageEnvoie = messageEnvoie + list[i] + "-"
    }
    message.channel.send(messageEnvoie)
    break;
    /// ========== League of Legend =========
    case 'keyAPI' :
      message.channel.send('https://developer.riotgames.com/')
    break;
    case 'infop' :
      listsinfop = [];
      try {
        if (args[1] == null){
          message.reply('Warning : Besoin dun nom')
        }
        else if (args[2] != null){
            message.reply('Warning : Besoin dun seul nom')
        }
        else {
              message.channel.send('Veuillez patienter... [10sec - 30sec]')
                .then(msg => {
                  msg.delete({timeout: 10500})
              })

              const main = async () => {

                const summoner2 = await kayn.Summoner.by.name(args[1]);
                console.log(summoner2.name)
              }

              kayn.Summoner.by.name(args[1]).callback(function(err, summoner) {
                listsinfop[0] = summoner.name;
                listsinfop[1] = summoner.summonerLevel;

                var lvl = summoner.summonerLevel;

                while (lvl >= 100){
                  lvl = lvl - 100;
                }

                if((lvl >= 0) && (lvl < 25)){
                  listsinfop[2] = "#E6E6E6";
                }
                else if((lvl >= 25) && (lvl < 50)){
                  listsinfop[2] = "#7ACA37";
                }
                else if((lvl >= 50) && (lvl < 75)){
                  listsinfop[2] = "#4A8510";
                }
                else if((lvl >= 75) && (lvl < 100)){
                  listsinfop[2] = "#106885";
                }

              kayn.League.Entries.by.summonerID(summoner.id).callback(function(err, ranks) {

                for (var i = 0; i < ranks.length; i++) {
                  if (ranks[i].queueType == "RANKED_FLEX_SR") {
                    listsinfop[3] = ranks[i].tier
                    listsinfop[4] = ranks[i].rank
                    listsinfop[5] = ranks[i].leaguePoints
                  }
                  else if (ranks[i].queueType == "RANKED_SOLO_5x5") {
                    listsinfop[6] = ranks[i].tier
                    listsinfop[7] = ranks[i].rank
                    listsinfop[8] = ranks[i].leaguePoints
                  }

                }

                if (listsinfop[3] == null){
                  listsinfop[3] = "Iron";
                  listsinfop[4] = "V";
                  listsinfop[5] = 0;
                }
                else if(listsinfop[6] == null){
                  listsinfop[6] = "Iron";
                  listsinfop[7] = "V";
                  listsinfop[8] = 0;
                }

                messageEnvoie = messageEnvoie +  "*=====Games=====* \n"

                kayn.Matchlist.by.accountID(summoner.accountId).callback(function(err, matchs) {

                    kayn.Match.get(matchs.matches[0].gameId).callback(function(err, match) {
                      listsinfop[9] = games(match, matchs.matches[0].champion);

                      kayn.Match.get(matchs.matches[1].gameId).callback(function(err, match) {
                        listsinfop[10] = games(match, matchs.matches[1].champion)

                        kayn.Match.get(matchs.matches[2].gameId).callback(function(err, match) {
                          listsinfop[11] = games(match, matchs.matches[2].champion)

                          kayn.Match.get(matchs.matches[3].gameId).callback(function(err, match) {
                            listsinfop[12] = games(match, matchs.matches[3].champion)

                            kayn.Match.get(matchs.matches[4].gameId).callback(function(err, match) {
                              listsinfop[13] = games(match, matchs.matches[4].champion)

                              message.delete()
                              var InfoPEmbed = new Discord.MessageEmbed()
                                .setColor(listsinfop[2])
                                .setAuthor("Player statistics")
                                .setTitle(listsinfop[0])
                                .setDescription(listsinfop[1] + " lvl")
                                .setThumbnail("http://ddragon.leagueoflegends.com/cdn/11.5.1/img/profileicon/"+summoner.profileIconId+".png")
                                .addFields(
                                  {name:"RF", value: listsinfop[3] + listsinfop[4] + " - " + listsinfop[5] + "LP"},
                                  {name:"RS", value: listsinfop[6] + listsinfop[7] + " - " + listsinfop[8] + "LP"},
                                  {name:"Match", value: listsinfop[9] + "\n" + listsinfop[10] + "\n" + listsinfop[11] + "\n" +  listsinfop[12] + "\n"+  listsinfop[13] + "\n"},
                                );

                                message.channel.send(InfoPEmbed);

                              })
                            })
                          })
                        })
                      })
                    })
                })
              })
          }
      } catch (e) {
        message.channel.send("Erreur : " + e)
      }
    break;
    case 'masteries' :

    listsmasterie = [];
    listChampname = [];

    if (args[1] == null){
      message.reply('Warning : Besoin dun nom')
    }
    else if ((args[2] != null) && ( (-1 != args[2].search(/[A-Z]/g)) || (-1 != args[2].search(/[a-z]/g)) ) ){
        message.reply('Warning : Second argument invalide : Pas un chiffre')
    }
    else {
      message.channel.send('Veuillez patienter... [10sec - 30sec]')
        .then(msg => {
          msg.delete({timeout: 8000})
      })

      if (args[2] != null){
        compteur = args[2];
      }
      else{
        compteur = 3;
      }

      messageEnvoie = ""
      kayn.Summoner.by.name(args[1]).callback(function(err, summoner) {
        kayn.ChampionMastery.list(summoner.id).callback(function(err, champs) {

          var listmast = [];
          for (var u = 0; u < compteur; u++) {
            listmast.push(champs[u]);
          }

            var request = require('request');
            var version = "10.25.1"

            request('http://ddragon.leagueoflegends.com/cdn/' + version + '/data/de_DE/champion.json', function (error, response, body) {

              let list = JSON.parse(body);
              let championList = list.data;

              for(var j=0 ; j < listmast.length; j++){
              for (var virgule in championList) {

                if (championList[virgule].key == listmast[j].championId) {
                  listChampname[j] = championList[virgule].id
                  listsmasterie[j] = "M" + listmast[j].championLevel + " - " + listmast[j].championPoints + " pts\n"
                }
              }
            }

            message.delete()
            var MasteriesEmbed = new Discord.MessageEmbed()
              .setColor("#7ED321")
              .setAuthor("Masteries statistics")
              .setTitle(summoner.name)
              .setThumbnail("http://ddragon.leagueoflegends.com/cdn/11.5.1/img/profileicon/"+summoner.profileIconId+".png");

            for (var c = 0; c < compteur; c++) {
              MasteriesEmbed.addFields({name: listChampname[c],value: listsmasterie[c] + "\n"});
            }

            message.channel.send(MasteriesEmbed);

          })
        })
      })
    }
    break;
    case 'chest' :

    var stringchest = "";

    if (args[1] == null){
      message.reply('Warning : Besoin dun nom')
    }
    else if (args[2] != null){
        message.reply('Warning : Besoin dun seul nom')
    }
    else {
      message.channel.send('Veuillez patienter... [30sec - 2min]')
        .then(msg => {
          msg.delete({timeout: 8000})
      })

      kayn.Summoner.by.name(args[1]).callback(function(err, summoner) {
        kayn.ChampionMastery.list(summoner.id).callback(function(err, champs) {

          var listchest = [];
          for (var i = 0; i < champs.length; i++) {
            if (champs[i].chestGranted == false) {
              listchest.push(champs[i].championId);
            }
          }
          var request = require('request');
          var version = "10.25.1"

          request('http://ddragon.leagueoflegends.com/cdn/' + version + '/data/de_DE/champion.json', function (error, response, body) {

            let list = JSON.parse(body);
            let championList = list.data;

            for(var j = 0 ; j < listchest.length;j++) {
              for (var virgule in championList) {

                if (championList[virgule].key == listchest[j]) {
                  stringchest = stringchest + championList[virgule].id + "-"
                }
              }
            }

            message.delete()

            var ChestEmbed = new Discord.MessageEmbed()
              .setColor("#7ED321")
              .setAuthor("Chest statistics")
              .setTitle(summoner.name)
              .setThumbnail("http://ddragon.leagueoflegends.com/cdn/11.5.1/img/profileicon/"+summoner.profileIconId+".png")
              .addFields({name : "Chest availables on :", value : stringchest });

            message.channel.send(ChestEmbed);
          })
        })
      })
    }
    break;
    case 'infoc' :

    var RegExpLane = new RegExp(/top|mid|bot|supp|jgl/g);

    if (args[1] == null){
      message.channel.send("Error : Champion name missing") //Nom champion présent ?
    }
    else if (args[2] == null){
      message.channel.send("Error : Lane missing")//Lane présente ?
    }
    else if (args[2].search(RegExpLane) == -1){
      message.channel.send("Error : Lane invalid")//Lane valide ?
    }
    else{

      args[1] = args[1].charAt(0).toUpperCase() + args[1].slice(1); //On met en majuscule la première lettre du nom de champion
      var champSelect = args[1];

      var lane = "";
      if(args[2] == "supp"){ //On modifie les abréviations pour les rendres valides
        lane = "support";
      }
      else if(args[2] == "jgl"){
        lane = "jungle";
      }
      else{
        lane = args[2]; //Attribution
      }

      var request = require('request');
      request('https://euw.op.gg/champion/' + champSelect + '/statistics/' + lane, function (error, response, body) { //Requête pour obtenir la page OPGG du champion, sur sa lane

        var actual = body;
        //On stock le body
        var RegExpBlue = new RegExp("#00cfbc");
        var RegExpEt = new RegExp("&");
        var RegExpStartItemList = new RegExp(/Cull|Dark Seal|Doran's Blade|Doran's Ring|Doran's Shield|Emberknife"|Hailblade|Relic Shield|Spectral Sickle|Spellthief's Edge|Steel Shoulderguards|Tear of the Goddess|Refillable Potion|Health Potion|Corrupting Potion|Control Ward|Oracle Lens|Stealth Ward/g);
        var RegExpBoots = new RegExp(/Boots|Greaves|Treads|Steelcaps|Shoes/g)
        //RegExp pour faire nos recherches
        var ItemList = [];
        var StartItemList = [];
        var BootsList = [];
        var i =0;
        //Variables de stockages des items/Misc
        //===ITEMS===
        while(actual.search(RegExpBlue) != -1) { //Tq on trouve un nom d'item bleu

          var RechercheBleu = actual.search(RegExpBlue);//on prend la position de la recherche
          var cut = actual.substr(RechercheBleu + 12, 50);//on découpe dans le texte pour le rendre plus court
          var RechercheEt = cut.search(RegExpEt);//on recherche un charactère & (toujours après le nom de l'item)
          var cut2 = cut.substr(0, RechercheEt);//on recoupe pour n'avoir QUE le nom de l'item

          var boolTrouve = true;

          if (cut2.search(RegExpStartItemList) != -1){ //si l'item est un item de start

            for (var v = 0; v < StartItemList.length; v++) {
              if(StartItemList[v] == cut2){ //si déjà présent => false
                boolTrouve = false;
              }
            }
            if(boolTrouve){
              StartItemList[i] = cut2;
            }
          }
          else if(cut2.search(RegExpBoots) != -1){//si l'item est un item type boots
            for (var v = 0; v < BootsList.length; v++) {
              if(BootsList[v] == cut2){//si déjà présent => false
                boolTrouve = false;
              }
            }
            if(boolTrouve){
              BootsList[i] = cut2;
            }
          }
          else{
            for (var v = 0; v < ItemList.length; v++) {//si l'item est une item lambda
              if(ItemList[v] == cut2){//si déjà présent => false
                boolTrouve = false;
              }
            }
            if(boolTrouve){
              ItemList[i] = cut2;
            }
          }

          var actual = actual.substr(RechercheBleu + 12, body.length); //on recoupe le texte APRES notre item, pour trouver els autres
          i++

        }
        //===RUNES&SPELL===
        //Comme pour les items, mais avec des noms en jaune !
        var actual = body;
        var RegExpYellow = new RegExp("#ffc659");
        var RegExpGray = new RegExp("e_grayscale&amp");
        var RegExpActiveRun = new RegExp("perk-page__item--active")
        var RegExpActiSRun = new RegExp("active tip")
        var RunList = [];
        var SpellList = [];
        var SousRuneList = [];

        var j=0;
        var m=0;

        while(actual.search(RegExpYellow) != -1) {

          if (j <= 20){
            var RechercheYellow = actual.search(RegExpYellow);
            var cut = actual.substr(RechercheYellow + 12, 50);
            var RechercheEt = cut.search(RegExpEt);
            var cut2 = cut.substr(0, RechercheEt);
            SpellList[j] = cut2;
          }
          if (j > 57 ){
            var RechercheRuneActiv = actual.search(RegExpActiveRun);
            var cutRune = actual.substr(RechercheRuneActiv ,500);
            var RechercheYellow = cutRune.search(RegExpYellow);
            var cut = cutRune.substr(RechercheYellow + 12, 50);
            var RechercheEt = cut.search(RegExpEt);
            var cut2 = cut.substr(0, RechercheEt);
            RunList[m] = cut2;
            actual = actual.substr(RechercheRuneActiv , body.length);
            m++
          }
          var actual = actual.substr(RechercheYellow + 120, body.length);
          j++
        }

        actual = body.substr(body.lenght/2);
        var m=0;

        while(actual.search(RegExpActiSRun) != -1) {

          var RechercheSRuneActiv = actual.search(RegExpActiSRun);
          var cutRune = actual.substr(RechercheSRuneActiv ,100);
          var RechercheYellow = cutRune.search(RegExpYellow);
          var cut = cutRune.substr(RechercheYellow + 12, 50);
          var RechercheEt = cut.search(RegExpEt);
          var cut2 = cut.substr(0, RechercheEt);
          SousRuneList[m] = cut2;
          m++
          var actual = actual.substr(RechercheSRuneActiv + RechercheYellow , body.length);
        }

        //===AFFICHAGE===
        //==Items==
        //On module l'affichage sous forme de strings pour nos items
        var StringStartItem = "⬛";
        var StringItems = "⬛";
        var StringBoots = "⬛";

        for (var i = 0; i < StartItemList.length; i++) {

          if( StartItemList[i] != undefined){
            if(i == StartItemList.length-1){
              StringStartItem = StringStartItem +  StartItemList[i];
            }
            else{
              StringStartItem = StringStartItem +  StartItemList[i] + " - ";
            }
          }
        }

        for (var i = 0; i < ItemList.length; i++) {

          if( ItemList[i] != undefined){
            if(i == ItemList.length-1){
              StringItems = StringItems +  ItemList[i];
            }
            else{
              StringItems = StringItems +  ItemList[i] + " - ";
            }
          }
        }

        for (var i = 0; i < BootsList.length; i++) {

          if( BootsList[i] != undefined){
            if(i == BootsList.length-1){
              StringBoots = StringBoots +  BootsList[i];
            }
            else{
              StringBoots = StringBoots +  BootsList[i] + " - ";
            }
          }
        }

        StringBoots[StringBoots.length] = "";
        StringItems[StringItems.length] = "";
        StringStartItem[StringStartItem.length] = "";

        //==Runes==

        //=========

        message.delete() //on supprime le message de l'utilisateur

        var ChampEmbed = new Discord.MessageEmbed()
          .setColor("#7ED321")
          .setAuthor("Champion statistics")
          .setTitle(champSelect + " - " + lane)
          .setThumbnail("http://ddragon.leagueoflegends.com/cdn/11.5.1/img/champion/"+champSelect+".png")
          .addFields(
            {name : "Start Items 🛡", value : StringStartItem},
            {name : "Game Items 🗡", value : StringItems},
            {name : "Boots 🥾", value : StringBoots},
            {name : "Summoners Spells 📖", value : SpellList[9] + " - " + SpellList[10] + "\n" + SpellList[11] + " - " + SpellList[12]},
            {name : "Champion Spells 🔷", value : SpellList[15] + " -> " +  SpellList[17] + " -> " + SpellList[19]},
            {name : "Runes 🀄", value : RunList[0] +"\n"+RunList[2]+"\n"+RunList[3]+"⬛⬛⬛"+RunList[5]+"\n"+RunList[4]+"⬛⬛⬛"+RunList[6]+"\n"},
            {name : "Sous-runes 🎴", value : SousRuneList[0] +"\n"+ SousRuneList[1] +"\n"+ SousRuneList[2]}
          );

        message.channel.send(ChampEmbed);

      })
    }
    break;
    case 'test' :

      var request = require('request');
     request('https://euw.op.gg/champion/' + args[1] + '/statistics/' + args[2], function (error, response, body) {
       var actual = body;
       var RegExpYellow = new RegExp("#ffc659");
       var RegExpGray = new RegExp("e_grayscale&amp");
       var RegExpEt = new RegExp("&");
       var MiscList = [];

       var j=0;
       var m=0;

       while(actual.search(RegExpYellow) != -1) {

         var RechercheYellow = actual.search(RegExpYellow);
         var cut = actual.substr(RechercheYellow + 12, 50);
         var RechercheEt = cut.search(RegExpEt);
         var cut2 = cut.substr(0, RechercheEt);
         var nikezeubi = actual.substr(RechercheYellow-100 ,500);
         if (nikezeubi.search(RegExpGray) != -1){
           MiscList[m] = cut2;
           m++
         }
         console.log(cut2);
         var actual = actual.substr(RechercheYellow + 12, body.length);
         j++
       }
     })
    break;
  }

} catch (e) {
  message.channel.send("Erreur : " + e + " - " + e.lineNumber)
}

})

client.login(token).then( () => {
  console.log("Ready")
});
