

(function() {
  var app = angular.module('iVenues', ['ui.bootstrap','uiGmapgoogle-maps','google.places']);



  app.config(function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
              key: 'AIzaSyB2XYPP2qITT8Nsvje-sRnvdJja3U3byec',
              v: '3.17',
              libraries: 'weather,geometry,visualization'
              });
            });



  //services
  app.service('searchService',['$http', function ($http) {



    this.query="food";
    this.location="40.711434, -74.007836";
    this.radius=1200;
    this.funci = [];
    this.markersShared = [];
    this.api = [
      {name:"ivenues", val: 0},
      {name:"foursquare", val: 0},
      {name:"google", val: 0},
      {name:"yelp", val: 0}
    ];
    this.test = true;
    this.load =false;
    this.showMap = false;

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
      this.showMap = true;
      console.log("from set"+this.location);

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
          search:"I want recommendations for ...",
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
      console.log("re"+this.tasks.name);
    }




      this.taskNum++;


    }

    this.changeLoad =function(data){
      this.load = data;

    }

    this.nextTask();

  }]);





  //controllers
  app.controller('MainController', ['$scope','$http','searchService','$location','$anchorScroll',function($scope,$http,searchService,$location,$anchorScroll ){


  var $element = $('#tasksB').bind('webkitAnimationEnd ', function(){
    this.style.webkitAnimationName = '';
  });



  $('#submitB').click(function(){
   $element.css('webkitAnimationName', 'shake');
 });

      $scope.data =searchService;

      this.startS = true;
      this.endS = false;

      this.changeStart = function(){
        this.startS = false;


      }
      this.changeEnd = function(){
        if(this.endS)
        {
          this.endS = false;
        }
        else
        {
          this.endS = true;
          $( '#help_button' ).removeClass( "pulsate" );

        }


      }



      this.setQuery = function(input){
        $scope.data.setQuery(input);
        console.log(input);

        this.listSh=true;


        $scope.getData();

      }
      this.setLocation = function(input){
        $scope.data.setLocation(input);

        $scope.getData();

      }
      this.setRadius = function(input){
        $scope.data.setRadius(input);
        $scope.data.callback("update_map");
        $scope.data.callback("update_map2");
        $scope.getData();
      }


      $scope.test = $scope.data.test;


      $scope.getData = function() {
        $scope.data.changeLoad(true);

        $http({
                url: "http://venues.herokuapp.com/api/search",
                method: "GET",
                params: {query : $scope.data.query , location : $scope.data.location, radius:$scope.data.radius +400}
              })
              .success(function(data){

                var google =[];
                var foursquare =[];
                var yelp =[];
                var ivenues =[];
                var markers = [];
                var num = 0;

                var coordinates = $scope.data.location.split(",");
                var i_google=0;

                for(i=0;i<data.iVenues.length;i++)
                 {
                   //ivenues
                   if(typeof data.iVenues[i] != "undefined")
                  {
                   ivenues.push({name :data.iVenues[i].name, rating :data.iVenues[i].rating , distance: distance(data.iVenues[i].location.lat,data.iVenues[i].location.lon,coordinates[0],coordinates[1])});

                   num = i+1;
                   markers.push(
                             {
                                 idKey: i+1,
                                 coords: {
                                     latitude: data.iVenues[i].location.lat,
                                     longitude:data.iVenues[i].location.lon
                                 },
                                 options: {
                                           icon: "images/number_"+num+".png"
                                         }

                             });

                 }


                 }



                 $scope.items = [];
                 $scope.items.push({name:"ivenues",venues:data.iVenues});
                 //suffling
                 shuffle($scope.items);

                 $scope.data.changeLoad(false);
                 $scope.data.markersShared=markers;


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

      this.listSh=false;



      //autoscroll
      this.gotoTask = function() {

        $http.post("insert.php",{task: $scope.data.taskNum ,query: $scope.data.query ,radius: $scope.data.radius,location: $scope.data.location,ivenues: $scope.data.api[0].val,foursquare: $scope.data.api[1].val,google: $scope.data.api[2].val,yelp: $scope.data.api[3].val})
              .success(function(data, status, headers, config){
                      console.log("inserted Successfully");
                  });



        this.listSh=false;

     $location.hash('tasks_id');
     console.log("im in");
     // call $anchorScroll()
     $anchorScroll();

     $('#tasksB').addClass('animated tada');



   };


   this.setLocationStart = function(input){

     $http({
             url: "http://api.geonames.org/searchJSON",
             method: "GET",
             params: {q : input , maxRows : 1, fuzzy:0.6 , username:"geototti21"}
           })
           .success(function(data){
             console.log(data);
             if( data.totalResultsCount ==0 )
             {
               $scope.data.setLocation("40.711434, -74.007836");
               $scope.getData();

             }
             else{
               $scope.data.setLocation(data.geonames[0].lat+","+data.geonames[0].lng);
               $scope.getData();

             }

           })
           .error(function(data){

             $scope.data.setLocation("40.711434, -74.007836");
             $scope.getData();

           });





   }



  }]);




  app.controller("mapController",['$scope','searchService','$http', function($scope, searchService ,$http) {

  // Define variables for our Map object

  var    areaZoom     = 15;


      $scope.data = searchService;

      $scope.updateMap = function() {

        var coordinates = $scope.data.location.split(",");

         console.log("radius:" +  $scope.data.radius);



      $scope.circles = [
                {
                    id: 1,
                    center: {
                        latitude: coordinates[0],
                        longitude:coordinates[1]
                    },
                    radius: $scope.data.radius,
                    stroke: {
                        color: '#0092ff',
                        weight: 2,
                        opacity: 1
                    },
                    fill: {
                        color: '#0092ff',
                        opacity: 0.1
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

            var test=15;
      $scope.markers = $scope.data.markersShared;




};




$scope.onClick2 = function() {
        window.alert("clicked");
        console.log("klikaresssssssss");
    };


this.locate = function (){
console.log("mpikke" + navigator.geolocation);

if (navigator.geolocation) {
  console.log("mpike2");
   navigator.geolocation.getCurrentPosition(function(position){
     console.log("mpike3");
     $scope.$apply(function(){
       var lat = position.coords.latitude;
       var long = position.coords.longitude;

       $scope.data.setLocation(lat+","+long);
       console.log(lat+ ","+long);
       $scope.map = { center: { latitude: lat, longitude: long} };

       $scope.updateMap();
       $scope.data.callback("update_results");


     });
   });
 }

};

this.setMapLoc = function(input){

  $http({
          url: "http://api.geonames.org/searchJSON",
          method: "GET",
          params: {q : input , maxRows : 1, fuzzy:0.6 , username:"geototti21"}
        })
        .success(function(data){

          $scope.data.setLocation(data.geonames[0].lat+","+data.geonames[0].lng);
          $scope.map = {zoom:15,  center: { latitude: data.geonames[0].lat, longitude: data.geonames[0].lng} };

          $scope.updateMap();

          $scope.data.callback("update_results");

          console.log(data);
        });





};



var coordinates = $scope.data.location.split(",");

$scope.map = { center: { latitude: coordinates[0], longitude: coordinates[1]}, zoom: areaZoom  };
//var stylesArray =[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}];
var stylesArray =[{"featureType":"landscape","stylers":[{"hue":"#F1FF00"},{"saturation":-27.4},{"lightness":9.4},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#0099FF"},{"saturation":-20},{"lightness":36.4},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#00FF4F"},{"saturation":0},{"lightness":0},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FFB300"},{"saturation":-38},{"lightness":11.2},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#00B6FF"},{"saturation":4.2},{"lightness":-63.4},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#9FFF00"},{"saturation":0},{"lightness":0},{"gamma":1}]}];
$scope.options = {  styles: stylesArray , maxZoom:17 ,minZoom:12};
$scope.updateMap();
$scope.data.func("update_map" ,$scope.updateMap);


  }]);


  app.controller("mapControllerS",['$scope','searchService','$http', function($scope, searchService ,$http) {

  // Define variables for our Map object

  var    areaZoom     = 13;


      $scope.data = searchService;

      $scope.updateMap = function() {
        //var styles = [{stylers:[{hue:'#890000'},{visibility:'simplified'},{gamma:0.5},{weight:0.5}]},{elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'water',stylers:[{color:'#890000'}]}];

        var coordinates = $scope.data.location.split(",");

         console.log("radius:" +  $scope.data.radius);



      $scope.circles = [
                {
                    id: 1,
                    center: {
                        latitude: coordinates[0],
                        longitude:coordinates[1]
                    },
                    radius: $scope.data.radius,
                    stroke: {
                        color: '#fb445a',
                        weight: 3,
                        opacity: 1
                    },
                    fill: {
                        color: '#eef8fb',
                        opacity: 0.1
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


this.locate = function (){
console.log("mpikke");

if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(function(position){
     $scope.$apply(function(){
       var lat = position.coords.latitude;
       var long = position.coords.longitude;

       $scope.data.setLocation(lat+","+long);
       console.log(lat+ ","+long);
       $scope.map = { center: { latitude: lat, longitude: long} };

       $scope.updateMap();
       $scope.data.callback("update_results");


     });
   });
 }

}

this.setMapLoc = function(input){

  $http({
          url: "http://api.geonames.org/searchJSON",
          method: "GET",
          params: {q : input , maxRows : 1, fuzzy:0.6 , username:"geototti21"}
        })
        .success(function(data){

          $scope.data.setLocation(data.geonames[0].lat+","+data.geonames[0].lng);
          $scope.map = {zoom:13,  center: { latitude: data.geonames[0].lat, longitude: data.geonames[0].lng} };

          $scope.updateMap();

          $scope.data.callback("update_results");

          console.log(data);
        });





}



var coordinates = $scope.data.location.split(",");

$scope.map = { center: { latitude: coordinates[0], longitude: coordinates[1]}, zoom: areaZoom  };
var stylesArray =[{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}];
$scope.options = {  styles: stylesArray , maxZoom:17 ,minZoom:12};
$scope.updateMap();
$scope.data.func("update_map2" ,$scope.updateMap);


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


})();
