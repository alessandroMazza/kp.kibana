import { SavedObjectRegistryProvider } from 'ui/saved_objects/saved_object_registry';
import 'ui/pager_control';
import 'ui/pager';
import { DashboardConstants, createDashboardEditUrl } from '../dashboard_constants';
import { SortableProperties } from '@elastic/eui';
import { ConfirmationButtonTypes } from 'ui/modals';
import { DashboardTable } from './dashboard_listing_menù/menù';
import { AppStateProvider } from 'ui/state_management/app_state';
//import * as images from '../plugins/kibana/assets';
import './style/dashboard_listing.css'

                                        
export function DashboardListingController($injector, $location,$timeout, $scope, $rootScope, $route, $routeParams, $compile, dashboardNavigationState) {

  const $filter = $injector.get('$filter');
  const confirmModal = $injector.get('confirmModal');
  const Notifier = $injector.get('Notifier');
  const pagerFactory = $injector.get('pagerFactory');
  const Private = $injector.get('Private');
  const timefilter = $injector.get('timefilter');
  const config = $injector.get('config');
  const dashboardConfig = $injector.get('dashboardConfig');
  const kbnUrl = $injector.get('kbnUrl');

  timefilter.disableAutoRefreshSelector();
  timefilter.disableTimeRangeSelector();
  
  var DashboardListingControllerThat = this;
//KP_START parser and grouper

//Navigation list function

function groupGroups(groupList, sep, pos, areThereAdditionalArguments){
          if(!areThereAdditionalArguments){
             var navigationList = [];
             for (var gl = 0; gl < groupList.length; gl++){
                navigationList.push([groupList[gl][0][0].split(sep)[pos], groupList[gl][0][2]]);
              }
           return(navigationList);
             }
          else{
            var navigationList = [];;
            for (var gl = 0; gl < groupList.length; gl++){
               try{
              var navListToPush = [groupList[gl][0][0].split(sep)[pos], groupList[gl][0][2]];
              var offsetIndex = (groupList[gl][0].length - navListToPush.length);
                 for(var addIndex = 0; addIndex < offsetIndex; addIndex++){
                  navListToPush.push(groupList[gl][0][offsetIndex + addIndex])      
                 }    
                 navigationList.push(navListToPush)  
                }
                catch(error){
                  console.log(gl)
                }     
            }
            return(navigationList);
          }
        
      }

      function sortGroup(group){
        var indexArray = [];
        var orderedGroupArray = [];
        var unorderedGroupArray = [];
        for(var groupIndex = 0; groupIndex < group.length; groupIndex++){
             var ind = group[groupIndex][0].lastIndexOf("_");
             var inde = group[groupIndex][0].substring(ind+1);
             if(typeof(parseInt(inde)) === "number"){
                indexArray.push(inde);
                orderedGroupArray.push(group[groupIndex]);
             }
             else{
              unorderedGroupArray.push(group[groupIndex]);
             }
        }
        var supGroup = new Array(Math.max.apply(null, indexArray)).fill(null);
        for(groupIndex = 0; groupIndex < indexArray.length; groupIndex++){
           supGroup[indexArray[groupIndex]] = orderedGroupArray[groupIndex];
        }
         supGroup.push.apply(supGroup, unorderedGroupArray);
      
        for(var q = 0; q < supGroup.length; q++){
          if(supGroup[q] === null){
            supGroup.splice(q,1);
            q--;
          } 
         }
        return(supGroup)
      
      }
    

//End of Navigation list function


// Start KP Utility Functions

function stringify(array){
	if(Array.isArray(array)){
		for(var l = 0; l < array.length; l++){
			array[l] = String(array[l]) 
			}
		}
    else{
		array = String(array);
		}
	return(array);
	}


function uniques(array){
    function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }
  return(array.filter(onlyUnique));
}


function attributes(items, attribute){
	if(Array.isArray(items) && typeof(attribute) == "string"){
	    var attributeList = [];
	    for(var i = 0; i < items.length; i++){	    
		    attributeList.push(items[i][attribute]);            
     
                 ;
		}
                if(attributeList.length >0){
		return(attributeList)
               }
                else{ 
                     return(false)
                     } 
	  }
	else{alert("Passed a non array-like argument or attribute description must be of type string")}
	}


function grouperTitles(titleList,sep){
  function checkIfAllIs(list, type){
	function testElement(arrayElement){
		if(typeof(arrayElement) == type)
		{ return(true)} 
		else 
		{return(false)}
	    };
	
    if (Array.isArray(list) && typeof(type) == "string"){
       return(list.every(testElement, type)); 
       }
	else{alert("Passed a non array-like argument or specified invalid type")}
 };
 
function splitParserCorrecter(splitString, sep){
	var splitted = splitString.split(sep);
	if (splitted.length > 1){
		return (splitted[0]);
	   }
	else{
		return(null);
		}
	}
	
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
 
function Parser(titleList,sep){
	if(checkIfAllIs(titleList,"string") && typeof(sep) == "string" ){
		var splitList = [];
		for (var i = 0; i < titleList.length; i++){
			splitList.push(splitParserCorrecter(titleList[i], sep));
			}
		var cleanSplitList = splitList.clean(null);
		var uniquesvar = uniques(cleanSplitList);
		var Groups = [];
		var GroupsIDs =[];
		for(var i = 0; i < uniquesvar.length; i++){
			Groups.push([]);
			GroupsIDs.push(uniquesvar[i]);
			for(var j = 0; j < titleList.length; j++){
				if(splitParserCorrecter(titleList[j], sep) == uniquesvar[i]){
					Groups[i].push(titleList[j]);
					}
				}
			}
		var groupedGroups = [];
		for(var i = 0; i < Groups.length; i++){
			groupedGroups.push(Groups[i]);	
			groupedGroups[i].Group = GroupsIDs[i];
			}
		return(groupedGroups);
		}
   }

return(Parser(titleList,sep));
}


function crossConcat(args,sep){
	if( typeof(sep) != "string" ){
		return(false);
		}
	var length = new Array(args.length);
	if (args.length > 0){
		for(var i = 0; i < args.length; i++){
			length[i] = args[i].length;
			}
	if (uniques(length).length == 1){
		if(!Array.isArray(args[0])){
			for(i = 0; i > args.length; i++){
				args[i] = [args[i]];
				}
			}
		var reshape = new Array(args.length);
                var intermediate = [];
		for (var j = 0; j < args[0].length; j++){
		  intermediate = [];
		  for (var k = 0; k < args.length; k++){
			intermediate.push(args[k][j]);  
			}
		  reshape[j] = intermediate;
		  }
                 var resh = reshape;
		 for(i = 0; i < reshape.length; i++){
			 reshape[i] = reshape[i].join(sep);  
			 }
		}
		return(reshape); 
		}		
	  }

function splitter(splitarray,sep){
  for(var j = 0; j < splitarray.length; j++){
    for(var i = 0; i < splitarray[j].length; i++){
      splitarray[j][i] = String(splitarray[j][i]).split(sep);
     }
    }
   return(splitarray);
   }

function selectFirstSplit(array, position0, position1, sep){
	var selectedArray = [];
	if(Array.isArray(array[0])){
	   for(var i = 0; i < array.length; i++){
		    selectedArray.push(String(array[i][position0]).split(sep)[position1]);
                    
		    }
	    }
	else{   
                 selectedArray = String(array).split(sep)[position1];
		}
	return (selectedArray)
	}

function arrayTakePosition(array, position){
     var arrayRet = [];
     for (var i = 0; i < array.length; i++){
       arrayRet.push(array[i][position])
       }   
     return(arrayRet) ; 
     }

var count = 1; 
function generatePath(limit){
           if(count === limit){
              count = 1;
           }
           var path = "../plugins/kibana/assets/K" + count + ".svg";
           count++;
           return(path)  
          }


 function sobstituteSubstring(injectedHtml, listLen, substringSub){
     
     var substituteList = [];
     var count = 1;    
     
     for(var j = 0; j < listLen; j++){
          substituteList.push(generatePath(11));    
        };
       var injHtmlList = [];
       for(var i = 0; i < substituteList.length; i++){
            injHtmlList.push(injectedHtml.replace(substringSub, substituteList[i]));
            }
       return(injHtmlList)    
       }



//This function is used in order to determine witch group has been selected in order to pass it to the dahboard app      

      function recognizeWitchGroup(attribute, groups, position){     
        for(var i = 0; i < groups.length; i++){
           for(var j = 0; j < groups[i].length; j++){
                if(groups[i][j][position] === attribute){
                return(groups[i]);            
             }
           }
        }
    }

// END KP Utility Functions

//KP_END  parser and grouper
 

  const limitTo = $filter('limitTo');
  // TODO: Extract this into an external service.
  const services = Private(SavedObjectRegistryProvider).byLoaderPropertiesName;
  const dashboardService = services.dashboards;
  const notify = new Notifier({ location: 'Dashboard' });

  let selectedItems = [];
  const sortableProperties = new SortableProperties([
    {
      name: 'title',
      getValue: item => item.title.toLowerCase(),
      isAscending: true,
    },
    {
      name: 'description',
      getValue: item => item.description.toLowerCase(),
      isAscending: true
    }
  ],
  'title');


  const calculateItemsOnPage = () => {
    
    var parentThat = this;

    this.titleAndIdPersister = dashboardNavigationState;
    this.items = sortableProperties.sortItems(this.items);
    this.pager.setTotalItems(this.items.length);
    this.pageOfItems = limitTo(this.items, this.pager.pageSize, this.pager.startIndex);
    //console.log(this.pageOfItems)

//KP_START LISTING MODIFICATIONS


  //KP MEDIAMARKET GROUPS STRUCTURE MODIFICATIONS


    //MediaMarket description popUP
 
    function titlePopup(title, popupText){
      this.title = title;
      this.popupText = popupText;
    }

    //Description popUp
    
    var pupUp0 = new titlePopup("INTEGRATIONS","Asynchronous ESB services overview and statistics");
    var pupUp1 = new titlePopup("SERVICES","Synchronous ESB services overview and statistics");
    var poupList = [pupUp0, pupUp1];
    //end descriptionPopup


    function assignPopup(group, titlePopupList){
      for(var popsnumber = 0; popsnumber < titlePopupList.length; popsnumber++){
         if(group.Group === titlePopupList[popsnumber].title){
            group.map(function(dash){
              dash.push(titlePopupList[popsnumber].popupText);
            })
            group.popUpTitleFound = true; 
         }
        }

        group.map(function(dash){
             if( group.popUpTitleFound != true ){
                 dash.push("no Description available");
               }
             })

        return(group);
        
       
    }
 //sortGroup(group)
    this.titleAttributes = [attributes(this.pageOfItems, "title"), attributes(this.pageOfItems, "id"), attributes(this.pageOfItems, "url")];
    var groupies = splitter(grouperTitles(crossConcat(this.titleAttributes,"separator"),"_"),"separator"); 
    var groups = groupies.map(function(group){
           return(assignPopup(group, poupList));
          })
    this.groups = groups.map(function(group){return(sortGroup(group))});



   
    //this.titlex = selectFirstSplit(arrayTakePosition(this.groups,0), 0, 1, "_");
    this.navigationList = groupGroups(this.groups, "_",0,true);
   
    this.replaceString = "#/";

   // navigation function


   this.navigateToDashboardKnbUrlSimple = function(dashboardUrl){
    dashboardUrl = dashboardUrl.replace("#/","");
    kbnUrl.change(dashboardUrl);
  };
   
    this.navigateToDashboardKnbUrl = function(dashboardUrl, additionalArguments){  
         var replaceString = additionalArguments[0];
         console.log(dashboardUrl.replace(replaceString,""))
         var persister = additionalArguments[1].getNavState();
         persister.selectedFromDashboardListingDashboardId = dashboardUrl.replace(replaceString,"");
         persister.navigationFromDashboardListing = true;
         persister.selectedGroup = recognizeWitchGroup(dashboardUrl, additionalArguments[2],2);
         kbnUrl.change(dashboardUrl.replace(replaceString,""));
       };

    // END navigation function

     // Menù

        //Menù attributes and styles  
    var menuGenerator = (function(){
        var tableAttributes = [["id", "navigationTable"], ["border", "0"], ["height","100%"], ["width", "90%"],["border-collapse", "collapse"]];
        var tableCss =[["borderCollapse","collapse"], ["borderColor", "black"], ["borderWidth", "1px"]]
        var tableDivCss = [["marginTop","1.5vh"],["width","35vh"],["height","35vh"],["borderWidth","0.0vw"], ["borderStyle","solid"],["borderColor","black"],["cursor", "pointer"], ["display","table-cell"],["verticalAlign","middle"]]


       /*var htmlSrc = ["https://image.flaticon.com/icons/svg/204/204304.svg","https://image.flaticon.com/icons/svg/164/164424.svg" , "https://image.flaticon.com/icons/svg/204/204288.svg", "https://image.flaticon.com/icons/svg/762/762632.svg"]*/
        
        //var tooltip = '<span class="tooltiptext"> Number of dashboards in the group </span>'

        var injectedHTMLFrame = '<Table style = "height:100%;width:100%;border:solid;border-color:#0079a5;"><tr height = "20%" style = "background-color:#0079a5" ><td><table style = "height:100%;width:100%;"><tr style = "vertical-align:middle;" ><td  style ="height:100%;width:85%;" ><div class = "textDiv" style ="position:relative;width:100%;height:100%;"><a textAnchor = "true"  style ="color:white;font-size:2.8vh;position:absolute;top:50%;transform:translate(10%, -50%);"></a></Div></td><td style:"width:15%;height:100%;"><div  class="tooltip" style="position:relative;width:100%;height:100%;"><span groupDescription = "true" class="tooltiptext"> </span><a style ="color:white;font-size:2.5vh;position:absolute;top:50%;transform:translate(10%, -50%);">&#63;</a></div></td><tr></table></td></tr><tr><td><image src = "HtmlSrcString" style = "width:100%;height:80%;padding:2.5vh;margin-top:1vh;"></image></td></tr></Table>';
        

        var injectedHTML = sobstituteSubstring(injectedHTMLFrame,  parentThat.groups.length, "HtmlSrcString");
         
        /*var injectedHTML = '<Table style = "height:100%;width:100%;border:solid;border-color:rgb(68,114,196);"><tr height = "30%" style = "background-color:rgb(68,114,196)" ><td><table style = "height:100%;width:100%;"><tr  style = "vertical-align:middle;" ><td  style ="height:100%;width:50%;" ><div class = "textDiv" style ="position:relative;width:100%;height:100%;"><a textAnchor = "true"  style ="color:white;fontSize:4vw;position:absolute;top:50%;transform:translate(20%, -50%);"></a></Div></td><td style:"width:50%;height:100%;"><div style="position:relative;width:100%;height:100%;"><a style ="color:white;fontSize:4vw;position:absolute;top:50%;transform:translate(20%, -50%);">Number</a></div></td><tr></table></td></tr><tr><td><image src = "../plugins/kibana/assets/138353.svg" style = "width:100%;height:80%;"></image></td></tr></Table>'*/

       //end menù attributes and styles 
        
        var TableDashBoard = new DashboardTable(parentThat.groups.length, 2, "menuAnchor", tableAttributes, tableCss, tableDivCss);
              TableDashBoard.generateTable();
              TableDashBoard.setDivStyle(tableDivCss);
              TableDashBoard.formatButtons();
              TableDashBoard.setDivsChildren(injectedHTML, "textAnchor", "groupDescription");
              TableDashBoard.setKibanaTitlesAndSetNavigationAndOtherAttributes(false,  TableDashBoard.finalIdList, parentThat.navigationList, parentThat.navigateToDashboardKnbUrl,[parentThat.replaceString, parentThat.titleAndIdPersister, parentThat.groups]);
        return(TableDashBoard);
       })()


//END Menù

   

// KP_END MODIFICATION

  };

  const fetchItems = () => {
    this.isFetchingItems = true;

    dashboardService.find(this.filter, config.get('savedObjects:listingLimit'))
      .then(result => {
        this.isFetchingItems = false;
        this.items = result.hits;
        this.totalItems = result.total;
        this.showLimitError = result.total > config.get('savedObjects:listingLimit');
        this.listingLimit = config.get('savedObjects:listingLimit');
        calculateItemsOnPage();
      });
  };


  const deselectAll = () => {
    selectedItems = [];
  };

  const selectAll = () => {
    selectedItems = this.pageOfItems.slice(0);
  };

  this.isFetchingItems = false;
  this.items = [];
  this.pageOfItems = [];
  this.filter = ($location.search()).filter || '';

  this.pager = pagerFactory.create(this.items.length, 20, 1);

  this.hideWriteControls = dashboardConfig.getHideWriteControls();

  $scope.$watch(() => this.filter, () => {
    deselectAll();
    fetchItems();//TO DO add an reference to PersistedTitleAndIds in order to be used inside calculateItemsOnPage
    $location.search('filter', this.filter);
  });


  this.isAscending = (name) => sortableProperties.isAscendingByName(name);
  this.getSortedProperty = () => sortableProperties.getSortedProperty();

  this.sortOn = function sortOn(propertyName) {
    sortableProperties.sortOn(propertyName);
    deselectAll();
    calculateItemsOnPage();

  };

  this.toggleAll = function toggleAll() {
    if (this.areAllItemsChecked()) {
      deselectAll();
    } else {
      selectAll();
    }
  };

  this.toggleItem = function toggleItem(item) {
    if (this.isItemChecked(item)) {
      const index = selectedItems.indexOf(item);
      selectedItems.splice(index, 1);//TO DO add an reference to PersistedTitleAndIds in order to be used inside calculateItemsOnPage
    } else {
      selectedItems.push(item);
    }
  };

  this.isItemChecked = function isItemChecked(item) {
    return selectedItems.indexOf(item) !== -1;
  };

  this.areAllItemsChecked = function areAllItemsChecked() {
    return this.getSelectedItemsCount() === this.pageOfItems.length;
  };

  this.getSelectedItemsCount = function getSelectedItemsCount() {
    return selectedItems.length;
  };


  this.deleteSelectedItems = function deleteSelectedItems() {
    const doDelete = () => {
      const selectedIds = selectedItems.map(item => item.id);

      dashboardService.delete(selectedIds)
        .then(fetchItems)
        .then(() => {
          deselectAll();
        })
        .catch(error => notify.error(error)); 
    };

    confirmModal(
      `You can't recover deleted dashboards.`,
      {
        confirmButtonText: 'Delete',
        onConfirm: doDelete,
        defaultFocusedButton: ConfirmationButtonTypes.CANCEL,
        title: 'Delete selected dashboards?'
      });
  };

  this.onPageNext = () => {
    deselectAll();
    this.pager.nextPage();
    calculateItemsOnPage();
  };

  this.onPagePrevious = () => {
    deselectAll();
    this.pager.previousPage();
    calculateItemsOnPage();

  };

  this.getUrlForItem = function getUrlForItem(item) {
    return `#${createDashboardEditUrl(item.id)}`;
  };

  this.getEditUrlForItem = function getEditUrlForItem(item) {
    return `#${createDashboardEditUrl(item.id)}?_a=(viewMode:edit)`;
  };

  this.getCreateDashboardHref = function getCreateDashboardHref() {
    return `#${DashboardConstants.CREATE_NEW_DASHBOARD_URL}`;
  };



}
