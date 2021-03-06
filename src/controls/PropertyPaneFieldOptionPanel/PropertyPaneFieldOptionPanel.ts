import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
 IPropertyPaneField,
 PropertyPaneFieldType
} from '@microsoft/sp-webpart-base';
import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { IPropertyPaneFieldOptionPanelProps } from './IPropertyPaneFieldOptionPanelProps';
import { IPropertyPaneFieldOptionPanelInternalProps } from './IPropertyPaneFieldOptionPanelInternalProps';
import FieldOptionPanel from './components/FieldOptionPanel';
import { IFieldOptionPanelProps } from './components/IFieldOptionPanelProps';

export class PropertyPaneFieldOptionPanel implements IPropertyPaneField<IPropertyPaneFieldOptionPanelProps> {
 public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
 public targetProperty: string;
 public properties: IPropertyPaneFieldOptionPanelInternalProps;
 private elem: HTMLElement;

 constructor(targetProperty: string, properties: IPropertyPaneFieldOptionPanelProps) {
   this.targetProperty = targetProperty;
   this.properties = {
     key: properties.label,
     label: properties.label,
     listId: properties.listId,
     onPropertyChange: properties.onPropertyChange,
     //selectedKey: properties.selectedKey,
     //disabled: properties.disabled,
     onRender: this.onRender.bind(this)
   };
 }

 public render(): void {
   if (!this.elem) {
     return;
   }

   this.onRender(this.elem);
 }

 private onRender(elem: HTMLElement): void {
  
   if (!this.elem) {
     this.elem = elem;
   }

   const element: React.ReactElement<IFieldOptionPanelProps> = React.createElement(FieldOptionPanel, {
     label: this.properties.label,
    
     onChanged: this.onChanged.bind(this),
     listId: this.properties.listId,
     fieldOptions:[]
   });
   ReactDom.render(element, elem);
 }

 private onChanged(option: IDropdownOption, index?: number): void {
   this.properties.onPropertyChange(this.targetProperty, option.key);
 }
}
