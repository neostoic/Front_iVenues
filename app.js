

(function() {
  var app = angular.module('iVenues', ['ui.bootstrap','uiGmapgoogle-maps']);



  app.config(function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
              key: 'AIzaSyB2XYPP2qITT8Nsvje-sRnvdJja3U3byec',
              v: '3.17',
              libraries: 'weather,geometry,visualization'
              });
            });



  //services
  app.service('searchService', function () {



    this.query="";
    this.location="55.952901,-3.191599";
    this.radius=1000;
    this.funci = [];
    this.api = [
      {name:"ivenues", val: 0},
      {name:"foursquare", val: 0},
      {name:"google", val: 0},
      {name:"yelp", val: 0}
    ];
    this.test = true;
    this.load =false;

    this.resetAPIonSearch =function (){
      this.api = [
        {name:"ivenues", val: 0},
        {name:"foursquare", val: 0},
        {name:"google", val: 0},
        {name:"yelp", val: 0}
      ];


    }

    this.setQuery = function(data) {
      this.query = data;
      this.resetAPIonSearch();
    };
    this.setLocation = function(data) {
      this.location = data;
    };
    this.setRadius = function(data) {
      this.radius = data;
    };
    this.callback = function(data) {

      for(i=0;i<this.funci.length;i++)
      {
        if (this.funci[i].name == data)
        {
          this.funci[i].fun();
          break;
        }
      }
    };
    this.func = function(name,data) {
      this.funci.push({name : name , fun : data});
      console.log(this.funci);
    };

    this.setAPI = function(name,data) {
    for(i=0;i<4;i++)
    {
      if(this.api[i].name == name)
      {
        this.api[i].val = data;

      }


    }
    this.test = !this.sumRank();
    console.log("test" +this.test);
      console.log(this.api);
    };

    this.sumRank = function(){
      var sum = 0;
      for(i=0;i<4;i++)
      {
          sum = sum + this.api[i].val;
      }

      return (sum == 10);
    }

    //tasks
    this.taskNum = 0;
    this.tasks = [];
    this.hide =false;

    this.nextTask = function(){

      if(this.taskNum<4)
      {
      this.api = [
        {name:"ivenues", val: 0},
        {name:"foursquare", val: 0},
        {name:"google", val: 0},
        {name:"yelp", val: 0}
      ];
      this.test = !this.sumRank();



       var taskArray = [
        {
          task:1,
          name:"In the first task you have to search Eating and Dinning venues. Possible search terms are food, pizza, restaurant, etc.",
          search:"Search for food, burger, restaurant, dinner ...",
          sub:"Next task"
         },
        {
          task:2,
          name:"In this task you have to search Coffee and Brunch venues. Possible search terms are cafe, tea, breakfast, etc.",
          search:"Search for coffee, breakfast, cake ...",
          sub:"Next task"
        },
        {
          task:3,
          name:"In this task you have to search Nightlife venues. Possible search terms are pub, bar, beer, cocktails, etc.",
          search:"Search for pub, beer, bar ...",
          sub:"Next task"
          },
        {
          task:4,
          name:"In the final task you have to search Leisure venues. Imaging you are a tourist in town and you may want to search for museums, parks, gallery, etc.",
          search:"Search for museums, parks, gallery ...",
          sub:"Finish"
        }
      ];

      this.tasks= taskArray[this.taskNum];
      this.taskNum++;
      console.log("re"+this.tasks.name);
    }



    }

    this.changeLoad =function(data){
      this.load = data;

    }




    this.nextTask();

    });





  //controllers
  app.controller('MainController', ['$scope','$http','searchService','$location','$anchorScroll',function($scope,$http,searchService,$location,$anchorScroll ){

/*
    $scope.names = ["john", "bill", "charlie", "robert", "alban", "oscar", "marie", "celine", "brad", "drew", "rebecca", "michel", "francis", "jean", "paul", "pierre", "nicolas", "alfred", "gerard", "louis", "albert", "edouard", "benoit", "guillaume", "nicolas", "joseph"];
*/
  var $element = $('#tasksB').bind('webkitAnimationEnd ', function(){
    this.style.webkitAnimationName = '';
  });



  $('#submitB').click(function(){
   $element.css('webkitAnimationName', 'shake');
   // you'll probably want to preventDefault here.
 });

      $scope.data =searchService;

      this.startS = true;
      this.endS = false;

      this.changeStart = function(){
        this.startS = false;


      }
      this.changeEnd = function(){
        if($scope.data.taskNum === 4)
        {this.endS = true;}


      }




      this.setQuery = function(input){
        $scope.data.setQuery(input);
        console.log(input);

        $scope.getData();

      }
      this.setLocation = function(input){
        $scope.data.setLocation(input);

        $scope.getData();

      }
      this.setRadius = function(input){
        $scope.data.setRadius(input);
        $scope.data.callback("update_map");
        $scope.getData();
      }


      $scope.test = $scope.data.test;


      $scope.getData = function() {
        $scope.data.changeLoad(true);

        $http({
                url: "http://venues.herokuapp.com/api/search",
                method: "GET",
                params: {query : $scope.data.query , location : $scope.data.location, radius:$scope.data.radius +500}
              })
              .success(function(data){

                var google =[];
                var foursquare =[];
                var yelp =[];
                var ivenues =[];


                var coordinates = $scope.data.location.split(",");
                var i_google=0;

                for(i=0;i<5;i++)
                 {
                   //ivenues
                   if(typeof data.iVenues[i] != "undefined")
                  {
                   ivenues.push({name :data.iVenues[i].name, rating :data.iVenues[i].rating , distance: distance(data.iVenues[i].location.lat,data.iVenues[i].location.lon,coordinates[0],coordinates[1])});
                 }

                   //google avoid null rating
                   for(k=i_google;k<data.rest.google.length;k++)
                   {
                     if (typeof data.rest.google[i_google].rating != "undefined")
                       {
                         google.push({name :data.rest.google[i_google].name, rating :(data.rest.google[i_google].rating*2).toFixed(1) , distance: distance(data.rest.google[i_google].geometry.location.lat,data.rest.google[i_google].geometry.location.lng,coordinates[0],coordinates[1])});

                          i_google++;
                         break;
                       }
                     else {
                       {
                         i_google++;

                       }
                     }
                   }

                   //foursquare
                   if(typeof data.rest.foursquare[i] != "undefined")
                   {
                   foursquare.push({name :data.rest.foursquare[i].venue.name, rating :data.rest.foursquare[i].venue.rating , distance: distance(data.rest.foursquare[i].venue.location.lat,data.rest.foursquare[i].venue.location.lng,coordinates[0],coordinates[1])});
                   }

                   //yelp
                   if(typeof data.rest.yelp != "undefined")
                   {
                   yelp.push({name :data.rest.yelp[i].name, rating :(data.rest.yelp[i].rating*2).toFixed(1) , distance: distance(data.rest.yelp[i].location.coordinate.latitude,data.rest.yelp[i].location.coordinate.longitude,coordinates[0],coordinates[1])});
                    }

                 }



                 $scope.items = [];
                 $scope.items.push({name:"ivenues",venues:ivenues},{name:"foursquare",venues:foursquare},{name:"google",venues:google},{name:"yelp",venues:yelp});
                 //suffling
                 shuffle($scope.items);

                 $scope.data.changeLoad(false);


                console.log(data);
              });

            };


            function shuffle(o){
              for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
              return o;
            }



            function distance(lat1,lon1,lat2,lon2){

              var R = 6371; // km
              var dLat = (lat2-lat1)* (Math.PI / 180);
              var dLon = (lon2-lon1)* (Math.PI / 180);
              var lat1 = lat1* (Math.PI / 180);
              var lat2 = lat2* (Math.PI / 180);

              var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
              var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
              var d = R * c;

            return d.toFixed(1); //return the distance in km
            }



      $scope.data.func("update_results" ,$scope.getData);
      $scope.getData();

      //autoscroll
      this.gotoTask = function() {
     // set the location.hash to the id of
     // the element you wish to scroll to.
     $location.hash('tasks_id');
     console.log("im in");
     // call $anchorScroll()
     $anchorScroll();

     $('#tasksB').addClass('animated tada');



   };





  }]);




  app.controller("mapController",['$scope','searchService', function($scope, searchService) {

  // Define variables for our Map object

  var    areaZoom     = 13;





      $scope.data = searchService;

      $scope.updateMap = function() {
        //var styles = [{stylers:[{hue:'#890000'},{visibility:'simplified'},{gamma:0.5},{weight:0.5}]},{elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'water',stylers:[{color:'#890000'}]}];

        var coordinates = $scope.data.location.split(",");

      $scope.circles = [
                {
                    id: 1,
                    center: {
                        latitude: coordinates[0],
                        longitude:coordinates[1]
                    },
                    radius: $scope.data.radius,
                    stroke: {
                        color: '#5bc0de',
                        weight: 3,
                        opacity: 1
                    },
                    fill: {
                        color: '#eef8fb',
                        opacity: 0.5
                    },
                    geodesic: true, // optional: defaults to false
                    draggable: true, // optional: defaults to false
                    clickable: true, // optional: defaults to true

                    visible: true, // optional: defaults to true
                    events:{
                          dragend: function(){

                            test = $scope.circles[0].center.latitude + "," + $scope.circles[0].center.longitude;
                            $scope.data.setLocation($scope.circles[0].center.latitude + "," + $scope.circles[0].center.longitude);
                            $scope.data.callback("update_results");

                          console.log("circle dblclick" + test);
                        }
                      }
                }
            ];




};

$scope.data.func("update_map" ,$scope.updateMap);

this.locate = function (){


if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(function(position){
     $scope.$apply(function(){
       var lat = position.coords.latitude;
       var long = position.coords.longitude;

       $scope.data.setLocation(lat+","+long);
       console.log(lat+ ","+long);
       $scope.map = { center: { latitude: lat, longitude: long} };

       $scope.updateMap();


     });
   });
 }

}



var coordinates = $scope.data.location.split(",");

$scope.map = { center: { latitude: coordinates[0], longitude: coordinates[1]}, zoom: areaZoom  };
var stylesArray =[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}];
$scope.options = {  styles: stylesArray };
$scope.updateMap();


  }]);




//directives
app.directive("lists", ['searchService',function(searchService){
  return {
    restrict: "E",
    scope: {
      items: "="
    },
    controller: function() {
      this.change = searchService.api ;

      this.trol = [
        {name:"ivenues", val: 0},
        {name:"foursquare", val: 0},
        {name:"google", val: 0},
        {name:"yelp", val: 0}
      ];


      this.setApi = function(api,input){
        searchService.setAPI(api,input);
        searchService.sumRank();
        console.log(api +"rere   " + searchService.sumRank());

        this.change = searchService.api ;

      }




    },
    controllerAs:"test",
    templateUrl: "html/list.html"
  };
}]);

/*
app.directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select: function() {
                    $timeout(function() {
                      iElement.trigger('input');
                    }, 0);
                }
            });
    };
});

*/





})();
