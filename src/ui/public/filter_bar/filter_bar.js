import _ from 'lodash';
import template from 'ui/filter_bar/filter_bar.html';
import 'ui/directives/json_input';
import '../filter_editor';
import './filter_pill/filter_pill';
import { filterAppliedAndUnwrap } from 'ui/filter_bar/lib/filter_applied_and_unwrap';
import { FilterBarLibMapAndFlattenFiltersProvider } from 'ui/filter_bar/lib/map_and_flatten_filters';
import { FilterBarLibMapFlattenAndWrapFiltersProvider } from 'ui/filter_bar/lib/map_flatten_and_wrap_filters';
import { FilterBarLibExtractTimeFilterProvider } from 'ui/filter_bar/lib/extract_time_filter';
import { FilterBarLibFilterOutTimeBasedFilterProvider } from 'ui/filter_bar/lib/filter_out_time_based_filter';
import { FilterBarLibChangeTimeFilterProvider } from 'ui/filter_bar/lib/change_time_filter';
import { FilterBarQueryFilterProvider } from 'ui/filter_bar/query_filter';
import { compareFilters } from './lib/compare_filters';
import { uiModules } from 'ui/modules';


export { disableFilter, enableFilter, toggleFilterDisabled } from './lib/disable_filter';
export { module }

const module = uiModules.get('kibana');

//KP fixedFilter service 
const app = uiModules.get('app/dashboard', [
  'elasticsearch',
  'ngRoute',
  'react',
  'kibana/courier',
  'kibana/config',
  'kibana/notify',
  'kibana/typeahead',
]);



app.service('fixedFilters',function(){


    function isJson(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }

    function objIsJson(obj){
      try {
        JSON.stringify(obj);
    } catch (e) {
        return false;
    }
    return true;
    }

    function fixedFilter(dashboardName, groupName, query, filter){
      if( typeof(dashboardName) === "string" || typeof(groupName) === "string" ){
        
        this.dashboard = dashboardName;
        this.groupName = groupName;
        this.globalFilter = false;
      }
      else{
        this.globalFilter = true;
      } 
      if(typeof(query === "string" && isJson(query))){
         this.query = query;
      }
      else if(objIsJson(query)){ 
        this.query = JSON.stringify(query);
      }
      else{
        console.log("passed a non jsonlike object")
      }

      this.filter = filter;

  }

  function fixedFilterDefault(dashboardName, groupName, query){
    if( typeof(dashboardName) === "string" || typeof(groupName) === "string" ){
      this.dashboard = dashboardName;
      this.groupName = groupName;
      this.globalFilter = false;
    }
    else{
      this.globalFilter = true;
    } 
    if(typeof(query === "string" && isJson(query))){
       this.query = query;
    }
    else if(objIsJson(query)){ 
      this.query = JSON.stringify(query);
    }
    else{
      console.log("passed a non jsonlike object")
    }
  
}
  
//KP_fixedFilters_Configuration
  var fixedFiltersList = [];
  var numberOfFixedFilters = fixedFiltersList.length;
  var MEPKEYWORDSYNC = '{"match":{"MEP":{"query":"SYNC","type":"phrase"}}}';
  var MEPKEYWORDASYNC = '{"match":{"MEP":{"query":"ASYNC","type":"phrase"}}}'
  var MEPKEYWORDSYNCFILTER = new fixedFilterDefault("SERVICES_Services Overview_0","SERVICES",MEPKEYWORDSYNC, undefined);
  var MEPKEYWORDASYNCFILTER = new fixedFilterDefault(" INTEGRATIONS_Integrations Overview_0","INTEGRATIONS",MEPKEYWORDASYNC, undefined);
  var defaultFixedFilters = [ MEPKEYWORDASYNCFILTER, MEPKEYWORDSYNCFILTER]; 


  //TO SWITCH INSIDE A CONFIGURATION 
  this.getDefaultFixedFilters = function(){
    return(defaultFixedFilters)
}

  
  this.getFixedFiltersList = function(){
    return( fixedFiltersList);
  }

  this.GetSpecificGroupOrDashFilters = function(groupNameOrDashName){
         if(typeof(groupNameOrDashName) === "string"){
           var toReturnList = [];
           fixedFiltersList.map(function(filter){
               if(filter.dashboard === groupNameOrDashName || filter.groupName === groupNameOrDashName){
                   toReturnList.push(filter)
               }
           })
           if(toReturnList.length > 0){
             return(toReturnList)
           }
           else{
             console.log("Filter association not found")
           }
         }
  }

  this.GetSpecificFixedFilters = function(groupNameOrDashName, query){
       
    groupNameandDashNameListForm = groupNameandDashNameListForm.map(function(name){
      if(name === "none" || typeof(name) === "undefined"){
       return(undefined)
    }
    else{
      return(name)
    }
  })

        if(Array.isArray(groupNameOrDashName)){
          fixedFiltersList.map(function(filter){
             if((filter.dashboard === groupNameOrDashName[0] || filter.groupName === groupNameOrDashName[1]) && filter.query === query){
                 return(filter)
            }
        })
        }
  }

 this.eliminateFixedFilters = function(){
     fixedFiltersList = [];
 }

this.addfixedFilter = function (groupNameandDashNameListForm, filter){
    
    function isFilterAlreadPresent(filterToCheck){
      var listToBeChecked = fixedFiltersList;
      var isPresent = false;
      for(var i = 0; i < listToBeChecked.length; i++){
         if(JSON.stringify(listToBeChecked[i].query) === JSON.stringify(filterToCheck.query)){
           isPresent = true;
         }
      }
      return(isPresent);
    }

       groupNameandDashNameListForm = groupNameandDashNameListForm.map(function(name){
        if(name === "none" || typeof(name) === "undefined"){
         return(undefined)
      }
      else{
        return(name)
      }
    })

     if(Array.isArray(groupNameandDashNameListForm)){
        if(isFilterAlreadPresent(filter)){
           return(false)
        }
       var filterToPush = new fixedFilter(groupNameandDashNameListForm[0], groupNameandDashNameListForm[1], filter.query, filter);
       fixedFiltersList.push(filterToPush);
     }
 }


this.removeOneFixedFilter = function(){
  groupNameOrDashNameListForm = groupNameOrDashNameListForm.map(function(name){
    if(name === "none"  || typeof(name) === "undefined"){
     return(undefined)
  }
})
 if(Array.isArray(groupNameOrDashNameListForm)){
    for( var i = 0; i < fixedFiltersList.length; i++){
      if ((fixedFiltersList[i].dashboard === groupNameOrDashName[0] || fixedFiltersList.groupName === groupNameOrDashName[1]) && filter.query === query){
        array.splice(i, 1);
      }
    }
 }
}


})


// END KP fixedFilter service



module.directive('filterBar', function (Private, Promise, getAppState, fixedFilters, dashboardNavigationState, globalState) {
  const mapAndFlattenFilters = Private(FilterBarLibMapAndFlattenFiltersProvider);
  const mapFlattenAndWrapFilters = Private(FilterBarLibMapFlattenAndWrapFiltersProvider);
  const extractTimeFilter = Private(FilterBarLibExtractTimeFilterProvider);
  const filterOutTimeBasedFilter = Private(FilterBarLibFilterOutTimeBasedFilterProvider);
  const changeTimeFilter = Private(FilterBarLibChangeTimeFilterProvider);
  const queryFilter = Private(FilterBarQueryFilterProvider);

  return {
    template,
    restrict: 'E',
    scope: {
      indexPatterns: '='
    },
    link: function ($scope) {
      // bind query filter actions to the scope
      [
        'addFilters',
        'toggleFilter',
        'toggleAll',
        'pinFilter',
        'pinAll',
        'invertFilter',
        'invertAll',
        'removeFilter',
        'removeAll',
      ].forEach(function (method) {
        $scope[method] = queryFilter[method];
      });
   
 
      $scope.state = getAppState();

      //KP navigation group
      var locTag = getAppState().title;   
      if(typeof (locTag) != "undefined" ){ 
        var navigatedGroup = String(dashboardNavigationState.getNavState().selectedGroup[0][0]).split("_")[0];     
  }
      
      //END KP navgroup

       //KP repristiner

       function repristinateFixedFiltersAfterDeletingOutOfDashboard(appState, fixedFilters, locationForm){

         function ChangeAElementToImprobableString(item){
             if(typeof(item) === "undefined"){           
               var randomNumericalString = String(Math.floor(Math.random() * 100000000)) + "notEqualString//!!//";
                return(randomNumericalString)
               }
             else{
               return(item)
             }            
        }
     
         function checkIfFixedFilterIsPresentInAppState(fixFilter, filterState){
            for(var i = 0; i < filterState.length; i++){
               if(JSON.stringify(filterstate[i]) === JSON.stringify(fixFilter.filter)){
                return(true)
               }
             }
             return(false)
           }
     
          var savedFiltersList = fixedFilters.getFixedFiltersList();
          var localFilterState = appState.filters;
          var globalFilterState =  globalState.filters;

          for(var filterIndex = 0; filterIndex < savedFiltersList.length; filterIndex++){
              if(!checkIfFixedFilterIsPresentInAppState(localFilterState, savedFiltersList[filterIndex])){
                  if(typeof(appState.filters) != "undefined" ){
                    if(savedFiltersList[filterIndex].dashboard ===  ChangeAElementToImprobableString(locationForm[0]) || savedFiltersList[filterIndex].groupName === ChangeAElementToImprobableString(locationForm[1])){
                     setTimeout(appState.filters.push(savedFiltersList[filterIndex].filter), 10);   
                    }           
              }
            }
          } 
        

          for(var filterIndex = 0; filterIndex < savedFiltersList.length; filterIndex++){
           if(!checkIfFixedFilterIsPresentInAppState(globalFilterState, savedFiltersList[filterIndex])){
             if(typeof(globalState.filters) != "undefined" ){
              if(savedFiltersList[filterIndex] ===  ChangeAElementToImprobableString(locationForm[0]).dashboard || savedFiltersList[filterIndex].groupName === ChangeAElementToImprobableString(locationForm[1])){
                 setTimeout(globalState.filters.push(savedFiltersList[filterIndex].filter), 10);    
              }
             }  
           }
       }
         
       }
       //END KP repristiner


      $scope.showAddFilterButton = () => {
        return _.compact($scope.indexPatterns).length > 0;
      };

      $scope.applyFilters = function (filters) {
        addAndInvertFilters(filterAppliedAndUnwrap(filters));
        $scope.newFilters = [];

        // change time filter
        if ($scope.changeTimeFilter && $scope.changeTimeFilter.meta && $scope.changeTimeFilter.meta.apply) {
          changeTimeFilter($scope.changeTimeFilter);
        }
      };

      $scope.addFilter = () => {
        $scope.editingFilter = {
          meta: { isNew: true }
        };
      };

      $scope.deleteFilter = (filter) => {
        $scope.removeFilter(filter);
        if (filter === $scope.editingFilter) $scope.cancelEdit();
      };

      $scope.editFilter = (filter) => {
        $scope.editingFilter = filter;
      };

      $scope.cancelEdit = () => {
        delete $scope.editingFilter;
      };

      $scope.saveEdit = (filter, newFilter, isPinned) => {
        if (!filter.meta.isNew) $scope.removeFilter(filter);
        delete $scope.editingFilter;
        $scope.addFilters([newFilter], isPinned);
      };

      $scope.clearFilterBar = function () {
        $scope.newFilters = [];
        $scope.changeTimeFilter = null;
      };

      // update the scope filter list on filter changes
      $scope.$listen(queryFilter, 'update', function () {
        updateFilters();
      });

      // when appState changes, update scope's state
      $scope.$watch(getAppState, function (appState) {
        $scope.state = appState;
      });
      $scope.$watch('state.$newFilters', function (filters) {
        if (!filters) return;

        // If filters is not undefined and the length is greater than
        // one we need to set the newFilters attribute and allow the
        // users to decide what they want to apply.
        if (filters.length > 1) {
          return mapFlattenAndWrapFilters(filters)
            .then(function (results) {
              extractTimeFilter(results).then(function (filter) {
                $scope.changeTimeFilter = filter;
              });
              return results;
            })
            .then(filterOutTimeBasedFilter)
            .then(function (results) {
              $scope.newFilters = results;
            });
        }

        // Just add single filters to the state.
        if (filters.length === 1) {
          Promise.resolve(filters).then(function (filters) {
            extractTimeFilter(filters)
              .then(function (timeFilter) {
                if (timeFilter) changeTimeFilter(timeFilter);
              });
            return filters;
          })
            .then(filterOutTimeBasedFilter)
            .then(addAndInvertFilters);
        }
      });

      function addAndInvertFilters(filters) {
        const existingFilters = queryFilter.getFilters();
        const inversionFilters = _.filter(existingFilters, (existingFilter) => {
          const newMatchingFilter = _.find(filters, _.partial(compareFilters));
          return newMatchingFilter
            && newMatchingFilter.meta
            && existingFilter.meta
            && existingFilter.meta.negate !== newMatchingFilter.meta.negate;
        });
        const newFilters = _.reject(filters, (filter) => {
          return _.find(inversionFilters, _.partial(compareFilters, filter));
        });

        _.forEach(inversionFilters, $scope.invertFilter);
        $scope.addFilters(newFilters);
      }

// KP modification function that sets the flag for immutable filters 

      function CheckIfFiltersExistsInDefaultFixedFilters(filtersFromRepository, filters, dashboardOrGroup, filterservice, dashboardGroupAndName){

         if(filtersFromRepository === true){
         var DefaultFixedFilter = fixedFilters.getDefaultFixedFilters();
         }
         else {
        var DefaultFixedFilter = filtersFromRepository;
         }

         function extractQueries(Defaultfilters){
            var defQueries = [];
             Defaultfilters.map(function(filter){
                if(filter.dashboardName === dashboardOrGroup || filter.groupName === dashboardOrGroup ){
                   defQueries.push(filter.query);
                }
              })
              return(defQueries)
         }

         var queries =  extractQueries(DefaultFixedFilter);
         

          function isTrue(el){ 
            return el === true
          }

          function checkJsons(jsonList, json){
             return(jsonList.map( function(jsON){
               if( _.isEqual(jsON, json) ){
                 return(true);
               }
               else{
                return(false)
              }
             }
            ).includes(true))
          }
        
          if(queries.map(function(que){if(typeof(que) === "string"){return true}else{return false}}).every(isTrue)){
            queries = queries.map(
              function(que){
                return(JSON.parse(String(que)))
              })
           
          }

          if( filters && queries){
             filters.map(function(filterElement){
               if(checkJsons(queries, filterElement.query)){
                 filterElement.meta.fixedFlag = true;          
                 filterservice.addfixedFilter([dashboardGroupAndName[0], dashboardGroupAndName[1]], filterElement)
               }
               else{filterElement.meta.fixedFlag = false}
             })
          }
      }


// END KP modifications

      function updateFilters() {
     
        const filters = queryFilter.getFilters();
        var locTag = getAppState().title;

        mapAndFlattenFilters(filters).then(function (results) {
          // used to display the current filters in the state
          $scope.filters = _.sortBy(results, function (filter) {
            return !filter.meta.pinned;
          });
          $scope.$emit('filterbar:updated');
        });   
              //filters.map(function(filter){console.log(JSON.stringify(filter))});
              setTimeout(CheckIfFiltersExistsInDefaultFixedFilters( true, filters, navigatedGroup, fixedFilters, [undefined, navigatedGroup]),5);
             
              
        //Check if we are in discover and set the fixedFilterFlagAccordingly

            //KP modifications
            function noFixedFilters(){
              var filters = queryFilter.getFilters();
              filters.map(function(filter){
              var flag = filter.meta.fixedFlag;
              if(flag === true){
                 filter.meta.fixedFlag = !flag;
                 }
                })
             }
           if(typeof(locTag) == "undefined" ){   
            noFixedFilters();
           }      
         }

         
      updateFilters();

      var locTag = getAppState().title;   
         if(typeof (locTag) != "undefined" ){ 
         repristinateFixedFiltersAfterDeletingOutOfDashboard( $scope.state, fixedFilters, [locTag, navigatedGroup])}
     }
  };
});
