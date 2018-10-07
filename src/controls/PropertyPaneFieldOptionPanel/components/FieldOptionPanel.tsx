import * as React from 'react';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { DetailsList ,IColumn} from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner } from 'office-ui-fabric-react/lib/components/Spinner';
import { Checkbox } from 'office-ui-fabric-react/lib/components/Checkbox';
import { IFieldOptionPanelProps } from './IFieldOptionPanelProps';
import { IFieldOptionPanelState } from './IFieldOptionPanelState';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import {sp} from "@pnp/sp";
import  {findIndex} from "@microsoft/sp-lodash-subset"

export default class FieldOptionPanel extends React.Component<IFieldOptionPanelProps, IFieldOptionPanelState> {
    private selectedKey: React.ReactText;

    constructor(props: IFieldOptionPanelProps, state: IFieldOptionPanelState) {
        debugger;
        super(props);
     

        this.state = {
            loading: false,
            options: undefined,
            error: undefined,
            fieldOptions: [],
            showPanel: false // rgove added
        };
    }

    public componentDidMount(): void {
       let tempFieldOptions = this.props.fieldOptions;
       let tempFieldOptionsModifie=false;
       sp.web.lists.getById(this.props.listId).fields.get().then((fields)=>{
           for (let field of fields){
               let idx = findIndex(tempFieldOptions,(fo)=>{return fo.InternalName===field.InternalName});
               if (idx===-1){
                   tempFieldOptions.push({
                       InternalName:field.InternalName,
                       Hidden: field.Hidden,
                       Filterable: field.Filterable,
                       Title:field.Title,
                       TypeAsString:field.TypeAsString,
                       listId:this.props.listId
                   });
                   tempFieldOptionsModifie=true;
               }

           }
           if (tempFieldOptionsModifie){
               this.setState((current)=>({...current, fieldOptions:tempFieldOptions}))
           }


       })
       
    }

    public componentDidUpdate(prevProps: IFieldOptionPanelProps, prevState: IFieldOptionPanelState): void {
        
    }



    public showPanel() {
        this.setState((current) => ({ ...current, showPanel: true }));
    }
    public hidePanel() {
        this.setState((current) => ({ ...current, showPanel: false }));
    }
    public render(): JSX.Element {
        debugger;
        const loading: JSX.Element = this.state.loading ? <div><Spinner label={'Loading options...'} /></div> : <div />;
        const error: JSX.Element = this.state.error !== undefined ? <div className={'ms-TextField-errorMessage ms-u-slideDownIn20'}>Error while loading items: {this.state.error}</div> : <div />;
   
            return (
                <div>
                    <DefaultButton
                        data-automation-id="test"

                        text="Set Column Options"
                        onClick={this.showPanel.bind(this)}
                    />
                    <Panel
                        isBlocking={false}
                        isOpen={this.state.showPanel}
                        onDismiss={this.hidePanel.bind(this)}
                        type={PanelType.medium}
                        headerText="Non-Modal Panel"
                        closeButtonAriaLabel="Close"
                    >
                     <DetailsList
                        items={this.state.fieldOptions}
                        columns={[
                            { minWidth: 120, fieldName: "InternalName", key: "InternalName", name: "InternalName" },
                            {
                                minWidth: 120, fieldName: "Hidden", key: "Hidden", name: "Hidden", onRender: (item?: any, index?: number, column?: IColumn) => {
                                    return (
                                        <Checkbox checked={item.Hidden} />
                                    );

                                }
                            },
                            { minWidth: 120, fieldName: "Filterable", key: "Filterable", name: "Filterable" },
                            { minWidth: 120, fieldName: "Title", key: "Title", name: "Title" },
                            { minWidth: 120, fieldName: "TypeAsString", key: "TypeAsString", name: "TypeAsString" },
                            { minWidth: 120, fieldName: "listId", key: "listId", name: "listId" },
                        ]}
                    />
                    </Panel>
                </div>
            );
        }
   
    private onChanged(option: IDropdownOption, index?: number): void {
        this.selectedKey = option.key;
        // reset previously selected options
        const options: IDropdownOption[] = this.state.options;
        options.forEach((o: IDropdownOption): void => {
            if (o.key !== option.key) {
                o.selected = false;
            }
        });
        this.setState((prevState: IFieldOptionPanelState, props: IFieldOptionPanelProps): IFieldOptionPanelState => {
            prevState.options = options;
            return prevState;
        });
        if (this.props.onChanged) {
            this.props.onChanged(option, index);
        }
    }
}
