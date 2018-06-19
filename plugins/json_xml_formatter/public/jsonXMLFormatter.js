import { RegistryFieldFormatsProvider } from '../../../src/ui/public/registry/field_formats';
import { FieldFormat } from '../../../src/ui/field_formats/field_format';
RegistryFieldFormatsProvider.register(stringifyJson);

//import format from 'xml-formatter';
//import pd from 'pretty-data';

function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w([^>]*[^\/])?>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}



function stringifyJson(Private) {
        class jsonXMLFormat extends FieldFormat {

                static id = 'jsonXMLFormat';
                static title = 'Json-XML';
                static fieldType = ['string'];

                _convert = {
                        text: function(value) {
                                return value;
                        },

                        html: function(value) {
						if (value == null)
							return '-';
						if (value.startsWith("{") == true) {
							var jsonPretty = JSON.stringify(JSON.parse(value),null,2);	
							//var html = '<pre>' + jsonPretty + '</pre>';
							//var html = '<div id="custom_div">' + xml_escaped + '</div>';
							var html = '<div>' + jsonPretty + '</div>';
							return html;
						}
						if (value.startsWith("<") == true) {
							
							var xml_formatted = formatXml(value);
							var xml_escaped = xml_formatted.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;');
							
							//var html = '<pre>' + xml_escaped + '</pre>';
							//var html = '<pre id="custom_pre">' + xml_escaped + '</pre>';
							//var html = '<div id="custom_div">' + xml_escaped + '</div>';
							var html = '<div>' + xml_escaped + '</div>';
							return html;
						}	
						return value;	
			}
                }

                constructor(params) {
                        super(params);
                }
        }

  return jsonXMLFormat;
}
