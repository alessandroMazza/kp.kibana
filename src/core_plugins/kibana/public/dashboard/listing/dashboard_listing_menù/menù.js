//JAVASCRIPT CLASS FOR DINAMIC BUTTON TABLE 

export function DashboardTable(numberOfButtons, numberOfButtonsPerRow, studElementId, tableAttributes, tableStyle, divCss){

// Function used to check consistency of properties across a list of objects given a list of keys names.

  function uniques(array){
    function onlyUnique(value, index, self) { 
       return self.indexOf(value) === index;
       }
  return(array.filter(onlyUnique));
   }  



function checkThatPropertiesExist(list, propertyList){
                 
         this.checkObjKeysLength = function(list){  
            var lengthList = [];
            for( var k = 0; k < list.length; k++ ){
                lengthList.push(Object.keys(list[k]).length);
             }
              if(uniques(lengthList).length === 1 ){
            return( lengthList[0] ); } 
           else{ return(false); }
          } 
   
        this.evaluateObjValuesSet = function (obj, propertyList){
           var objKeys = Object.keys(obj);
           var a = false;
           for( var  propNumbers = 0; propNumbers < objKeys.length; propNumbers++ ){
               if(propertyList.indexOf(String(objKeys[propNumbers])) != -1 ){
               a = true;
               }
               else{
               a = false;
               return(a)}}
            return(a); }
       
       if( Array.isArray(list) && Array.isArray(propertyList) ){
          if(this.checkObjKeysLength(list) != propertyList.length){
             return(false);
            }
         booleanCheckArray = [];
         for(var listIndex = 0; listIndex < list.length; listIndex++ ){
            if (this.evaluateObjValuesSet(list[listIndex], propertyList) === true ){
               booleanCheckArray.push(true); 
            }
            else{
              return(false);
            }
           }
           return(true);
         }
        else{return(false);}
       }


//Generic function for updating properties.  

    function updateProperty(object, property, updateValue){;
            object[String(property)] = updateValue;  
       }

//Generic function for passing arguments inside an event binder, also provides with the possibility of passing arguments as a list.

    function wrapEventCallback(callback){
        var args = Array.prototype.slice.call(arguments, 1);
        return function(e){
        callback.apply(this, args)
          }
	   }
       
// Function used for comparing substrings with a given value.
     
    function searchForSubstringAnd(string1, string2, position, separator){
       if (string1.split(separator)[position] == string2){
           return(true);
         }
       }
       
//Alfanumeric string random generator.
//INPUT NOTE: The chars argument refers to a possible mix of identifiers that select witch characters to use, always use aA# for pure alfanumeric.

    function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
   }
 
 
// Menù generator object attributes section START.

    var groupAnchorP = new Number();
    var that = this;
    this.numberOfButtons = numberOfButtons;
    this.numberOfButtonsPerRow = numberOfButtonsPerRow;
    this.attributes = tableAttributes;
    this.tableStyle = tableStyle;
    this.divclass = "navigationDiv";
    this.finalIdList = [];
    this.divCss = divCss;
    this.groupAnchorSetted = false;
    this.groupAnchorPosition = null;
    this.lastClicked = null;
    this.isInjectedHTML = null;
    this.injectedHTMLTextAnchorAttribute = null;
    this.injectedHTMLTextAdditionalAttributes = [];
    
// Menù generator object attributes section END.


// method that passes attributes to the frame table that contains the menù <table attribute0 = "value0".....>, attributes must be passed as a list
// associate lists eg: [["attr0","val0"], ["attr1", "val1"].......["attrN", "valN"]]

    this.setTableAttributes = function(attributes, tableToSet){
        if(Array.isArray(attributes)){ 
           for(var i = 0; i < attributes.length; i++){
               tableToSet.setAttribute(attributes[i][0], attributes[i][1]);
              }
           }
        else{alert('attributes must be passed in the form of an array like [["attribute_0","value_0"].["attribute_1","value_1"]....]')
           }
        }
    
// method that passes styles to the frame table that contains the menù <table style = "style0: val0; style1: val1;".....>, stylesmust be passed as a list
// associate lists eg: [["style0","val0"], ["style1", "val1"].......["styleN", "valN"]] 

     this.setCss = function(tableToSet, tablestyle ){
        if(Array.isArray(tablestyle)){ 
         for(var styles = 0; styles < tablestyle.length; styles++){
            eval("tableToSet.style." + String(tablestyle[styles][0]) + "=" + "'" + String(tablestyle[styles][1]) + "'" + ";");
            }
          } 
         else{alert('attributes must be passed in the form of an array like [["style_0","value_0"].["style_1","value_1"]....]')
           }
        } 
        
//method that generates procedurals ids for the anchor divs inside the table cells and then sets object attributes to store informations about the ids.
//INPUT NOTE: idStruct1 refers to the length of the single id alphanumeric block, idStruct2 refers to the number of alphanumeric blocks to be used, divclass determines the class of the 
//            anchor Divs (set it before in the class parameter in order to ensure the correctness of future construction steps)   

    this.generateProceduralsIds = function(numberOfElements, idStruct1, idStruct2, divClass){
        var idList = new Array(numberOfElements);
        for(var ii = 0; ii < numberOfElements; ii++){
            var tempid = [];
            for(var jj = 0;  jj < idStruct2; jj++){           
                  tempid.push(randomString(idStruct1, "aA#"));
                }
            idList[ii] = tempid.join("-");
            }
          that.finalIdList = idList;
          var tableDivs = document.querySelectorAll(String("." + divClass));
          if (tableDivs.length > 0){
              for(var tDivsLen = 0; tDivsLen < tableDivs.length; tDivsLen++ ){
               tableDivs[tDivsLen].id = idList[tDivsLen];
              }
          }
        }
    
          
// CREATE AND APPEND TABLE, SET ATTR AND  CSS
// Intantiate the frame table element, this operation is carried out when a new instance of the object is created.
  
    var table = document.createElement("table");
    
    if (typeof(studElementId) === "string"){
		document.getElementById(studElementId).appendChild(table);
        this.setTableAttributes(that.attributes, table);
        this.elementTable = table;
		}
   else{
        studElementId.appendChild(table);
        this.setTableAttribute(setTableAttributes(that.attributes, table));
		this.elementTable = table;
		}
   this.setCss( this.elementTable, this.tableStyle);  
        
// END CREATE AND APPEND TABLE       
   
   
// Class method that creates the table cells and the anchor divs, can be called but it is used mainly in an subsequent method for full construction of the menu table.
 
    this.createCell = function(cell, cellClass) {
    var div = document.createElement('div');                 
	if (cellClass){
	    div.setAttribute('class', cellClass);
        div.setAttribute('className', cellClass);  
	}  
    cell.appendChild(div);
    }
	
//See previous method.
	
   this.addColumn = function(elementTable){
       for (var i = 0; i < elementTable.rows.length; i++) {
       that.createCell(elementTable.rows[i].insertCell(elementTable.rows[i].cells.length), "navigationDiv");
        }};
		
   this.appendRow = function (elementTable) {
        var row = elementTable.insertRow(elementTable.rows.length)    
    for ( var i = 0; i < elementTable.rows[0].cells.length; i++) {
        that.createCell(row.insertCell(i), "that.divclass");
     }	
   } 

   
// Class method that generates the rows and columns the menù table complete with anchor divs. Call it after the construction of the menù object. 
 
   this.generateTable = function(){
   var numberOfRows = Math.ceil(that.numberOfButtons/that.numberOfButtonsPerRow);
   var numberOfColumns = that.numberOfButtonsPerRow; 
   for(var i = 0; i < numberOfRows; i++){
     that.appendRow(that.elementTable);
     }
   for(var j = 0; j < numberOfColumns; j++){
     that.addColumn(that.elementTable);
     }
     that.generateProceduralsIds(numberOfButtons, 4, 6, that.divclass)
   }
   
// Class method used to pass style to the anchor divs. Can do what css does. Results  are HTML  <Div id = "divId" class = "divClass" style = "style0: val0; style1: val1;".....>, styles must be passed as a associative list.
// associate lists eg: [["style0","val0"], ["style1", "val1"].......["styleN", "valN"]]
   
   this.setDivStyle = function(style){
     if(Array.isArray(style)){
         if(that.finalIdList.length > 0){
          for(var ids = 0; ids < that.finalIdList.length; ids++){
              var element = document.getElementById(that.finalIdList[ids]);
              for(var divStyleIndex = 0; divStyleIndex < style.length; divStyleIndex++){
                eval("element.style." + String(style[divStyleIndex][0]) + "=" + "'" + String(style[divStyleIndex][1]) + "'" + ";");
                }
             }
          }        
       }
    }
	
  
//This class method presets some td attributes in order to correctly format and center the content of the tds. Call this method after generating the anchor divs.
  
    this.formatButtons = function(){
       var table = that.elementTable;
         var tableColumns = table.getElementsByTagName("td");
         for(var col = 0; col < tableColumns.length; col++){
            tableColumns[col].setAttribute("align","center");
            tableColumns[col].setAttribute("valign","center");
         }
        var firstRow = table.rows[0].getElementsByTagName("td");
        for(var col = 0; col < firstRow.length; col++){
            tableColumns[col].setAttribute("width",String(100/that.numberOfButtonsPerRow) + "%");
         }
       }
       
// This class method sets the dinamic ids adding a matching string that can be used to order the position of specific contents of the divs or  define function that can be bound to specific divs.
// The binding order follows the normal western reading and writing logic (from left to right and from top to bottom), tagging strings are passed as a
// string [Tag_1, Tag_2, ......., Tag_N], Tag_1 will be added to the rightmost top anchor Div.
 

     this.setPositionId = function(positionIdArray){
       if(Array.isArray(positionIdArray)){
           divArray = [];
           for(var ids = 0; ids < that.finalIdList.length; ids++ ){
                divArray.push(document.getElementById(that.finalIdList[ids]));
           }
           
          that.groupAnchorPosition = divArray[0].id.split("-").length + 1;
           
           for(var posId = 0; posId < positionIdArray.length; posId++){
              var newId = divArray[posId].id + "-" + String(positionIdArray[posId]);
              divArray[posId].id = newId;
              that.finalIdList[posId] = newId;
            }  
          that.groupAnchorSetted = true;    
          }
       }
	   
//This class method can be used in order to inject HTML inside of any Div, HTML sons can be passed as list of strings e.g: 	   
//[ '<Div class = "testClass1"> Test Text 1 </aDiv>', '<Div class = "testClass2"> Test Text 2 </Div>'.........., '<Div class = "testClassN"> Test Text N </Div>' ]
//In this case binding order follows the normal western reading and writing logic (from left to right and from top to bottom).
//If the method argument is not passed as a list, all anchor divs will be inject with the same HTML e.g:
// js script --> injectedHTML = '<Div class = "testClass"> Test Text </Div>>'; object.setDivsChildren(injectedHTML)
//If isTextAnchor is set as a 
     
  this.setDivsChildren = function(injectedSons, isTextAnchor) {  
      
     var argsMinusTwo =  Array.prototype.slice.call(arguments, 2);

        function checkThatAllArgsAreStrings(args){
           var boolArgs = args.map(function(elementMap){if(typeof(elementMap) === "string"){
               return(true)}
            else{return (false)}
            }) 
            
           var unqBollArgs = uniques(boolArgs);

            if(unqBollArgs.length === 1 && unqBollArgs[0] == true){
             return(true);
            }
        }
        
        if(checkThatAllArgsAreStrings(argsMinusTwo)){
           var additionalAnchors = argsMinusTwo;  
        }
        else{
            var additionalAnchors = false; 
        }

         if(Array.isArray(injectedSons) && injectedSons.length != 1 && typeof(injectedSons) != "string"){
             for(var i = 0; i < injectedSons.length; i++){
                   document.getElementById(that.finalIdList[i]).innerHTML = injectedSons[i];
              }
            that.isInjectedHTML =  true;
            if(isTextAnchor){
              var textAnchorElements = [];
              for(var i = 0; i < injectedSons.length; i++){
                  textAnchorElements.push(document.getElementById(that.finalIdList[i]).querySelectorAll("[" + String(isTextAnchor) + "]"));
                  if (textAnchorElements.length > 0){
                      that.injectedHTMLTextAnchorAttribute = isTextAnchor;               
                   }
                 }
              var additionalAnchorsElementsList = []; 
              for(var j = 0; j < additionalAnchors.length; j++){
                var additionalAnchorSub = [];          
                for(var len = 0; len < injectedSons.length; len++){
                    additionalAnchorSub.push(document.getElementById(that.finalIdList[len]).querySelectorAll("[" + String(additionalAnchors[j]) + "]"));
                }
                additionalAnchorsElementsList.push(additionalAnchorSub);
              }
            for(i = 0; i < additionalAnchorsElementsList.length; i++){
                if(additionalAnchorsElementsList[i].length >0){
                    that.injectedHTMLTextAdditionalAttributes[i] = additionalAnchors[i];
                }
            }
         }
	 }
         else if (!Array.isArray(injectedSons) && typeof(injectedSons) === "string"){
            for(var i = 0; i < that.finalIdList.length; i++){
                   document.getElementById(that.finalIdList[i]).innerHTML = injectedSons;
              }
            if(isTextAnchor){
            var textAnchorElements = [];
            var additionalAnchorsElementsList = []; 

			for(var i = 0; i < that.finalIdList.length; i++){
               textAnchorElements.push(document.getElementById(that.finalIdList[i]).querySelectorAll("[" + String(isTextAnchor) + "]"));
               }
               if (textAnchorElements.length > 0){
                   that.injectedHTMLTextAnchorAttribute = isTextAnchor;               
                 }
                 
            for(var j = 0; j < additionalAnchors.length; j++){
                
                var additionalAnchorSub = [];
                for(var len = 0; len < that.finalIdList.length; len++){
                     additionalAnchorSub.push(document.getElementById(that.finalIdList[len]).querySelectorAll("[" + String(additionalAnchors[j]) + "]"));
                    
                }
              }

              for(i = 0; i < additionalAnchorsElementsList.length; i++){
                if(additionalAnchorsElementsList[i].length >0){
                    that.injectedHTMLTextAdditionalAttributes[i] = additionalAnchors[i];
                }
            }
            }
          }      
   }	

//Class method that binds a function onclick to all the Divs of the menù, this function will also trigger the update of the object.lastClicked attribute that can be used to store the information regarding
//the selected Div. The function arguments must be passed as a list e.g: [arg0, arg1, ....., argN]. 
//Unless a single argument is passed, in this case it can be passed directly without been passed as list (still encouraged though).


    this.bindOnclickFunction = function(functionToBind, funcArguments){
       var ids = that.finalIdList;     
       for(var i = 0; i < ids.length; i++ ){
           document.getElementById(ids[i]).addEventListener("click",  wrapEventCallback(functionToBind, funcArguments));
           document.getElementById(ids[i]).addEventListener("click",  wrapEventCallback(updateProperty, that, "lastClicked", ids[i]));
       }
     } 

// Method that binds a specific function to a specific div, uses the group id tag in order match functions and divs.
// Functions must be passed as a list of objects constructed as following:
// func1 = { Function : anonymus function to match,
//           Arguments : arguments of the function (passed as a a list if more than one),
//           Tag : matching Tag (string parameter)
//         }
// ordered must be true, parameter left for possible future developments.


    this.bindOnClickOrderedFunction = function(functionToBindList, ordered){
       if(that.groupAnchorSetted === false){
          alert("No function anchor tag inside the buttons Ids, call TableDashBoard.setPositionId first");
          return(false);
          }
       if(!ordered){
          var ordered = false;
          }
       var hitList = [];
       if( Array.isArray(functionToBindList) ){ 
          if( ordered && checkThatPropertiesExist(functionToBindList, ["Function", "Arguments", "Tag"])){
               for(var functionIndex = 0; functionIndex < functionToBindList.length; functionIndex++){
                  for(var idsIndex = 0; idsIndex < that.finalIdList.length; idsIndex++ ){
                      var elementButton = document.getElementById( that.finalIdList[idsIndex]);
                      if( functionToBindList[functionIndex].Tag === that.finalIdList[idsIndex].split("-")[that.groupAnchorPosition - 1]){
                          elementButton.addEventListener("click",  wrapEventCallback( functionToBindList[functionIndex].Function, functionToBindList[functionIndex].Arguments ));        
                          hitList.push(that.finalIdList[idsIndex].split("-")[that.groupAnchorPosition - 1]);
                      }
                  }
               }
            }
          }
        else{alert("Found an inconsistency inside the list of function object passed to the bindOnClickOrderedFunction method, OR order parameter is nonexistent")};
        if( hitList.length > 0){
          return(true);
        }
        else{
          alert("no hits on tags");
          return(false);
        }
       }
 
	  
//This method can be used in the kibana environment in order to bind navigation to the table divs.
//INPUT NOTE: ordered = Tells the method if navigation is ordered (binding between id added tag and dashboard title group tag).
//            stringList1 = passes the ids of the anchor divs witch will bind with the navigation function (use the ids stored inside the object.finalIdList property). 
//            titleListAndUrlList = List of lists that must be created and passed inside the Kibana Environment, it should have the following structure [ [Title0, kbnUrl0], [Title1, kbnUrl1],......, [TitleN, kbnUrlN] ]            
//            navigationFunction = The navigation function as specified inside the Kibana Env.
//            additionalNavigationFunctionArgument = Self interpreting argument, makes possible to pass multiple additional arguments to the kibana navigation function, multiple arguments must be     passed as a list e.g: [arg0, arg1, ....., argN]
// 
//NOTE: When the TextAnchor argument is set != from false or null (meaning that a text anchor attribute is set inside of at least one of the buttons)
//      the titles from titleListAndUrlList are used for set the internal text of the designated node inside of the injected HTML.
//
//ADDITTIONAL NOTE: The navigation function can be any function that uses kibana internal variables like titles and dashboard ids, it is not restricted only to navigation function, it can also be a 
//                  service invocation 


    this.setKibanaTitlesAndSetNavigationAndOtherAttributes = function(ordered, stringList1, titleListAndUrlList, navigationFunction, additionalNavigationFunctionArguments, titles){   
    
    var offset = 3;
     
     var additionalElementsTitleAndUrl = titleListAndUrlList.map(function(element){
         return(element.slice(offset))
        });
     
      //ordered section
      
      if(ordered && ordered === true){
         if(Array.isArray(stringList1) && Array.isArray(titleList) && typeof(stringList1) != "string" && typeof(titleList) != "string"){
             if(that.groupAnchorSetted = true){
                    var associativeList = [];
                    var divsInAssocciativeList = [];
                    var indexesOfTitlesInAssociativeList = [];
                    for(var i = 0; i < stringList1.length; i++){
                       for(var j = 0; j < titleListAndUrlList.length; j++){
                          if(searchForSubstringAnd(stringList1[i], titleListAndUrlList[j][0].split("_")[0], groupAnchorPosition, "-")) {
                             associativeList.push([stringList1[i], titleListAndUrlList[j][1], titleListAndUrlList[j][0].split("_")[1]]);
                             divsInAssocciativeList.push(stringList1[i]);
                             indexesOfTitlesInAssociativeList.push(j);
                           }
                         }
                      }                                   
              }
            else{ console.log("id position Descriptor not found")}
            }
             if(associativeList.length > 0 && associativeList.length <= stringList1.length){
                  for(var i = 0; i < associativeList.length; i++ ){
                      document.getElementById(associativeList[i][0]).addEventListener("click", wrapEventCallback(navigationFunction, associativeList[i][1], additionalNavigationFunctionArguments));
                       if(that.injectedHTMLTextAnchorAttribute){
                           document.getElementById(stringList1[i]).querySelectorAll("[" + String(that.injectedHTMLTextAnchorAttribute) + "]")[0].innerHTML =  titleListAndUrlList[i][0]; 
                      }
                   }
                   var divsNotIncluded = [];
                   var urlsNotIncluded = titleListAndUrlList;
                   for(j = 0; j < stringList1.length; j++){
                        if(!divsInAssocciativeList.include(stringList1[j])){
                           divsNotIncluded.push(stringList1[j]);
                        }
                      }
                     for(var k = 0; k < indexesOfTitlesInAssociativeList.length; k++){
                          urlsNotIncluded.splice(indexesOfTitlesInAssociativeList[k], 1);
                        }
                    for(var g = 0; g < urlsNotIncluded.length; g++){a
                       document.getElementById(divsNotInclauded[g]).addEventListener("click", wrapEventCallback(navigationFunction, urlsNotIncluded[g][1], additionalNavigationFunctionArguments));
                        }
                      }
             else if (associativeList.length > 0 && associativeList.length == stringList1.length){
               for(var i = 0; i < associativeList.length; i++ ){
                      document.getElementById(associativeList[i][0]).addEventListener("click", wrapEventCallback(navigationFunction, associativeList[i][1], additionalNavigationFunctionArguments));
                       if(that.injectedHTMLTextAnchorAttribute){
                         document.getElementById(stringList1[i]).querySelectorAll("[" + String(that.injectedHTMLTextAnchorAttribute) + "]")[0].innerHTML =  titleListAndUrlList[i][0]; 
                         }
                    }
             }
          }
          
          //unordered section
          
             else if(!ordered || ordered === false){
               for(var i = 0; i <  titleListAndUrlList.length; i++ ){     
                  document.getElementById(stringList1[i]).addEventListener("click", wrapEventCallback(navigationFunction,  titleListAndUrlList[i][1], additionalNavigationFunctionArguments));
                   if(that.injectedHTMLTextAnchorAttribute ){   
                     document.getElementById(stringList1[i]).querySelectorAll("[" + String(that.injectedHTMLTextAnchorAttribute) + "]")[0].innerHTML =  titleListAndUrlList[i][0]; 
                   }
                for(var j = 0; j < that.injectedHTMLTextAdditionalAttributes.length; j++){
                    if(that.injectedHTMLTextAdditionalAttributes[j] ){      
                        document.getElementById(stringList1[i]).querySelectorAll("[" + String(that.injectedHTMLTextAdditionalAttributes[j]) + "]")[0].innerHTML =  additionalElementsTitleAndUrl[i][j];                                         
                    }
                  }
                 }
              }
        }


  
};



//END OF DINAMIC BUTTON TABLE CLASS


/*  TEST AND USAGE EXAMPLES

function testFunction(args){
       for(i = 0; i < args.length; i++){
          window.alert(args[i]);
          }
       }

var attributes = [["id", "navigationTable"], ["border", "0"], ["height","80%"], ["width", "80%"],["border-collapse", "collapse"]];
var css =[["borderCollapse","collapse"], ["borderColor", "black"], ["borderWidth", "1px"]]
var divCss = [["backgroundColor", "gray"], ["color", "red"], ["width","60%"],["height","60%"],["borderWidth","1.2vw"], ["borderStyle","outset"],["cursor", "pointer"]]

func1 = { Function : function(arg){alert(arg)},
          Arguments : "nigger",
          Tag : "EDI"
        }
        
func2 = { Function : function(arg){alert(arg)},
          Arguments : "pigger",
          Tag : "MKTPLACE"
          }
                 
func3 = { Function : function(arg){alert(arg)},
          Arguments : "gigger",
          Tag : "NEDI"
          }

TableDashBoard = new DashboardTable(5, 2, "testId", attributes, css);
TableDashBoard.generateTable();
TableDashBoard.setPositionId(["EDI","MKTPLACE","NEDI"]);
TableDashBoard.setDivStyle(divCss);
TableDashBoard.formatButtons();
TableDashBoard.setDivsChildren('<Div class = "injectedDiv" textAnchor = true></Div>', "textAnchor");
//TableDashBoard.bindOnclickFunction(testFunction,["nigger", "pigger", "gigger"]);
TableDashBoard.bindOnClickOrderedFunction([func1, func2, func3], true)



// END OF TEST AND USAGE EXAMPLES


*/
