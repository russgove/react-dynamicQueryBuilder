import * as React from 'react';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Spinner } from 'office-ui-fabric-react/lib/components/Spinner';
import { IAsyncDropdownProps } from './IAsyncDropdownProps';
import { IAsyncDropdownState } from './IAsyncDropdownState';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';

export default class AsyncDropdown extends React.Component<IAsyncDropdownProps, IAsyncDropdownState> {
    private selectedKey: React.ReactText;

    constructor(props: IAsyncDropdownProps, state: IAsyncDropdownState) {
        debugger;
        super(props);
        this.selectedKey = props.selectedKey;

        this.state = {
            loading: false,
            options: undefined,
            error: undefined,
            showPanel: false // rgove added
        };
    }

    public componentDidMount(): void {
        this.loadOptions();
    }

    public componentDidUpdate(prevProps: IAsyncDropdownProps, prevState: IAsyncDropdownState): void {
        if (this.props.disabled !== prevProps.disabled ||
            this.props.stateKey !== prevProps.stateKey) {
            this.loadOptions();
        }
    }

    private loadOptions(): void {
        this.setState({
            loading: true,
            error: undefined,
            options: undefined
        });

        this.props.loadOptions()
            .then((options: IDropdownOption[]): void => {
                this.setState({
                    loading: false,
                    error: undefined,
                    options: options
                });
            }, (error: any): void => {
                this.setState((prevState: IAsyncDropdownState, props: IAsyncDropdownProps): IAsyncDropdownState => {
                    prevState.loading = false;
                    prevState.error = error;
                    return prevState;
                });
            });
    }

    public showPanel() {
        this.setState((current) => ({ ...current, showPanel: true }))
    }
    public hidePanel() {
        this.setState((current) => ({ ...current, showPanel: false }))
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
                        <span>Content goes here.</span>
                    </Panel>
                </div>
            )
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
        this.setState((prevState: IAsyncDropdownState, props: IAsyncDropdownProps): IAsyncDropdownState => {
            prevState.options = options;
            return prevState;
        });
        if (this.props.onChanged) {
            this.props.onChanged(option, index);
        }
    }
}
