import visTemplate from 'plugins/elasticsearchGroupIndexService/elasticsearchCall.html';
import 'plugins/elasticsearchGroupIndexService/elasticsearchCallController';
import {VisFactoryProvider} from 'ui/vis/vis_factory';
import {VisTypesRegistryProvider} from 'ui/registry/vis_types';

const myRequestHandler = async (vis, appState, uiState, searchSource) => {
  debugger;
  return data;
};

VisTypesRegistryProvider.register(function GroupsProvider(Private) {;
        //var TemplateVisType = Private(require('ui/template_vis_type/template_vis_type'));
        const VisFactory = Private(VisFactoryProvider);
        return VisFactory.createAngularVisualization({
            name: 'GroupQuery',
            title: 'Test Query Elastic',      
            description: 'test',
            icon: 'fa-quandl-o',
            visConfig: {
                template: visTemplate
                //template: visTemplate
            },
            requestHandler: 'none'
        })}
)
