'use strict'

module.exports = function(kibana){
     return new kibana.Plugin({
     uiExports: {
      fieldFormats: ['plugins/json_xml_formatter/jsonXMLFormatter']
    }
  });
};

