import template from './filter_pill.html';
import { uiModules } from 'ui/modules';
import '../style/tooltip.css'

const module = uiModules.get('kibana');

module.directive('filterPill', function () {
  return {
    template,
    restrict: 'E',
    scope: {
      filter: '=',
      onToggleFilter: '=',
      onPinFilter: '=',
      onInvertFilter: '=',
      onDeleteFilter: '=',
      onEditFilter: '=',
    },
    bindToController: true,
    controllerAs: 'pill',
    controller: function filterPillController() {

      this.checkIfFilterISFixed = function (filter){

        if(filter.meta.fixedFlag === true){
          return(true)
          }
          else{
            return(false)
          }
      }

      

      this.activateActions = (filter) => {
      //Test for resolvig error on filter called action from AJs HTML template
     /* if(typeof(filter) === "undefined"){
        console.log(filter)
        return(false)
      }*/
        this.areActionsActivated = true;
      };

      this.deactivateActions = () => {
        this.areActionsActivated = false;
      };

    }
  };
});

