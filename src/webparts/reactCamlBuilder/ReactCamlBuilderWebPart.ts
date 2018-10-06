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
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls';

export interface IReactCamlBuilderWebPartProps {
  description: string;
  selectedList:string;
  test:string;
}

export default class ReactCamlBuilderWebPart extends BaseClientSideWebPart<IReactCamlBuilderWebPartProps> {

  private loadLists(): Promise<IDropdownOption[]> {
    return new Promise<IDropdownOption[]>((resolve: (options: IDropdownOption[]) => void, reject: (error: any) => void) => {
      setTimeout(() => {
        resolve([{
          key: 'sharedDocuments',
          text: 'Shared Documents'
        },
          {
            key: 'myDocuments',
            text: 'My Documents'
          }]);
      }, 2000);
    });
  }
  private onListChange(propertyPath: string, newValue: any): void {
    const oldValue: any = get(this.properties, propertyPath);
    // store new value in web part properties
    update(this.properties, propertyPath, (): any => { return newValue; });
    // refresh web part
    this.render();
  }
 
  public render(): void {
    const element: React.ReactElement<IReactCamlBuilderProps > = React.createElement(
      ReactCamlBuilder,
      {
        description: this.properties.test
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
                new PropertyPaneFieldOptionPanel('listName', {
                  label: "test",
                  loadOptions: this.loadLists.bind(this),
                  onPropertyChange: this.onListChange.bind(this),
                  selectedKey: this.properties.test
                }),
 
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyFieldListPicker('singleList', {
                  label: 'Select a list',
                  selectedList: this.properties.selectedList,
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

              ]
            }
          ]
        }
      ]
    };
  }
}
