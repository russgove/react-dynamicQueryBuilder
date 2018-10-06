import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { PropertyPaneFieldOptionPanel } from '../../controls/PropertyPaneFieldOptionPanel/PropertyPaneFieldOptionPanel';
import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { update, get } from '@microsoft/sp-lodash-subset';
import * as strings from 'ReactCamlBuilderWebPartStrings';
import ReactCamlBuilder from './components/ReactCamlBuilder';
import { IReactCamlBuilderProps } from './components/IReactCamlBuilderProps';

import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import FieldOptionPanel from '../../controls/PropertyPaneFieldOptionPanel/components/FieldOptionPanel';
export interface IReactCamlBuilderWebPartProps {

  listName:string;

}

export default class ReactCamlBuilderWebPart extends BaseClientSideWebPart<IReactCamlBuilderWebPartProps> {


 
  public render(): void {
    const element: React.ReactElement<IReactCamlBuilderProps > = React.createElement(
      ReactCamlBuilder,
      {
        description: this.properties.listName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
protected fieldOptionsChanged():void{
  debugger;
}
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    debugger;
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldListPicker('listName', {
                  label: 'Select a list',
                  selectedList: this.properties.listName,
                  includeHidden: false,
                  //baseTemplate: 109,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  // multiSelect: false,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId',
                  webAbsoluteUrl: this.context.pageContext.web.absoluteUrl
                }),
             
                
                  new PropertyPaneFieldOptionPanel('listName', {
                    label: "test",
                
                    onPropertyChange: this.fieldOptionsChanged.bind(this),
                    selectedKey: this.properties.listName
                  }),
   
  
              ]
            }
          ]
        }
      ]
    };
  }
}
