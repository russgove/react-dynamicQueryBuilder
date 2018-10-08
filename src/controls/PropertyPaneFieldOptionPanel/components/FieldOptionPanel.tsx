import * as React from 'react';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { DetailsList, IColumn, SelectionMode, Selection, } from 'office-ui-fabric-react/lib/DetailsList';
import { Spinner } from 'office-ui-fabric-react/lib/components/Spinner';
import { CommandBar } from 'office-ui-fabric-react/lib/components/CommandBar';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/components/Dialog';
import { IContextualMenuItem, IContextualMenu } from "office-ui-fabric-react/lib/ContextualMenu";

import { Checkbox } from 'office-ui-fabric-react/lib/components/Checkbox';
import { IFieldOptionPanelProps } from './IFieldOptionPanelProps';
import { IFieldOptionPanelState } from './IFieldOptionPanelState';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { sp } from "@pnp/sp";
import { findIndex } from "@microsoft/sp-lodash-subset"

export default class FieldOptionPanel extends React.Component<IFieldOptionPanelProps, IFieldOptionPanelState> {
    private selectedKey: React.ReactText;
    private menuItems: Array<IContextualMenuItem>;
    private selection: Selection = new Selection();
    constructor(props: IFieldOptionPanelProps, state: IFieldOptionPanelState) {
        super(props);
        debugger;
        this.selection.getKey = (item => { return item["Id"]; });
        this.menuItems = [{
            key: "edit", icon: "Edit", name: "Edit Column Options",
            onClick: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem): boolean | void => {
                debugger;
               
               
               this.setState((current)=>({...current, editingFieldOption:true}))
            }
        }];

        this.state = {
            loading: false,
            options: undefined,
            error: undefined,
            fieldOptions: [],
            showPanel: false, // rgove added
            selectedFieldId: null,
            selectedListId: null,
            editingFieldOption: false

        };
    }

    public componentDidMount(): void {
        let tempFieldOptions = this.props.fieldOptions;
        let tempFieldOptionsModifie = false;
        sp.web.lists.getById(this.props.listId).fields.get()
            .then((fields) => {
                for (let field of fields) {
                    let idx = findIndex(tempFieldOptions, (fo) => { return fo.InternalName === field.InternalName });
                    if (idx === -1) {
                        tempFieldOptions.push({
                            InternalName: field.InternalName,
                            Hidden: field.Hidden,
                            Filterable: field.Filterable,
                            Title: field.Title,
                            TypeAsString: field.TypeAsString,
                            listId: this.props.listId,
                            IncludeInResults: false,
                        });
                        tempFieldOptionsModifie = true;
                    }

                }
                if (tempFieldOptionsModifie) {
                    this.setState((current) => ({ ...current, fieldOptions: tempFieldOptions }))
                }
            }).catch((e) => {
                debugger;
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
                    type={PanelType.extraLarge}
                    headerText="Non-Modal Panel"
                    closeButtonAriaLabel="Close"
                >
                    <CommandBar
                        isSearchBoxVisible={false}
                        items={this.menuItems}


                    />
                    <DetailsList
                        selection={this.selection}
                        selectionMode={SelectionMode.single}
                        items={this.state.fieldOptions}
                        columns={[
                            { isResizable: true, minWidth: 12, fieldName: "InternalName", key: "InternalName", name: "InternalName" },
                            {
                                isResizable: true,
                                minWidth: 70, fieldName: "Hidden", key: "Hidden", name: "Hidden", onRender: (item?: any, index?: number, column?: IColumn) => {
                                    return (
                                        <Checkbox checked={item.Hidden} />
                                    );

                                }
                            },
                            {
                                isResizable: true,
                                minWidth: 70, fieldName: "Filterable", key: "Filterable", name: "Filterable", onRender: (item?: any, index?: number, column?: IColumn) => {
                                    return (
                                        <Checkbox checked={item.Filterable} />
                                    );

                                }
                            },
                            { isResizable: true, minWidth: 120, fieldName: "Title", key: "Title", name: "Title" },
                            { isResizable: true, minWidth: 100, fieldName: "TypeAsString", key: "TypeAsString", name: "TypeAsString" },
                            { isResizable: true, minWidth: 70, fieldName: "listId", key: "listId", name: "listId" },
                        ]}
                    />
                    <Dialog isBlocking={true}
                        hidden={!this.state.editingFieldOption}
                        onDismiss={(e) => { this.setState((current) => ({ ...current, showApprovalPopup: false })); }}
                        dialogContentProps={{
                            type: DialogType.close,
                            title: "update it",

                            subText: 'All selected items will be updated with the following values'
                        }} >
                        <div>YO</div>
                    </Dialog>
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
