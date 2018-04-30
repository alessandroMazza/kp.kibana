import visTemplate from 'plugins/elasticsearchGroupIndexService/elasticsearchCall.html';
//import 'plugins/elasticsearchGroupIndexService/elasticsearchCall.css';
//import optionsTemplate from 'plugins/elasticsearchGroupIndexService/elasticsearchCallOprtions.html';
import VisSchemasProvider from 'ui/vis/editors/default/schemas';
import {VisFactoryProvider} from 'ui/vis/vis_factory';
import {FilterBarQueryFilterProvider} from 'ui/filter_bar/query_filter';
//import FilterBarClickHandlerProvider from 'ui/filter_bar/filter_bar_click_handler';

var module = require('ui/modules').get('elasticsearchCall', []);

    module.controller('elasticsearchCallCtrl',  function( $scope, $http, es, Private) {
     

     var getGroupfromElasticserch = function (indexName, indexType){
     
        /* es.search({
         index: indexName,
         type:indexType,
         body: {
         query: {
         exists : { field : "group_Id" }
             }
           }
         }, 
      function (error, response) {
      debugger
      });*/


  var query =  {
         query: {
         exists : { field : "group_Id" }
              }
             }

  $http({
            method: 'POST',
            url: '../api/console/proxy?path=/_search&method=POST',
            data: query                          
          })
          .then(function mySuccess(response) {
            var response = response.data.hits;
            $scope.resp = response;
            /*
            if(response.hits.total > 0){
              if(!verifyArrays(response)){
                $scope.reportsShared = [];
                for(var i=0; i< response.hits.hits.length; i++){
                  $scope.reportsShared.push(response.hits.hits[i]._source);
                }
                $scope.$root.$broadcast('alertReports');
              }
            }*/
          },
          function myError(response) {
          });

    }
debugger
//const filterBarClickHandler = Private(FilterBarClickHandlerProvider);  
//const queryFilter = Private(require('ui/filter_bar/query_filter'));  
$scope.filterBar = Private(FilterBarQueryFilterProvider);
debugger

     getGroupfromElasticserch("groups", "groupings");

  });





