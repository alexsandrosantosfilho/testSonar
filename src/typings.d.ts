/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// vkbeautify
declare var System: any;

interface VkbeautifyStatic {
  xml(xml_text: string): string;
  xmlmin(xml_text: string): string;
}

declare var vkbeautify: VkbeautifyStatic;

// X2JS
interface IX2JS {
  new (): IX2JS;

  xml2js(xml: string): any;
  js2xml(object: any): any;
}

declare var X2JS: IX2JS;
