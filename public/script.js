var app = new Vue({
  el: "#app",
  data: {
    items: [],
    text: "",
    priority: 'low',
    show: "all",
    drag: {},
    url: "http://localhost:3000/api/items/"
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
        return !item.completed;
      });
    },
    filteredItems: function() {
      if (this.show === "active")
        return this.items.filter(function(item) {
          return !item.completed;
        });
      if (this.show === "completed")
        return this.items.filter(function(item) {
          return item.completed;
        });
      if (this.show === "sort") {
        let low = [];
        let med = [];
        let high = [];
        this.items.forEach(item => {
          if (item.priority === 'low') {
            low.push(item);
          }
          else if (item.priority === 'med') {
            med.push(item);
          }
          else if (item.priority === 'high') {
            high.push(item);
          }
        });
        return low.concat(med.concat(high));
      }
      return this.items;
    }
  },
  created: function() {
    this.getItems();
  },
  methods: {
    addItem: function() {
      axios
        .post(this.url, {
          text: this.text,
          completed: false,
          priority: this.priority
        })
        .then(response => {
          this.text = "";
          this.priority = 'low';
          this.getItems();
          return true;
        })
        .catch(err => {});
    },
    completeItem: function(item) {
      axios
        .put(this.url + item.id, {
          text: item.text,
          completed: !item.completed,
          priority: item.priority,
          orderChange: false
        })
        .then(response => {
          return true;
        })
        .catch(err => {});
    },
    deleteItem: function(item) {
      axios
        .delete(this.url + item.id)
        .then(response => {
          this.getItems();
          return true;
        })
        .catch(err => {});
    },
    showAll: function() {
      this.show = "all";
    },
    showActive: function() {
      this.show = "active";
    },
    showCompleted: function() {
      this.show = "completed";
    },
    sortByPriority: function() {
      this.show = "sort";
    },
    deleteCompleted: function() {
      this.items.forEach(item => {
        if (item.completed) this.deleteItem(item);
      });
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios
        .put(this.url + this.drag.id, {
          text: this.drag.text,
          completed: this.drag.completed,
          priority: this.drag.priority,
          orderChange: true,
          orderTarget: item.id
        })
        .then(response => {
          this.getItems();
          return true;
        })
        .catch(err => {});
    },
    getItems: function() {
      axios
        .get(this.url)
        .then(response => {
          this.items = response.data;
          return true;
        })
        .catch(err => {});
    },
    increasePriority: function(item) {
      if (item.priority === 'low') {
        item.priority = 'med';
      }
      else if (item.priority === 'med') {
        item.priority = 'high';
      }
      axios
        .put(this.url + item.id, {
          text: item.text,
          completed: item.completed,
          priority: item.priority,
          orderChange: false
        })
        .then(response => {
          this.getItems();
          return true;
        })
        .catch(err => {});
    },
    decreasePriority: function(item) {
      if (item.priority === 'high') {
        item.priority = 'med';
      }
      else if (item.priority === 'med') {
        item.priority = 'low';
      }
      axios
        .put(this.url + item.id, {
          text: item.text,
          completed: item.completed,
          priority: item.priority,
          orderChange: false
        })
        .then(response => {
          this.getItems();
          return true;
        })
        .catch(err => {});
    }
  }
});
$( ".type" ).mouseenter(function() {
    $( this ).animate({boxShadow: '0 0 30px #333'}, 200 );
});
$( ".type" ).mouseleave(function() {
    $( this ).animate({boxShadow: '0 0 0 #000000'}, 200 );
});
function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function jsLcfirst(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
function BraceToSpace(string) {
    return string.replace(/-/g, " ");
}
function SpaceToBrace(string) {
    return string.replace(/ /g, "-");
}

$(document).ready(function() {

   var submitButton = $("#pokemonSubmit");
   var pokemonResults = document.getElementById("pokemonResults");
   console.log(submitButton);
   $("#pokemonSubmit").click(function(e) {
        $('.pokeball').show();
        $('.pokeball__button').show();
        e.preventDefault();
        /*var form = $("#pokemonForm").val(); */
        var form = "pokemon";
        var value = jsLcfirst($("#pokemonInput").val());
        var myurl = "https://pokeapi.co/api/v2/" + form + "/" + value + "/";
        /*
        */
        $.ajax({
          /* */
            url : myurl,
            dataType : "json",
           beforeSend: function(){
                $('.pokeball').show();
                $('.pokeball__button').show();
            },

            success : function(json) {
            var results = "";
            console.log(json);
            if (form === "pokemon") {
              var name = json.name;
              name = jsUcfirst(name);
              results += "<h2 class='pokeNum'>#" + json.id + "</h2>";
              results += "<h2 class='poke-name' id='its-name'>" + name
                + ":</h2><br>" + "<h2 class='type " + json.types[0].type.name + "'>" + jsUcfirst(json.types[0].type.name) + " </h2>";
              if (json.types.length > 1) {
                for (var i = 0; i < json.types.length - 1; ++i) {
                  results += "<h2 class='type " + json.types[i + 1].type.name + "'>" + jsUcfirst(json.types[i + 1].type.name) + " </h2>";
                }
              }

              var moves = "<p class = 'moves'><br>";
              for (var i = 0; i < 4; ++i) {
                moves +=i + 1 + ":";
                moves += BraceToSpace(jsUcfirst(json.moves[i].move.name));
                moves += "<br>";
              }
              moves += "</p>";
              results += moves;
              results += "<p class='right-side'>";
              var picture = json.sprites.front_default;
              results += '<img src=' + picture + ' class="pokeSprities"/>';
              results += "</p>";
            }
            $("#pokemonResults").html(results);
          },
          complete:function(){
              $('.pokeball').hide();
              $('.pokeball__button').hide();
          }
        }).fail(function (jqXHR, textStatus, errorThrown) {
          alert("No Pok\xE9mon found");
        });

   });
});
$(document).ready(function() {
   var submitButton = $("#itemSubmit");
   console.log(submitButton);
   $("#itemSubmit").click(function(e) {
        $('.pokeball').show();
        $('.pokeball__button').show();
        e.preventDefault();
        /*var form = $("#pokemonForm").val(); */
        var form = "item";
        var value = jsLcfirst(SpaceToBrace($("#itemInput").val()));
        var myurl = "https://pokeapi.co/api/v2/" + form + "/" + value + "/";
        /*
        */
        $.ajax({
          /* */
            url : myurl,
            dataType : "json",
           beforeSend: function(){
                $('.pokeball').show();
                $('.pokeball__button').show();
            },

            success : function(json) {
            var results = "";
            console.log(json);
            if (form === "item") {
              var name = json.name;
              name = jsUcfirst(name);
              results += "<h2 style='text-align:center'>" + BraceToSpace(name) + ":</h2>";
              results += "<p>";
              var picture = json.sprites.default;
              results += '<img src=' + picture + ' class="sprities"/>';
              results += "</p>"
              var effect = json.effect_entries[0].short_effect;
              results += "<p class='effect'>" + effect;
              results += "</p>";

            }
            $("#itemResults").html(results);
          },
          complete:function(){
              $('.pokeball').hide();
              $('.pokeball__button').hide();
          }
        }).fail(function (jqXHR, textStatus, errorThrown) {
          alert("No Item found\nTry using spaces and typing in all lower-case\n(ie. \"poke ball\")");
        });

   });
});
